import { getPersistedWallet } from '$lib/shared/api/ton';
import { fillUserInfo } from './fill-user-info';

export const initialAuth = () => {
	const data = getPersistedWallet();
	if (typeof data === 'undefined') return false;

	// Populate the wallet address field
	// Not sure if this will cause race conditions. It might be better to transform into an async function
	const { wallet, keyPair } = data;
	wallet.getAddress().then(async (address) => {
		wallet.address = address;
		await fillUserInfo(wallet, keyPair.publicKey);
	});

	return true;
};
