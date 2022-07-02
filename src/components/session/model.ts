import { writable, get } from 'svelte/store';
import { user } from '../auth';

export interface Session {
	loading: boolean;
	teacher: string;
	student: string;
}

export const session = writable<Session | null>(null);

export const initiateSession = (teacherId: string) => {
	const userId = get(user)?.wallet_id;
	if (!userId) return;

	session.update(() => ({
		loading: true,
		student: userId,
		teacher: teacherId
	}));
};
