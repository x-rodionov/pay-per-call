<script lang="ts">
  import { goto } from '$app/navigation';
  
  import {Session, SessionWaiting, session} from '../components/session';
  if (!$session) {
    goto('/');
  }
</script>

{#if $session?.loading}
  <SessionWaiting />
{:else}
  <Session />
{/if}
