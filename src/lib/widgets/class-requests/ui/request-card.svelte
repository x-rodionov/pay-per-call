<script lang="ts">
	import type { MediaConnection } from 'peerjs';

	import { acceptCall } from '$lib/features/accept-call';
	import { CTAButton, OutlineButton } from '$lib/shared/ui';

	export let name: string;
	export let call: MediaConnection;
</script>

<article class="flex justify-between items-center py-4 border-b border-gray-400">
	<h2 class="text-xl">{name}</h2>
	<div class="flex">
		<CTAButton class="mr-2" on:click={() => acceptCall(call)}>Join</CTAButton>
		<OutlineButton>Cancel</OutlineButton>
	</div>
</article>
