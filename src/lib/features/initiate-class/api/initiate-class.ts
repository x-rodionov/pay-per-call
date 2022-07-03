import { get } from 'svelte/store';

import { getPeerId, user } from '$lib/entities/user';
import { classState, CS, classStateMachine } from '$lib/entities/class';
import type { User } from '$lib/shared/api/users';

import { getValidPeer, activeConnection } from '$lib/entities/peer';

/**
 * In order to initiate a class with a tutor, we need to establish a data connection
 * with them. That data connection will carry the metadata about both parties and
 * the expected class duration.
 * @param classDuration The duration of the class in minutes.
 */
export async function initiateClass(them: User, classDuration: number = 60) {
	try {
		const $peer = getValidPeer();

		const connection = $peer.connect(getPeerId(them), {
			metadata: {
				tutor: them,
				tutee: get(user),
				classDuration
			}
		});

		activeConnection.set(connection);
		classState.subscribe(classStateMachine(connection));
		classState.set(CS.WAITING_FOR_DATA_ACCEPTANCE);
	} catch (e) {
		console.error('The peer is g0ne/disconnected (somehow)');
	}
}
