import { APP_NAME } from '$lib/shared/lib/env';

export const getPeerId = (walletId: string) => {
	return `${APP_NAME}-${walletId}`;
};
