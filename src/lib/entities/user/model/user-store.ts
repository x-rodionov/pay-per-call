import { writable } from 'svelte/store';

import type { User } from '../../../../utils/users';

export const user = writable<User | null>(null);
