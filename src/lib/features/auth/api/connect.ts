import Peer from 'peerjs';

import { peer as peerStore, user as userStore, wallet as walletStore } from '$lib/entities/user';

import { createUser, findUser } from '../../../../utils/users';
import { getPeerId } from '../../../../utils/get-peer-id';
import { getKeyPairAndWallet } from '../../../../utils/ton';

export const connect = async (name: string, mnemonic: string[]) => {
	const ton = await getKeyPairAndWallet(mnemonic);

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
	walletStore.set(ton.wallet);
};
