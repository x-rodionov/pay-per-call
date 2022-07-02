import { goto } from '$app/navigation';
import { writable } from 'svelte/store';

export const isTeaching = writable(false);

isTeaching.subscribe(($isTeaching) => {
	if ($isTeaching) {
		goto('/tutor');
	} else {
		goto('/student');
	}
});
