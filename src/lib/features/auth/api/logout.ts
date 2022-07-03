import { get } from 'svelte/store';
import { goto } from '$app/navigation';

import { user as userStore, wallet as walletStore } from '$lib/entities/user';
import { peer as peerStore } from '$lib/entities/peer';
import { removeKeys } from '$lib/shared/api/ton';

export const logout = () => {
  removeKeys();

  get(peerStore)?.destroy();
  peerStore.set(null);
  userStore.set(null);
  walletStore.set(null);

  goto('/');
};
