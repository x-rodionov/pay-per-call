<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { ConnectionMetadata } from '$lib/entities/peer';
	import { CTAButton, OutlineButton } from '$lib/shared/ui';

	export let metadata: ConnectionMetadata;

	const dispatch = createEventDispatcher<{ accept: void }>();
</script>

<article class="flex justify-between items-center py-4 border-b border-gray-400">
	<div class="flex flex-col space-y-1">
		<h2 class="text-xl">{metadata.tutee.name}</h2>
		<span class="font-roboto-mono text-sm">{metadata.classDuration} minutes</span>
	</div>
	<div class="flex">
		<CTAButton class="mr-2" on:click={() => dispatch('accept')}>Join</CTAButton>
		<OutlineButton>Cancel</OutlineButton>
	</div>
</article>
