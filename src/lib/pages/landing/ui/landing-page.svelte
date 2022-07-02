<script lang="ts">
	import clsx from 'clsx';
	import { LogInButton } from '$lib/features/auth';
	import Branding from './branding.svelte';
	import LoveMessage from './love-message.svelte';

	let loginActive = false;
</script>

<div
	class={clsx(
		'flex flex-col items-center font-roboto-slab flex-1 pb-6',
    'transition-all',
		loginActive ? 'pt-12' : 'pt-24'
	)}
>
	<Branding />

	{#if !loginActive}
		<LogInButton on:click={() => (loginActive = true)} />

		<div class="flex-1 flex flex-col justify-end items-center">
			<LoveMessage />
		</div>
	{/if}
</div>
