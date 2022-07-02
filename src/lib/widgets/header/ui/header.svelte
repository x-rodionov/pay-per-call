<script lang="ts">
	import IconLogout from '~icons/material-symbols/logout';

	import { user } from '$lib/entities/user';
	import { logout } from '$lib/features/auth';
	import { FlatIconButton } from '$lib/shared/ui';

	import Branding from './branding.svelte';
	import TeachSelector from './teach-selector.svelte';
	import NameEdit from './name-edit.svelte';
</script>

<header class="flex justify-between items-center px-12 lg:px-40 py-12">
	<Branding />
	<TeachSelector />
	<div class="flex items-center">
		{#if $user}
			<NameEdit user={$user} />
		{/if}
		<FlatIconButton label="Log out" icon={IconLogout} on:click={logout} />
	</div>
</header>
