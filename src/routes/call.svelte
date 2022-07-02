<script>
  import Peer from 'peerjs';
  
  let name = '';
  let isTutor = false;
  let loggedIn = false;
  
  const logIn = () => {
    if (name) {
      loggedIn = true;
    }
  };
  
  const connect = () => {
    const peer = new Peer();
    console.log(peer);
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
      <button type="button" on:click={connect}>Connect</button>
    {/if}
  </section>
{/if}


