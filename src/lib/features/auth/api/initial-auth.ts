import { getPersistedWallet } from '$lib/shared/api/ton';
import { wallet as walletStore, user as userStore } from '$lib/entities/user';
import { findUser } from '$lib/shared/api/users';

export const initialAuth = () => {
	const data = getPersistedWallet();
	if (typeof data === 'undefined') return false;

	// Populate the wallet address field
	// Not sure if this will cause race conditions. It might be better to transform into an async function
	const { wallet } = data;
	wallet.getAddress().then(async (address) => {
		wallet.address = address;
		const addressString = address.toString(true, true, true);
		const user = await findUser(addressString);
		walletStore.set(wallet);
		userStore.set(user);
	});

	return true;
};
