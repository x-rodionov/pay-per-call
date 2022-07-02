<script lang="ts">
  import { connect } from './connect';
  import { user, peer, isLoggedIn } from './model';

  let name = '';
  
  const logIn = async () => {
    if (name) {
      const res = await connect(name);
      $peer = res.peer;
      $user = res.user;
    }
  };
</script>

<header>
  {#if !$isLoggedIn}
    <form>
      <input type="text" bind:value={name} placeholder="John Doe" />
      <button type="submit" on:click|preventDefault={logIn}>Log In</button>
    </form>
  {:else}
   Hello, {$user.wallet_id}!
  {/if}
</header>
