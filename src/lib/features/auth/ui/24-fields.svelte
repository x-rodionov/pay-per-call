<script lang="ts">
	import { wordlists } from 'tonweb-mnemonic';
	// import { range } from 'lodash-es';
	import { goto } from '$app/navigation';

  import { peer, user } from '$lib/entities/user';
	import { CTAButton, TextField } from '$lib/shared/ui';

	import { connect } from '../api/connect';

	let username = '';
	const fieldValues = new Array<string>(24).fill('');

	const logIn = async () => {
		const res = await connect(username);
		$peer = res.peer;
		$user = res.user;
		goto('/tutor');
	};
</script>

<datalist id="mnemonics">
	{#each wordlists.EN as word}
		<option value={word} />
	{/each}
</datalist>
<form class="flex flex-col items-center" on:submit|preventDefault={logIn}>
	<TextField id="username-field" label="Username" required bind:value={username} class="mb-4" />
	<!-- <div class="grid grid-rows-[repeat(8,minmax(0,1fr))] grid-flow-col justify-items-end mb-4">
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
	</div> -->
	<CTAButton type="submit">Confirm</CTAButton>
</form>
