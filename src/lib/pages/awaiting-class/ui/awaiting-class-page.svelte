<script lang="ts">
  import { goto } from '$app/navigation';
  import IconHourglassBottom from '~icons/material-symbols/hourglass-bottom';

  import { activeConnection } from '$lib/entities/peer';
  import { CTAButton, H1 } from '$lib/shared/ui';
import { classStateTutee, CSTT } from '$lib/entities/class';

  const cancelSession = () => {
    $activeConnection?.close();
    goto('/student');
  };

  let message = 'Waiting for the tutor to accept the request';
  $: switch ($classStateTutee) {
    case CSTT.WAITING_FOR_DATA_ACCEPTANCE:
      message = 'Waiting for the tutor to accept the request';
      break;
    case CSTT.WAITING_FOR_PC_CONFIG_ACK:
      message = 'Waiting for the tutor to agree on the initial contract';
      break;
    case CSTT.BC_WAITING_FOR_PC_CREATION:
      message = 'Waiting for the blockchain to process the creation of a payment channel';
      break;
    case CSTT.BC_WAITING_FOR_TOP_UP:
      message = 'Waiting for the blockchain to process the top-up';
      break;
    case CSTT.BC_WAITING_FOR_CHANNEL_INIT:
      message = 'Waiting for the blockchain to process the initialization of the payment channel';
      break;
    case CSTT.WAITING_FOR_MEDIA_ACCEPTANCE:
      message = 'Waiting for the tutor to accept the audio/video call';
      break;
  }
</script>

<main class="flex-1 flex justify-between flex-col items-center pb-6 before:w-0">
  <div class="flex flex-col items-center">
    <H1>Prepare to have a class</H1>
    <div class="flex items-center my-6">
      <IconHourglassBottom class="w-8 h-8 mr-4 text-blue-500 dark:text-blue-300" />
      <p>{message}</p>
    </div>
    <CTAButton class="px-12 py-4 bg-orange-500 hover:bg-orange-600 focus:ring-orange-200 dark:bg-orange-300 dark:hover:bg-orange-400 dark:focus:ring-orange-800" on:click={cancelSession}>Cancel</CTAButton>
  </div>
  {#if $activeConnection !== null}
    <p class="font-light text-sm">{$activeConnection.metadata.tutor.course}, {$activeConnection.metadata.tutor.cost_per_minute} nTON/min</p>
  {:else}
    <p>No active call. <a href="/student" class="underline text-blue-500 dark:text-blue-300">Go back</a></p>
  {/if}
</main>
