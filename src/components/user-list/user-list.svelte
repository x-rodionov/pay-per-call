<script lang="ts">
  import { goto } from '$app/navigation';
  
  import {userList} from './model';
  import {user} from '$lib/entities/user';
  import {initiateSession} from '../session';
  
  const joinSession = (personId) => {
    initiateSession(personId);
    goto('/session');
  };
</script>

<div class="grid grid-cols-3 px-4">
  {#each $userList as person}
    {#if !$user || $user.wallet_id !== person.walletId }
      <div class="flex flex-col p-4 border rounded">
        {person.wallet_id}
        <button
          type="button"
          disabled={!$user}
          on:click={() => joinSession(person.wallet_id)}
        >
          Connect
        </button>
      </div>
    {/if}
  {/each}
</div>
