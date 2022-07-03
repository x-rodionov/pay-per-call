import { get } from 'svelte/store';
import { goto } from '$app/navigation';

import { user as userStore, getPeerId } from '$lib/entities/user';
import { peer, activeCall } from '$lib/entities/peer';
import { streams } from '$lib/entities/stream';
import type { User } from '$lib/shared/api/users';

import { requestLessonStart } from '$lib/shared/api/ton';
import TonWeb from 'tonweb';

export async function initiateCall(user: User) {
	const ourStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
	const { channelConfig, channel, fromWallet } = await requestLessonStart(user);

	const $peer = get(peer);
	if ($peer === null) {
		console.error('The peer was not created yet (somehow)');
		return;
	}

	const call = $peer.call(getPeerId(user), ourStream, {
		metadata: {
			tutee: get(userStore),
			tutor: user,
			paymentChannelConfig: channelConfig,
			channelAddress: (await channel.getAddress()).toString(true, true, true)
		}
	});
	activeCall.set(call);

	call
		.on('stream', async function (theirStream) {
			// Call was accepted
			await fromWallet.deploy().send(TonWeb.utils.toNano('0.05'));
			await fromWallet
				.topUp({ coinsA: channelConfig.initBalanceA, coinsB: new TonWeb.utils.BN(0) })
				.send(channelConfig.initBalanceA.add(TonWeb.utils.toNano('0.05')));
			streams.set([ourStream, theirStream]);
			goto('/class');
		})
		.on('error', function (_err) {
			// TODO: handle error
			goto('/student?callFailed=true');
		});

	// Go to the waiting room for now, we will be redirected to the classroom
	//   automatically when the tutor accepts the call
	goto('/awaiting-class');
}
