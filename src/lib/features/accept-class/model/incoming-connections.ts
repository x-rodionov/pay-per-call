import { get, writable } from 'svelte/store';
import type { DataConnection } from 'peerjs';

import { peer } from '$lib/entities/peer';

export const incomingConnections = writable<DataConnection[]>([], () => {
  console.log('features/accept-call: starting to listen for incoming connections');
  get(peer)?.on('connection', addConnection);

  return () => {
    console.log('features/accept-call: stopping to listen for incoming connections');
    get(peer)?.off('connection', addConnection);
  };
});

export function addConnection(newConnection: DataConnection) {
  console.log('features/accept-call: incoming connection detected');
  incomingConnections.update((value) => [...value, newConnection]);
}
