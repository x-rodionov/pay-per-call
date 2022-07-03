<script lang="ts">
	import RequestCard from './request-card.svelte';
	import { incomingConnections } from '$lib/features/accept-call';
</script>

<div>
	{#each $incomingConnections as connection}
		<RequestCard metadata={connection.metadata}  />
	{:else}
		<div>Wait for the requests to appear...</div>
	{/each}
</div>
