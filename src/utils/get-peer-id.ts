import { APP_NAME } from './env';

export const getPeerId = (walletId: string) => {
	return `${APP_NAME}-${walletId}`;
};
