<script lang="ts">
  import {onMount} from 'svelte';
  import Peer from 'peerjs';
  import { type User, fetchUsers } from '../utils/users';
  import {connect} from '../utils/connect';
  
  let name = '';
  let loggedIn = false;
  
  let peer: Peer = null;
  let users: User[] = [];
  let currentUser: User = null;
  
  onMount(async () => {
    users = await fetchUsers();
  });
  
  const logIn = async (e: Event) => {
    e.preventDefault();
    if (name) {
      const res = await connect(name);
      peer = res.peer;
      currentUser = res.user;
      loggedIn = true;
    }
  };
  
  const joinSession = async () => {
    console.log('session');
  };
</script>

{#if !loggedIn}
  <h1>Welcome!</h1>
  <p>Please, enter your name below</p>
  <form>
    <input type="text" bind:value={name} placeholder="John Doe" />
    <button type="submit" on:click={logIn}>Log In</button>
  </form>
{:else}
  <h1>Hello, {name}!</h1>
{/if}

<section>
  <h2>User list</h2>
  
  <div class="grid grid-cols-3 px-4">
    {#each users as user}
      {#if !currentUser || currentUser.wallet_id !== user.walletId }
        <div class="flex flex-col p-4 border rounded">
          {user.wallet_id}
          <button
            type="button"
            disabled={!currentUser}
            on:click={joinSession}
          >
            Connect
          </button>
        </div>
      {/if}
    {/each}
  </div>
</section>
