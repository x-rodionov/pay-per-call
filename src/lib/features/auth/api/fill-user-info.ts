import Peer from 'peerjs';

import { peer as peerStore, user as userStore, wallet as walletStore } from '$lib/entities/user';
import { createUser, findUser } from '$lib/shared/api/users';
import { getPeerId } from '$lib/entities/user';
import type { WalletV3ContractR1 } from 'tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-r1';

export async function fillUserInfo(wallet: WalletV3ContractR1, name?: string) {
	const walletAddress = wallet.address!.toString(true, true, true);
    let user = await findUser(walletAddress);
	if (!user) {
		user = await createUser({ wallet_id: walletAddress, name: name ?? 'Anonymous' });
		if (!user) {
			throw new Error("Couldn't create a user");
		}
	}

	const peer = new Peer(getPeerId(user));
	peer.on('error', console.error);
	peerStore.set(peer);
	userStore.set(user);
	walletStore.set(wallet);
}
