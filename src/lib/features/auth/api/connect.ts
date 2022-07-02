import { getKeyPairAndWallet } from '$lib/shared/api/ton';
import { fillUserInfo } from './fill-user-info';

export const connect = async (name: string, mnemonic: string[]) => {
	const { wallet } = await getKeyPairAndWallet(mnemonic);
	await fillUserInfo(wallet);
};
