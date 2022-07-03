import { supabase } from '$lib/shared/api/supabase';

export interface User {
	id: number;
	wallet_id: string;
	name: string;
	course?: string | null;
	cost_per_minute?: string | null;
	online?: boolean;
}

export const fetchUsers = async () => {
	const res = await supabase.from<User>('users').select('*').eq('online', true);
	return res.data || [];
};

export const findUser = async (walletId: string): Promise<User | null> => {
	const res = await supabase.from<User>('users').select('*').eq('wallet_id', walletId);
	return res.data?.[0] || null;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
	const res = await supabase.from<User>('users').insert([user]);
	return res.data?.[0] || null;
};

type ValueUpdate<T extends keyof User = keyof User> = { field: T; value: User[T] };
export const changeUserField = async (
	walletId: string,
	{ field, value }: ValueUpdate
): Promise<User | null> => {
	const res = await supabase
		.from<User>('users')
		.update({ [field]: value })
		.eq('wallet_id', walletId);
	return res.data?.[0] || null;
};
