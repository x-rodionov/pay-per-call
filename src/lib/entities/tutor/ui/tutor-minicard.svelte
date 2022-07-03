<script lang="ts">
  import { createEventDispatcher } from 'svelte';
	import IconStar from '~icons/material-symbols/star';
	import IconStarHalf from '~icons/material-symbols/star-half';
	import IconGrade from '~icons/material-symbols/grade-outline';

  import { CTAButton } from '$lib/shared/ui';
	import type { User } from '$lib/shared/api/users';

	export let tutor: User;

  const dispatch = createEventDispatcher<{ request: User }>();
</script>

<article class="rounded-lg light:shadow bg-white dark:bg-slate-700">
	<div class="flex flex-col px-8 py-6 space-y-1">
		<h2 class="text-xl">{tutor.name}</h2>
		<div class="flex items-center">
			<span class="font-roboto-mono text-sm">{tutor.course}</span>
			<div class="flex ml-3">
				<IconStar class="w-4 h-4" />
				<IconStarHalf class="w-4 h-4" />
				<IconGrade class="w-4 h-4" />
			</div>
		</div>
		<span class="font-roboto-mono text-sm">{tutor.cost_per_minute} nTON/min</span>
	</div>
	<CTAButton class="rounded-t-none w-full" on:click={() => dispatch('request', tutor)}>Request</CTAButton>
</article>
