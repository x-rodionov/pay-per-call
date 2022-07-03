import Peer from 'peerjs';
import type { WalletV3ContractR1 } from 'tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-r1';

import { user as userStore, wallet as walletStore, getPeerId } from '$lib/entities/user';
import { peer as peerStore } from '$lib/entities/peer';
import { createUser, findUser } from '$lib/shared/api/users';

export async function fillUserInfo(wallet: WalletV3ContractR1, publicKey: Uint8Array, name?: string) {
	const walletAddress = wallet.address!.toString(true, true, true);
    let user = await findUser(walletAddress);
	const publicKeyBase64 = Buffer.from(publicKey.buffer).toString('base64');

	if (!user) {
		user = await createUser({
			wallet_id: walletAddress,
			name: name ?? 'Anonymous',
			public_key: publicKeyBase64,
			cost_per_minute: '0.01',
		});
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
