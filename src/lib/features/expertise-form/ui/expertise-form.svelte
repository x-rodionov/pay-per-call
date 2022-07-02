<script>
  import { TextField, OutlineButton } from "$lib/shared/ui";

  let expertise = '';
</script>

<form class="flex items-end" on:submit|preventDefault={() => console.log(expertise)}>
  <TextField id="expertise-field" label="What are you teaching?" bind:value={expertise} />
  <OutlineButton type="submit" class="ml-2" disabled>Save</OutlineButton>
</form>
