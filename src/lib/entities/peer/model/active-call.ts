import { writable } from 'svelte/store';
import type { MediaConnection } from 'peerjs';

export const activeCall = writable<MediaConnection | null>(null);
