<script lang="ts">
  import {Session, SessionWaiting, session} from '../components/session';
</script>

{#if $session.loading}
  <SessionWaiting />
{:else}
  <Session />
{/if}
