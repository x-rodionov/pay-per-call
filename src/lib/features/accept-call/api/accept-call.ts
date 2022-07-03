import type { MediaConnection } from 'peerjs';
import { goto } from '$app/navigation';

import { activeCall } from '$lib/features/initiate-call';
import { streams } from '$lib/entities/stream';

export async function acceptCall(call: MediaConnection) {
  try {
    const ourStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    call.on('stream', (theirStream) => {
      streams.set([ourStream, theirStream]);
      goto('/class');
    });
    activeCall.set(call);
    call.answer(ourStream);
  } catch (e) {
    // TODO: handle the case when consent isn't given to the media
    console.error('No consent for audio/video');
  }
}
