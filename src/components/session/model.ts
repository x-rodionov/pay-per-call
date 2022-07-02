import { writable, get } from 'svelte/store';
import type { DataConnection, MediaConnection } from 'peerjs';
import { user, peer } from '../auth';
import { getPeerId } from '../../utils/get-peer-id';

export interface Session {
	loading: boolean;
	teacher: string;
	student: string;
	data: DataConnection;
	call: MediaConnection;
	stream?: MediaStream;
}

export const session = writable<Session | null>(null);

export const initiateSession = (teacherId: string) => {
	const userId = get(user)?.wallet_id;
	const userPeer = get(peer);
	if (!userId || !userPeer) return;

	const stream = new MediaStream();

	const connection = userPeer.connect(getPeerId(teacherId));
	const call = userPeer.call(getPeerId(teacherId), stream);

	session.update(() => ({
		loading: true,
		student: userId,
		teacher: teacherId,
		data: connection,
		call,
		stream
	}));
	// connection.on('open', () => {
	// 	console.log('opened');
	// 	connectionModel.update(() => connection);
	// });
};
