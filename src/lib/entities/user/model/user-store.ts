import { writable } from 'svelte/store';

import type { User } from '$lib/shared/api/users';

export const user = writable<User | null>(null);
