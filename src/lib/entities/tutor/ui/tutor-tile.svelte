<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { CTAButton } from '$lib/shared/ui';
	import type { User } from '$lib/shared/api/users';

	export let tutor: User;

	const dispatch = createEventDispatcher<{ request: User }>();
</script>

<article class="flex justify-between items-center py-4 border-b border-gray-400">
	<h2 class="text-xl">{tutor.wallet_id}</h2>
	<div class="flex">
		<CTAButton class="mr-2" on:click={() => dispatch('request', tutor)}>Request</CTAButton>
	</div>
</article>
