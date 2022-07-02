import { writable, derived } from 'svelte/store';
import type { User } from '../../utils/users';

export const user = writable<User | null>(null);

export const isLoggedIn = derived(user, (values) => !!values);
