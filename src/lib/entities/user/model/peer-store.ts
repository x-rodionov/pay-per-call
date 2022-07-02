import { writable } from 'svelte/store';
import type Peer from 'peerjs';

export const peer = writable<Peer | null>(null);
