<script lang="ts">
	import LinklikeTab from './linklike-tab.svelte';
	import { isTeaching } from './model';
</script>

<div>
	<label>
		<input class="sr-only" type="radio" name="teach-mode" value={true} bind:group={$isTeaching} />
		<LinklikeTab active={$isTeaching}>Teach</LinklikeTab>
	</label>
	<span class="mx-1">/</span>
	<label>
		<input class="sr-only" type="radio" name="teach-mode" value={false} bind:group={$isTeaching} />
		<LinklikeTab active={!$isTeaching}>Learn</LinklikeTab>
	</label>
</div>
