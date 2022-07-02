<script lang="ts">
  import { goto } from '$app/navigation';
  import {sessionRequests, acceptSession, rejectSession} from './model';
  
  const accept = (session) => {
    acceptSession(session);
    goto('/session');
  };
</script>

{#if !$sessionRequests.length}
  Wait for the requests to appear...
{/if}

{#each $sessionRequests as sessionRequest}
  <div>
    <h3>{sessionRequest.student}</h3>
    <div class="flex">
      <button type="button" on:click={() => rejectSession(sessionRequest)}>Cancel</button>
      <button type="button" on:click={() => accept(sessionRequest)}>Accept</button>
    </div>
  </div>
{/each}
