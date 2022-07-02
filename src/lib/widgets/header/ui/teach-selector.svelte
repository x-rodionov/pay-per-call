<script lang="ts">
	import { onMount } from 'svelte';
	import { LinklikeTab } from '$lib/shared/ui';

	import { isTeaching } from '../model/is-teaching';

	onMount(() => {
		isTeaching.set(window.location.pathname === '/tutor');
	});
</script>

<div>
	<label>
		<input class="sr-only" type="radio" name="teach-mode" value={true} bind:group={$isTeaching} />
		<LinklikeTab active={$isTeaching}>Teach</LinklikeTab>
	</label>
	<span class="mx-1">/</span>
	<label>
		<input class="sr-only" type="radio" name="teach-mode" value={false} bind:group={$isTeaching} />
		<LinklikeTab active={!$isTeaching}>Learn</LinklikeTab>
	</label>
</div>
