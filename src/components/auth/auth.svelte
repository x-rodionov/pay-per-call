<script lang="ts">
	import IconLogout from '~icons/material-symbols/logout';
	import IconEdit from '~icons/material-symbols/edit-outline';

	import { FlatIconButton } from '$lib/shared/ui';

	import { connect } from './connect';
	import { user, peer, isLoggedIn } from './model';

	let name = '';

	const logIn = async () => {
		if (name) {
			const res = await connect(name);
			$peer = res.peer;
			$user = res.user;
		}
	};
</script>

<div class="flex items-center">
	{#if !$isLoggedIn}
		<form>
			<input type="text" bind:value={name} placeholder="John Doe" />
			<button type="submit" on:click|preventDefault={logIn}>Log In</button>
		</form>
	{:else}
		Hello, {$user?.wallet_id}!
		<FlatIconButton label="Edit username" icon={IconEdit} on:click={() => ($isLoggedIn = false)} class="ml-2" />
		<FlatIconButton label="Log out" icon={IconLogout} on:click={() => ($isLoggedIn = false)} />
	{/if}
</div>
