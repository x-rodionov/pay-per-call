<script lang="ts">
	import { TextField, OutlineButton } from '$lib/shared/ui';
	import { user } from '$lib/entities/user';
	import { changeUserField } from '../../../shared/api/users';

	// Trust me, I know better than TS
	let rate = $user?.cost_per_minute || 1 as unknown as string;
	let touched = false;
	
	const submit = async () => {
		await changeUserField($user!.wallet_id, { field: 'cost_per_minute', value: rate });
		$user!.cost_per_minute = rate;
		touched = false;
	};
</script>

<form class="flex items-end" on:submit|preventDefault={submit}>
	<TextField
		wrapperClass="flex-grow"
		id="rate-field"
		type="number"
		label="How much do you charge per minute in nTON?"
		bind:value={rate}
		on:input={() => touched = true}
	/>
	<OutlineButton type="submit" class="ml-2" disabled={!touched}>Save</OutlineButton>
</form>
