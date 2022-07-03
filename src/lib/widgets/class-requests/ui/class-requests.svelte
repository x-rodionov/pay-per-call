<script lang="ts">
	import RequestCard from './request-card.svelte';
	import { acceptClass, incomingConnections } from '$lib/features/accept-class';
</script>

<div>
	{#each $incomingConnections as connection}
		<RequestCard metadata={connection.metadata} on:accept={() => acceptClass(connection)} />
	{:else}
		<div>Wait for the requests to appear...</div>
	{/each}
</div>
