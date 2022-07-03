import { goto } from '$app/navigation';
import type { DataConnection, MediaConnection } from 'peerjs';

import { activeCall, peer, type ConnectionMetadata } from '$lib/entities/peer';

import { classStateTutee, ClassStateTutee as CSTT } from '../model/tutee-state';
import { streams } from '$lib/entities/stream';
import { get } from 'svelte/store';
import { getPeerId } from '$lib/entities/user';
import { tonweb, type ChannelConfig } from '$lib/shared/api/ton';
import {
	createChannelTutee,
	generateInitState,
	generatePCConfig,
	getStateForSeqno,
	getTuteeWalletSender,
	serializeChannelConfig,
	type PaymentChannel
} from '$lib/shared/api/ton-v2';
import TonWeb from 'tonweb';

export function classStateMachineTutee(connection: DataConnection) {
	let channelConfig: ChannelConfig;
	let channelTuteeSide: PaymentChannel;
	let call: MediaConnection;
	let ourStream: MediaStream;
	let everySecond: ReturnType<typeof setInterval>;
	let seqno = 0;

	return async function (state: CSTT | undefined) {
		if (state === undefined) {
			return;
		}

		switch (state) {
			case CSTT.WAITING_FOR_DATA_ACCEPTANCE: {
				console.log('[SM] Waiting for data acceptance');
				function selfDestructOnData() {
					classStateTutee.set(CSTT.DATA_ACCEPTED);
					connection.off('data', selfDestructOnData);
				}

				connection.on('data', selfDestructOnData);
				goto('/awaiting-class');
				break;
			}
			case CSTT.DATA_ACCEPTED: {
				console.log('[SM] Data accepted');
				const { tutor, classDuration } = connection.metadata as ConnectionMetadata;
				channelConfig = await generatePCConfig(tutor, classDuration);
				connection.send(serializeChannelConfig(channelConfig));

				channelTuteeSide = createChannelTutee(channelConfig, tutor);
				classStateTutee.set(CSTT.WAITING_FOR_PC_CONFIG_ACK);
				break;
			}
			case CSTT.WAITING_FOR_PC_CONFIG_ACK: {
				console.log('[SM] Waiting for PC config ack');
				function selfDestructOnData() {
					classStateTutee.set(CSTT.PC_CONFIG_ACKED);
					connection.off('data', selfDestructOnData);
				}

				connection.on('data', selfDestructOnData);
				break;
			}
			case CSTT.PC_CONFIG_ACKED: {
				console.log('[SM] PC config acked');
				const fromWalletTutee = getTuteeWalletSender(channelTuteeSide);

				await fromWalletTutee.deploy().send(TonWeb.utils.toNano('0.05'));

				const pcCreationPoll = setTimeout(async () => {
					clearInterval(pcCreationPoll);
					classStateTutee.set(CSTT.BC_WAITING_FOR_TOP_UP);
				}, 6000);
				break;
			}
			case CSTT.BC_WAITING_FOR_TOP_UP: {
				console.log('[SM] BC waiting for top up');
				const fromWalletTutee = getTuteeWalletSender(channelTuteeSide);

				await fromWalletTutee
					.topUp({ coinsA: channelConfig.initBalanceA, coinsB: new TonWeb.utils.BN(0) })
					.send(channelConfig.initBalanceA.add(TonWeb.utils.toNano('0.05')));

				const pcTopUpPoll = setInterval(async () => {
					const data = await channelTuteeSide.getData();
					console.log(data);
					if (data.balanceA.gt(new TonWeb.utils.BN(0))) {
						clearInterval(pcTopUpPoll);
						classStateTutee.set(CSTT.BC_WAITING_FOR_CHANNEL_INIT);
					}
				}, 5000);
				break;
			}
			case CSTT.BC_WAITING_FOR_CHANNEL_INIT: {
				console.log('[SM] BC waiting for channel init');
				const fromWalletTutee = getTuteeWalletSender(channelTuteeSide);

				await fromWalletTutee
					.init(generateInitState(channelConfig))
					.send(TonWeb.utils.toNano('0.05'));

				const pcInitPoll = setInterval(async () => {
					const state = await (channelTuteeSide as any).getChannelState();
					if (state === (tonweb.payments as any).PaymentChannel.STATE_OPEN) {
						clearInterval(pcInitPoll);
						classStateTutee.set(CSTT.READY_FOR_TRANSACTIONS);
					}
				}, 5000);
				break;
			}
			case CSTT.READY_FOR_TRANSACTIONS: {
				console.log('[SM] Ready for transactions');
				const { tutor } = connection.metadata as ConnectionMetadata;
				ourStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
				call = get(peer)!.call(getPeerId(tutor), ourStream);
				classStateTutee.set(CSTT.WAITING_FOR_MEDIA_ACCEPTANCE);
				break;
			}
			case CSTT.WAITING_FOR_MEDIA_ACCEPTANCE: {
				console.log('[SM] Waiting for media acceptance');
				function selfDestructOnStream(theirStream: MediaStream) {
					streams.set([ourStream, theirStream]);
					activeCall.set(call);
					goto('/class');
					call.off('stream', selfDestructOnStream);
					classStateTutee.set(CSTT.MEDIA_ACCEPTED);
				}

				call.on('stream', selfDestructOnStream);
				break;
			}
			case CSTT.MEDIA_ACCEPTED: {
				console.log('[SM] Media accepted');
				everySecond =
					everySecond ??
					setInterval(async () => {
						const { tutor } = connection.metadata as ConnectionMetadata;
						const stateNow = getStateForSeqno(++seqno, channelConfig, tutor);
						const signatureTutee = await channelTuteeSide.signState(stateNow);
						connection.send({
							signature: signatureTutee,
							state: stateNow
						});
						classStateTutee.set(CSTT.WAITING_FOR_APPROVAL);
					}, 1000);
				break;
			}
			case CSTT.WAITING_FOR_APPROVAL: {
				console.log('[SM] Waiting for approval');
				async function selfDestructOnData(data: any) {
					connection.off('data', selfDestructOnData);
					if (data === 'ack') {
						classStateTutee.set(CSTT.MEDIA_ACCEPTED);
					} else {
						classStateTutee.set(CSTT.FIN_RECEIVED);
						clearInterval(everySecond);
						const { lastState, closeSignature } = data;
						if (!(await channelTuteeSide.verifyClose(lastState, closeSignature))) {
							throw new Error('Invalid tutor signature');
						}

						const fromWalletTutee = getTuteeWalletSender(channelTuteeSide);

						await (
							fromWalletTutee.close({
								...lastState,
								hisSignature: closeSignature
							}) as any
						).send(TonWeb.utils.toNano('0.05'));
					}
				}

				connection.on('data', selfDestructOnData);
				break;
			}
		}
	};
}
