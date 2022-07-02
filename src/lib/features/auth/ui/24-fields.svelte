<script lang="ts">
	import { goto } from '$app/navigation';
	import { range } from 'lodash-es';
	import { wordlists } from 'tonweb-mnemonic';

	import { CTAButton, TextField } from '$lib/shared/ui';

	import { connect } from '../api/connect';
	import { MNEMONICS_LENGTH } from '$lib/shared/api/ton';
	import { FAST_MNEMONICS } from '$lib/shared/lib/env';

	let username = '';
	let error = '';
	const fieldValues = FAST_MNEMONICS ? FAST_MNEMONICS.split(' ') : new Array<string>(24).fill('');

	const logIn = async () => {
		error = '';
		if (fieldValues.filter((item) => !!item).length < MNEMONICS_LENGTH) {
			error = `All ${MNEMONICS_LENGTH} words should be filled.`;
			return;
		}

		await connect(username, fieldValues);
		goto('/tutor');
	};
</script>

<datalist id="mnemonics">
	{#each wordlists.EN as word}
		<option value={word} />
	{/each}
</datalist>
<form class="flex flex-col items-center" on:submit|preventDefault={logIn}>
	<TextField id="username-field" label="Display name" required bind:value={username} class="mb-4" />
	<p class="my-2">Wallet mnemonics:</p>
	<div class="grid grid-rows-[repeat(8,minmax(0,1fr))] grid-flow-col justify-items-end mb-4">
		{#each range(1, 25) as i}
			<div class="mb-2">
				<TextField
					id={`word-${i}`}
					labelInline
					label={`${i}.`}
					class="w-32"
					list="mnemonics"
					bind:value={fieldValues[i - 1]}
				/>
			</div>
		{/each}
	</div>
	{#if error}
		<p class="text-red-500 mb-2">{error}</p>
	{/if}
	<CTAButton type="submit">Confirm</CTAButton>
</form>
