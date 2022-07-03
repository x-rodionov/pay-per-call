import { get, writable } from 'svelte/store';
import type Peer from 'peerjs';

export const peer = writable<Peer | null>(null);

export function getValidPeer() {
  const $peer = get(peer);
  if ($peer === null || $peer.disconnected) {
    throw $peer;
  }
  return $peer;
}
