import { writable } from 'svelte/store';
import type { MediaConnection } from 'peerjs';

export const incomingCalls = writable<MediaConnection[]>([]);

export function addCall(newCall: MediaConnection) {
  incomingCalls.update((value) => [...value, newCall]);
}
