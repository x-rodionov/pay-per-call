import { writable } from 'svelte/store';

export const streams = writable<[MediaStream, MediaStream] | null>(null);
