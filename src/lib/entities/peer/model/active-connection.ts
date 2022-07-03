import { writable } from 'svelte/store';
import type { DataConnection } from 'peerjs';

export const activeConnection = writable<DataConnection | null>(null);
