import Peer from 'peerjs';

import { peer as peerStore, user as userStore } from '$lib/entities/user';

import { createUser, findUser } from '../../../../utils/users';
import { getPeerId } from '../../../../utils/get-peer-id';

export const connect = async (name: string) => {
	const peer = new Peer(getPeerId(name));

	let user = await findUser(name);
	if (!user) {
		user = await createUser({ wallet_id: name });
		if (!user) {
			throw new Error("Couldn't create a user");
		}
	}

	peerStore.set(peer);
	userStore.set(user);
};
