<script lang="ts">
	import { initiateClass } from '$lib/features/initiate-class';
	import { availableTutors, TutorMinicard } from '$lib/entities/tutor';
	import { user } from '$lib/entities/user';
	import { H1 } from '$lib/shared/ui';
</script>

<div class="px-12 lg:px-40">
	<H1>Available tutors</H1>
	<div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
		{#each $availableTutors.filter(tutor => tutor.id !== $user?.id) as tutor}
			<TutorMinicard {tutor} on:request={() => initiateClass(tutor)} />
		{:else}
			<div class="col-span-full">
				<p class="text-gray-500">No tutors available yet</p>
			</div>
		{/each}
	</div>
</div>
