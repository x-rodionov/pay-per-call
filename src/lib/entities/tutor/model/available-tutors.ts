import { writable } from 'svelte/store';
import { fetchUsers, type User } from '$lib/shared/api/users';

export const availableTutors = writable<User[]>([], () => {
  fetchUserList();
  const interval = setInterval(fetchUserList, 5000);

  return () => {
    clearInterval(interval);
  };
});

const fetchUserList = async () => {
  availableTutors.set(await fetchUsers());
};
