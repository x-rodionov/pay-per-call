import type { User } from "../type";

export const getPeerId = (user: User) => {
	return `TODO-${user.wallet_id}`;
};
