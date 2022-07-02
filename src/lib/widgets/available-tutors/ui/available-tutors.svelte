<script lang="ts">
	import { goto } from '$app/navigation';

	import { availableTutors, TutorTile } from '$lib/entities/tutor';
	import { initiateSession } from '../../../../components/session';
  import type { User } from '../../../../utils/users';

	const joinSession = async (personId: User['wallet_id']) => {
		await initiateSession(personId);
		await goto('/awaiting-class');
	};
</script>

<div class="px-12 lg:px-40">
	{#each $availableTutors as tutor}
		<TutorTile {tutor} on:request={(e) => joinSession(e.detail.wallet_id)} />
	{/each}
</div>
