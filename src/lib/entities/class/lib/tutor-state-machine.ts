import { goto } from '$app/navigation';
import type { DataConnection, MediaConnection, Peer } from 'peerjs';

import { activeCall, peer, type ConnectionMetadata } from '$lib/entities/peer';

import { classStateTutor, ClassStateTutor as CSTR } from '../model/tutor-state';
import { streams } from '$lib/entities/stream';
import { get } from 'svelte/store';
import type { ChannelConfig, ChannelState } from '$lib/shared/api/ton';
import type { PaymentChannel } from '$lib/shared/api/ton-v2';
import { createChannelTutor, deserializeChannelConfig } from '$lib/shared/api/ton-tutor';

export function classStateMachineTutor(connection: DataConnection) {
	let channelConfig: ChannelConfig;
	let channelTutorSide: PaymentChannel;
	let call: MediaConnection;
	let ourStream: MediaStream;
	let lastState: ChannelState;

	return async function (state: CSTR | undefined) {
		if (state === undefined) {
			return;
		}

		switch (state) {
			case CSTR.WAITING_FOR_PC_CONFIG: {
				console.log('[SM] Waiting for PC config');
				function selfDestructOnData(data: any) {
					const { tutee } = connection.metadata as ConnectionMetadata;
					channelConfig = deserializeChannelConfig(data);
					channelTutorSide = createChannelTutor(channelConfig, tutee);

					classStateTutor.set(CSTR.PC_CONFIG_RECEIVED);
					connection.off('data', selfDestructOnData);
				}

				connection.send('syn');
				connection.on('data', selfDestructOnData);
				break;
			}
			case CSTR.PC_CONFIG_RECEIVED: {
				console.log('[SM] PC config received');
				// TODO: check addresses of both sides here
				connection.send('ack');
				classStateTutor.set(CSTR.WAITING_FOR_MEDIA);
				break;
			}
			case CSTR.WAITING_FOR_MEDIA: {
				console.log('[SM] Waiting for media');
				async function selfDestructOnCall(this: Peer, incomingCall: MediaConnection) {
					call = incomingCall;
					ourStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
					call.answer(ourStream);
					this.off('call', selfDestructOnCall);
					classStateTutor.set(CSTR.MEDIA_RECEIVED);
				}

				get(peer)!.on('call', selfDestructOnCall);
				break;
			}
			case CSTR.MEDIA_RECEIVED: {
				console.log('[SM] Media received');
				function selfDestructOnStream(theirStream: MediaStream) {
					streams.set([ourStream, theirStream]);
					activeCall.set(call);
					goto('/class');
					call.off('stream', selfDestructOnStream);
					classStateTutor.set(CSTR.WAITING_FOR_TRANSACTIONS);
				}

				call.on('stream', selfDestructOnStream);
				break;
			}
			case CSTR.WAITING_FOR_TRANSACTIONS: {
				console.log('[SM] Waiting for transactions');
				connection.on('data', (async ({ signature, state }: any) => {
					lastState = state;
					if (!(await channelTutorSide.verifyState(state, signature))) {
						throw new Error('Invalid signature from tutee');
					}
					await channelTutorSide.signState(state);
					connection.send('ack');
				}) as any);
				break;
			}
			case CSTR.CLOSING: {
				console.log('[SM] Closing');
				const closeSignature = await channelTutorSide.signClose(lastState);
				connection.send({ lastState, closeSignature });
				connection.off('data');
			}
		}
	};
}
