<script lang="ts">
	import { goto } from '$app/navigation';
	import { range } from 'lodash-es';
	import { wordlists } from 'tonweb-mnemonic';

	import { CTAButton, TextField } from '$lib/shared/ui';
	import { FAST_MNEMONICS } from '$lib/shared/lib/env';
	import { MNEMONICS_LENGTH } from '$lib/shared/api/ton';

	import { connect } from '../api/connect';

	let username = '';
	const fieldValues = FAST_MNEMONICS ? FAST_MNEMONICS.split(' ') : new Array<string>(24).fill('');

	const logIn = async (redirectTo: string) => {
		await connect(username, fieldValues);
		goto(redirectTo);
	};

	function insertMnemonic(event: ClipboardEvent) {
		event.preventDefault();
		const paste = (event.clipboardData || (window as any).clipboardData).getData('text');
		const words = paste.split(' ');
		if (words.length !== MNEMONICS_LENGTH) {
			return;
		}

		for (let i = 0; i < words.length; i++) {
			fieldValues[i] = words[i];
		}
	}
</script>

<datalist id="mnemonics">
	{#each wordlists.EN as word}
		<option value={word} />
	{/each}
</datalist>
<form class="flex flex-col items-center">
	<p class="my-4">Enter your wallet's 24 secret words:</p>
	<div class="grid grid-rows-[repeat(8,minmax(0,1fr))] grid-flow-col justify-items-end mb-4">
		{#each range(1, 25) as i}
			<div class="mb-2">
				<TextField
					id={`word-${i}`}
					labelInline
					label={`${i}.`}
					class="w-32"
					list="mnemonics"
					required
					on:paste={insertMnemonic}
					bind:value={fieldValues[i - 1]}
				/>
			</div>
		{/each}
	</div>
	<div class="flex space-x-2">
		<CTAButton on:click={() => logIn('/tutor')}>Log in as a tutor</CTAButton>
		<CTAButton on:click={() => logIn('/student')}>Log in as a student</CTAButton>
	</div>
</form>
