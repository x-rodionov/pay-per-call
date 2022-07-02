<script lang="ts">
	import { TextField, OutlineButton } from '$lib/shared/ui';

	// Trust me, I know better than TS
	let rate = 1 as unknown as string;
</script>

<form class="flex items-end" on:submit|preventDefault={() => console.log(rate)}>
	<TextField
		id="rate-field"
		type="number"
		label="How much do you charge per minute in nTON?"
		bind:value={rate}
	/>
	<OutlineButton type="submit" class="ml-2" disabled>Save</OutlineButton>
</form>
