<script lang="ts">
	import { page } from '$app/stores';
	import { LinklikeTab } from '$lib/shared/ui';

	import { isTeaching } from '../model/is-teaching';
</script>

<div>
	<label>
		<input class="sr-only" type="radio" name="teach-mode" value={true} bind:group={$isTeaching} />
		<LinklikeTab active={$page.url.pathname === '/tutor'}>Teach</LinklikeTab>
	</label>
	<span class="mx-1">/</span>
	<label>
		<input class="sr-only" type="radio" name="teach-mode" value={false} bind:group={$isTeaching} />
		<LinklikeTab active={$page.url.pathname === '/student'}>Learn</LinklikeTab>
	</label>
</div>
