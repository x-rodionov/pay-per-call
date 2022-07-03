import type { MediaConnection } from 'peerjs';
import { goto } from '$app/navigation';

import { activeCall } from '$lib/features/initiate-call';
import { streams } from '$lib/entities/stream';
import { acceptLessonStart } from '$lib/shared/api/ton';

export async function acceptCall(call: MediaConnection) {
  try {
    const { paymentChannelConfig, tutee, channelAddress } = call.metadata;
    const { channel } = await acceptLessonStart(tutee, paymentChannelConfig);
    const myAddress =  await channel.getAddress();
    if (myAddress.toString(true, true, true) !== channelAddress) {
      throw new Error('The channel addresses do not match');
    }
    const ourStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    call.on('stream', async (theirStream) => {

      streams.set([ourStream, theirStream]);
      goto('/class');
    });
    activeCall.set(call);
    call.answer(ourStream);
  } catch (e) {
    // TODO: handle the case when consent isn't given to the media
    console.error('No consent for audio/video', e);
  }
}
