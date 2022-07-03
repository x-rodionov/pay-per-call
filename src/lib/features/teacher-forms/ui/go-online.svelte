<script lang="ts">
  import { CTAButton } from '$lib/shared/ui';
  import { user } from '$lib/entities/user';
  import { changeUserField } from '../../../shared/api/users';

  const go = async (online: boolean) => {
    if ($user !== null) {
      await changeUserField($user!.wallet_id, { field: 'online', value: online });
      $user.online = online;
    }
  };
</script>

{#if $user?.online}
  <p>You are online. Go offline to stop receiving requests for classes</p>
  <CTAButton class="mt-2" on:click={() => go(false)}>Go offline</CTAButton>
{:else}
  <p>You are currently offline. Go online to start receiving requests for classes</p>
  <CTAButton class="mt-2" on:click={() => go(true)}>Go online</CTAButton>
{/if}
