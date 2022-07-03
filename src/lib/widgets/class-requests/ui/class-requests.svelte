<script lang="ts">
	import { onMount } from 'svelte';

	import { peer } from '$lib/entities/user';

	import RequestCard from './request-card.svelte';
  import { incomingCalls, addCall } from '$lib/features/accept-call';

	onMount(() => {
		$peer?.on('call', addCall);
		$peer?.on('call', console.log);

		return () => {
			$peer?.off('call');
		};
	});
</script>

<div>
	{#each $incomingCalls as call}
		<RequestCard {call} name={call.metadata.name} />
	{:else}
		<div>Wait for the requests to appear...</div>
	{/each}
</div>
