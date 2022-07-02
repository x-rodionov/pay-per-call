<script lang="ts">
  import {onMount} from 'svelte';
  import { type User, fetchUsers } from '../utils/users';
  import {user} from '../components/auth';

  let users: User[] = [];
  
  onMount(async () => {
    users = await fetchUsers();
  });
  
  const joinSession = async () => {
    console.log('session');
  };
</script>

<section>
  <h2>User list</h2>
  
  <div class="grid grid-cols-3 px-4">
    {#each users as person}
      {#if !$user || $user.wallet_id !== person.walletId }
        <div class="flex flex-col p-4 border rounded">
          {person.wallet_id}
          <button
            type="button"
            disabled={!$user}
            on:click={joinSession}
          >
            Connect
          </button>
        </div>
      {/if}
    {/each}
  </div>
</section>
