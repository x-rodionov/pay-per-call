<script lang="ts">
	import { page } from '$app/stores';
	import { LinklikeTab } from '$lib/shared/ui';

	import { isTeaching } from '../model/is-teaching';
</script>

<div>
	<LinklikeTab href="/tutor">Teach</LinklikeTab>
	<span class="mx-1">/</span>
	<LinklikeTab href="/student">Learn</LinklikeTab>
</div>
