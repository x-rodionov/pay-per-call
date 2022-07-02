import { writable } from 'svelte/store';
import { type SessionType, session } from '../session';

export const sessionRequests = writable<SessionType[]>([]);

export const addRequest = (request: SessionType) => {
	sessionRequests.update((value) => [...value, request]);
};

export const rejectSession = (request: SessionType) => {
	sessionRequests.update((value) => value.filter((item) => item.student !== request.student));
};

export const acceptSession = (newSession: SessionType) => {
	session.update(() => newSession);
};
