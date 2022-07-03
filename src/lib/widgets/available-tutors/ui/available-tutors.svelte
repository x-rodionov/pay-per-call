<script lang="ts">
	import { initiateClass } from '$lib/features/initiate-class';
	import { availableTutors, TutorMinicard } from '$lib/entities/tutor';
	import { H1 } from '$lib/shared/ui';
</script>

<div class="px-12 lg:px-40">
	<H1>Available tutors</H1>
	<div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
		{#each $availableTutors as tutor}
			<TutorMinicard {tutor} on:request={() => initiateClass(tutor)} />
		{/each}
	</div>
</div>
