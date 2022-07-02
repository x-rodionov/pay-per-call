import { getPersistedWallet } from '$lib/shared/api/ton';
import { wallet as walletStore } from '$lib/entities/user';

export const initialAuth = () => {
	const data = getPersistedWallet();
	if (typeof data === 'undefined') return false;

	// TODO: get wallet ID, fetch supabase to get the user data
	// For now, the data.wallet.address is always null
	walletStore.set(data.wallet);

	return true;
};
