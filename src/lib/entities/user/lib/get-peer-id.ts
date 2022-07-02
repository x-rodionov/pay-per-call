import type { User } from "../type";
import { APP_NAME } from '$lib/shared/lib/env';

export const getPeerId = (user: User) => {
	return `${APP_NAME}-${user.wallet_id.replace('-', '-a').replace('_', '_a')}`;
};
