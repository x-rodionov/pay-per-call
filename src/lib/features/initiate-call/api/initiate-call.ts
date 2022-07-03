import { get } from 'svelte/store';
import { goto } from '$app/navigation';

import { peer, getPeerId, type User, user as userStore } from '$lib/entities/user';
import { streams } from '$lib/entities/stream';

import { activeCall } from '../model/active-call';

export async function initiateCall(user: User) {
	const ourStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

	const $peer = get(peer);
	if ($peer === null) {
		console.error('The peer was not created yet (somehow)');
		return;
	}

	const call = $peer.call(getPeerId(user), ourStream, {
		metadata: { name: get(userStore)?.name },
	});
	activeCall.set(call);
	call
		.on('stream', function (theirStream) {
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
