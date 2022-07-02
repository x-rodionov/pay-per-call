import { get } from 'svelte/store';
import { goto } from '$app/navigation';

import { peer as peerStore, user as userStore, wallet as walletStore } from '$lib/entities/user';
import { removeKeys } from '$lib/shared/api/ton';

export const logout = () => {
	removeKeys();

	get(peerStore)?.destroy();
	peerStore.set(null);
	userStore.set(null);
	walletStore.set(null);

	goto('/');
};
