import { writable } from 'svelte/store';
import { fetchUsers, type User } from '../../utils/users';

export const userList = writable<User[]>([], () => {
	fetchUserList();
	const interval = setInterval(fetchUserList, 5000);

	return () => {
		clearInterval(interval);
	};
});

const fetchUserList = async () => {
	const res = await fetchUsers();
	userList.update(() => res);
};
