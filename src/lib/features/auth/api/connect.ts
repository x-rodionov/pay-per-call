import Peer from 'peerjs';

import { peer as peerStore, user as userStore, wallet as walletStore } from '$lib/entities/user';

import { createUser, findUser } from '$lib/shared/api/users';
import { getPeerId } from '$lib/entities/user';
import { getKeyPairAndWallet } from '$lib/shared/api/ton';

export const connect = async (name: string, mnemonic: string[]) => {
	const ton = await getKeyPairAndWallet(mnemonic);


	let user = await findUser(name);
	if (!user) {
		user = await createUser({ wallet_id: name });
		if (!user) {
			throw new Error("Couldn't create a user");
		}
	}

	const peer = new Peer(getPeerId(user), {
		host: 'ec2-52-59-224-143.eu-central-1.compute.amazonaws.com',
		port: 9000,
		path: '/myapp'
	});

	peerStore.set(peer);
	userStore.set(user);
	walletStore.set(ton.wallet);
};
