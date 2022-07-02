import Peer from 'peerjs';
import { createUser, findUser } from './users';
import { getPeerId } from './get-peer-id';

export const connect = async (name: string): Promise<Peer> => {
	const peer = new Peer(getPeerId(name));

	let user = await findUser(name);
	if (!user) {
		user = await createUser({ wallet_id: name });
		if (!user) {
			throw new Error("Couldn't create a user");
		}
	}

	return new Promise((resolve) => {
		peer.on('open', () => {
			resolve(peer);
		});
	});
};
