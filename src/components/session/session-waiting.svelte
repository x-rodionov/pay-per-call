<script lang="ts">
  import { goto } from '$app/navigation';
  import {session} from './model';

  const cancelSession = () => {
    $session = null;
    goto('/');
  };
</script>

<section class="flex flex-col">
  <h1>Prepare to have a class</h1>
  <p>Waiting for the tutor to accept the request</p>
  <button type="button" on:click={cancelSession}>Cancel</button>
  <p>Calculus / 0.01 mTON per hour</p>
</section>
