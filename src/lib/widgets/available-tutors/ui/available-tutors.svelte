<script lang="ts">
	import { availableTutors, TutorTile } from '$lib/entities/tutor';
	import { initiateCall } from '$lib/features/initiate-call';
</script>

<div class="px-12 lg:px-40">
	{#each $availableTutors as tutor}
		<TutorTile {tutor} on:request={(e) => initiateCall(e.detail)} />
	{/each}
</div>
