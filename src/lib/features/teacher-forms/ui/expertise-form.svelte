<script lang="ts">
  import { TextField, OutlineButton } from '../../../shared/ui';
  import { user } from '../../../entities/user';
  import {changeUserField} from '../../../shared/api/users';
  
  let expertise = $user?.course || '';
  let touched = false;

  const submit = async () => {
    await changeUserField($user!.wallet_id, { field: 'course', value: expertise });
    $user!.course = expertise;
    touched = false;
  };
</script>

<form class="flex items-end" on:submit|preventDefault={submit}>
  <TextField
    wrapperClass="flex-grow"
    id="expertise-field"
    label="What are you teaching?"
    bind:value={expertise}
    on:input={() => touched = true}
  />
  <OutlineButton type="submit" class="ml-2" disabled={!touched}>Save</OutlineButton>
</form>
