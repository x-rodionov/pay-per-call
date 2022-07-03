<script lang="ts">
	import { streams } from '$lib/entities/stream';
    import { onMount } from 'svelte';

    let myVideoEl: HTMLVideoElement;
    let tutorVideoEl: HTMLVideoElement;
    onMount(() => {
        if ($streams == null) {
            throw new Error('$streams is null');
        };
        const [myStream, tutorStream] = $streams;
        tutorVideoEl.srcObject = tutorStream;
        tutorVideoEl.play();
        myVideoEl.srcObject = myStream;
        myVideoEl.play();
    })
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video bind:this={tutorVideoEl} class="tutor-video"></video>
<!-- svelte-ignore a11y-media-has-caption -->
<video bind:this={myVideoEl} class="my-video" muted></video>

<style>
    video {
        position: absolute;
    }
    .tutor-video {
        width: 100%;
        height: 100%;
    }
    .my-video {
        height: 25%;
        bottom: 0;
        right: 10%;
    }
</style>
