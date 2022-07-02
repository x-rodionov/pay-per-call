import { get } from 'svelte/store';
import type { DataConnection, MediaConnection } from 'peerjs';
import { peer, user } from '$lib/entities/user';
import { addRequest } from './model';

const isDataConnection = (
	connection: DataConnection | MediaConnection
): connection is DataConnection => connection.type === 'data';
const isMediaConnection = (
	connection: DataConnection | MediaConnection
): connection is MediaConnection => connection.type === 'media';

/**
 * The function that waits for two connections (data and media) to be answered by the peer
 * to move this session into the list of class requests
 */
const prepareSession = () => {
	let studentId: string | null = null;
	let dataConnection: DataConnection | null = null;
	let mediaConnection: MediaConnection | null = null;

	const initiateSession = () => {
		const userId = get(user)?.wallet_id;
		if (!userId) return;

		addRequest({
			loading: true,
			student: studentId!,
			teacher: userId,
			data: dataConnection!,
			call: mediaConnection!
		});
	};

	return (connection: DataConnection | MediaConnection) => {
		if (isDataConnection(connection)) dataConnection = connection;
		if (isMediaConnection(connection)) mediaConnection = connection;
		if (studentId && connection.peer === studentId) {
			initiateSession();
		} else {
			studentId = connection.peer;
		}
	};
};

peer.subscribe((value) => {
	if (!value) return;

	const useConnection = prepareSession();

	value.on('connection', useConnection);
	value.on('call', useConnection);
});
