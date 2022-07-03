<script lang="ts">
  import { onMount } from 'svelte';
  import IconCallEnd from '~icons/material-symbols/call-end-outline';
  import { goto } from '$app/navigation';

  import { activeCall, activeConnection } from '$lib/entities/peer';
  import { streams } from '$lib/entities/stream';
  import { user } from '$lib/entities/user';
  import { CTAButton } from '$lib/shared/ui';
  import { classStateTutor, CSTR } from '$lib/entities/class';

  let myVideoEl: HTMLVideoElement;
  let tutorVideoEl: HTMLVideoElement;

  let currentTime = 0;

  onMount(() => {
    if ($streams === null) {
      return;
    }
    const [myStream, tutorStream] = $streams;
    tutorVideoEl.srcObject = tutorStream;
    tutorVideoEl.play();
    myVideoEl.srcObject = myStream;
    myVideoEl.play();
    const interval = setInterval(() => {
      currentTime++;
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  });

  $: isTutor = $activeConnection && $user && $user?.id === $activeConnection?.metadata?.tutor.id;

  function hangUp() {
    if ($activeCall !== null && $activeConnection !== null) {
      $activeCall.close();
      $activeConnection.close();
      if (isTutor) {
        classStateTutor.set(CSTR.CLOSING);
      }
      if ($streams !== null) {
        const [myStream, tutorStream] = $streams;
        myStream.getTracks().forEach((track) => track.stop());
        tutorStream.getTracks().forEach((track) => track.stop());
      }
      if (isTutor !== null) {
        goto(isTutor ? '/tutor' : '/student');
      }
    }
  }

  $: {
    if (
      $activeConnection?.metadata.classDuration !== undefined &&
      currentTime > $activeConnection?.metadata.classDuration * 60
    ) {
      hangUp();
    }
  }

  function formatSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
</script>

<div class="flex-1 flex flex-col justify-between before:w-0">
  <main class="relative mx-12 lg:mx-40 my-10">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video bind:this={tutorVideoEl} class="w-full h-full bg-gray-600 rounded-lg" />
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      bind:this={myVideoEl}
      class="absolute h-1/4 bottom-4 right-4 bg-green-600 rounded-md"
      muted
    />
  </main>
  {#if $activeConnection !== null}
    <div class="py-6 flex justify-center items-center space-x-10">
      <span class="font-bold">{$activeConnection.metadata?.tutor.course}</span>
      <span
        >{formatSeconds(currentTime)} / {formatSeconds(
          $activeConnection.metadata.classDuration * 60
        )}</span
      >
      <CTAButton
        on:click={hangUp}
        class="px-12 py-4 bg-orange-500 hover:bg-orange-600 focus:ring-orange-200 dark:bg-orange-300 dark:hover:bg-orange-400 dark:focus:ring-orange-800"
      >
        <IconCallEnd class="w-8 h-8" />
      </CTAButton>
    </div>
  {:else}
    <div class="py-6 flex justify-center items-center">
      <p>
        No active call. <a href="/student" class="underline text-blue-500 dark:text-blue-300"
          >Go back</a
        >
      </p>
    </div>
  {/if}
</div>
