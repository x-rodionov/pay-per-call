import { APP_NAME } from '$lib/shared/lib/env';
import type { User } from '$lib/shared/api/users';

export const getPeerId = (user: User) => {
  return `${APP_NAME}-${user.wallet_id.replace('-', '-b').replace('_', '_b')}`;
};
