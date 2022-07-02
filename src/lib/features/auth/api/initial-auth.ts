import { getPersistedWallet } from '$lib/shared/api/ton';
import { wallet as walletStore } from '$lib/entities/user';

export const initialAuth = () => {
	const data = getPersistedWallet();
	if (typeof data === 'undefined') return false;

	// Populate the wallet address field
	// Not sure if this will cause race conditions. It might be better to transform into an async function
	const { wallet } = data;
	wallet.getAddress().then((address) => {
		wallet.address = address;
		walletStore.set(wallet);
	});

	return true;
};
