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
	const stream = new MediaStream();
	newSession.call.answer(stream);
	newSession.teacherStream = stream;
	newSession.loading = false;

	newSession.call.on('stream', (studentStream) => {
		console.log('student stream', studentStream);
	});

	session.set(newSession);
};
