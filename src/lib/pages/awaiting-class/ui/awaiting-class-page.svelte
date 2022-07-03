<script lang="ts">
  import { goto } from '$app/navigation';
  import IconHourglassBottom from '~icons/material-symbols/hourglass-bottom';

  import { activeCall } from '$lib/entities/peer';
  import { CTAButton, H1 } from '$lib/shared/ui';

  const cancelSession = () => {
    $activeCall?.close();
    goto('/student');
  };
</script>

<main class="flex-1 flex justify-between flex-col items-center pb-6 before:w-0">
  <div class="flex flex-col items-center">
    <H1>Prepare to have a class</H1>
    <div class="flex items-center my-6">
      <IconHourglassBottom class="w-8 h-8 mr-4 text-blue-500 dark:text-blue-300" />
      <p>Waiting for the tutor to accept the request</p>
    </div>
    <CTAButton class="px-12 py-4 bg-orange-500 hover:bg-orange-600 focus:ring-orange-200 dark:bg-orange-300 dark:hover:bg-orange-400 dark:focus:ring-orange-800" on:click={cancelSession}>Cancel</CTAButton>
  </div>
  {#if $activeCall !== null}
    <p class="font-light text-sm">{$activeCall.metadata.tutor.course}, {$activeCall.metadata.tutor.cost_per_minute} nTON/min</p>
  {:else}
    <p>No active call. <a href="/student" class="underline text-blue-500 dark:text-blue-300">Go back</a></p>
  {/if}
</main>
