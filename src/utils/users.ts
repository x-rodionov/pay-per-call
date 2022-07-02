import { supabase } from './supabase';

export interface User {
	id: number;
	wallet_id: string;
}

export const fetchUsers = async () => {
	const res = await supabase.from<User>('users').select('*');
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
