import { goto } from '$app/navigation';
import type { DataConnection, MediaConnection } from 'peerjs';

import { activeCall, peer, type ConnectionMetadata } from '$lib/entities/peer';

import { classState, ClassState as CS } from '../model/state';
import { streams } from '$lib/entities/stream';
import { get } from 'svelte/store';
import { getPeerId } from '$lib/entities/user';
import { tonweb } from '$lib/shared/api/ton';
import {
	createChannelTutee,
	generateInitState,
	generatePCConfig,
	getStateForSeqno,
	getTuteeWalletSender,
	type ChannelConfig,
	type PaymentChannel
} from '$lib/shared/api/ton-v2';
import TonWeb from 'tonweb';

export function classStateMachine(connection: DataConnection) {
	let channelConfig: ChannelConfig;
	let channelTuteeSide: PaymentChannel;
	let call: MediaConnection;
	let ourStream: MediaStream;
	let everySecond: ReturnType<typeof setInterval>;
	let seqno = 0;

	return async function (state: CS) {
		switch (state) {
			case CS.WAITING_FOR_DATA_ACCEPTANCE: {
				function selfDestructOnDataAccepted() {
					classState.set(CS.DATA_ACCEPTED);
					connection.off('open', selfDestructOnDataAccepted);
				}

				connection.on('open', selfDestructOnDataAccepted);
				goto('/awaiting-class');
				break;
			}
			case CS.DATA_ACCEPTED: {
				const { tutor, classDuration } = connection.metadata as ConnectionMetadata;
				channelConfig = await generatePCConfig(tutor, classDuration);
				connection.send(channelConfig);
				channelTuteeSide = createChannelTutee(channelConfig, tutor);
				classState.set(CS.WAITING_FOR_PC_CONFIG_ACK);
				break;
			}
			case CS.WAITING_FOR_PC_CONFIG_ACK: {
				function selfDestructOnData() {
					classState.set(CS.PC_CONFIG_ACKED);
					connection.off('data', selfDestructOnData);
				}

				connection.on('data', selfDestructOnData);
				break;
			}
			case CS.PC_CONFIG_ACKED: {
				const fromWalletTutee = getTuteeWalletSender(channelTuteeSide);

				await fromWalletTutee.deploy().send(TonWeb.utils.toNano('0.05'));

				const pcCreationPoll = setTimeout(async () => {
					clearInterval(pcCreationPoll);
					classState.set(CS.BC_WAITING_FOR_TOP_UP);
				}, 6000);
				break;
			}
			case CS.BC_WAITING_FOR_TOP_UP: {
				const fromWalletTutee = getTuteeWalletSender(channelTuteeSide);

				await fromWalletTutee
					.topUp({ coinsA: channelConfig.initBalanceA, coinsB: new TonWeb.utils.BN(0) })
					.send(channelConfig.initBalanceA.add(TonWeb.utils.toNano('0.05')));

				const pcTopUpPoll = setInterval(async () => {
					const data = await channelTuteeSide.getData();
					if (data.balanceA.gt(new TonWeb.utils.BN(0))) {
						clearInterval(pcTopUpPoll);
						classState.set(CS.BC_WAITING_FOR_CHANNEL_INIT);
					}
				}, 5000);
				break;
			}
			case CS.BC_WAITING_FOR_CHANNEL_INIT: {
				const fromWalletTutee = getTuteeWalletSender(channelTuteeSide);

				await fromWalletTutee
					.init(generateInitState(channelConfig))
					.send(TonWeb.utils.toNano('0.05'));

				const pcInitPoll = setInterval(async () => {
					const state = await (channelTuteeSide as any).getChannelState();
					if (state === (tonweb.payments as any).PaymentChannel.STATE_OPEN) {
						clearInterval(pcInitPoll);
						classState.set(CS.READY_FOR_TRANSACTIONS);
					}
				}, 5000);
				break;
			}
			case CS.READY_FOR_TRANSACTIONS: {
				const { tutor } = connection.metadata as ConnectionMetadata;
				ourStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
				call = get(peer)!.call(getPeerId(tutor), ourStream);
				classState.set(CS.WAITING_FOR_MEDIA_ACCEPTANCE);
				break;
			}
			case CS.WAITING_FOR_MEDIA_ACCEPTANCE: {
				function selfDestructOnStream(theirStream: MediaStream) {
					streams.set([ourStream, theirStream]);
					activeCall.set(call);
					goto('/class');
					call.off('stream', selfDestructOnStream);
					classState.set(CS.MEDIA_ACCEPTED);
				}

				call.on('stream', selfDestructOnStream);
				break;
			}
			case CS.MEDIA_ACCEPTED: {
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
						classState.set(CS.WAITING_FOR_APPROVAL);
					}, 1000);
				break;
			}
			case CS.WAITING_FOR_APPROVAL: {
				async function selfDestructOnData(data: any) {
					connection.off('data', selfDestructOnData);
					if (data === 'ack') {
						classState.set(CS.MEDIA_ACCEPTED);
					} else {
						classState.set(CS.FIN_RECEIVED);
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
