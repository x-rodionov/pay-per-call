<script lang="ts">
  import {onMount} from 'svelte';
  import Peer from 'peerjs';
  import { type User, fetchUsers } from '../utils/users';
  import {connect} from '../utils/connect';
  
  let name = '';
  let isTutor = false;
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
      const {} = await connect(name);
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
    <input type="checkbox" bind:checked={isTutor} />
    <button type="submit" on:click={logIn}>Log In</button>
  </form>
{:else}
  <section>
    <h1>You are a {isTutor ? 'tutor' : 'student'}</h1>
    {#if isTutor}
      <p>Please, wait for a student to ask for a lesson</p>
    {:else}
      <button type="button" on:click={joinSession}>Connect</button>
    {/if}
  </section>
{/if}

<section>
  <h2>User list</h2>
  
  <div class="grid grid-cols-3 px-4">
    {#each users as user}
      <div class="flex flex-col p-4 border rounded">
        {user.wallet_id}
        <button type="Connect"></button>
      </div>
    {/each}
  </div>
</section>
