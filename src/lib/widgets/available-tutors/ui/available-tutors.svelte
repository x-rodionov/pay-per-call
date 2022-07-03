<script lang="ts">
	import { availableTutors, TutorMinicard } from '$lib/entities/tutor';
	import { initiateCall } from '$lib/features/initiate-call';
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-12 lg:px-40">
	{#each $availableTutors as tutor}
		<TutorMinicard {tutor} on:request={(e) => initiateCall(e.detail)} />
	{/each}
</div>
