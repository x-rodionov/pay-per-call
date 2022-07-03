import type { DataConnection } from 'peerjs';

import { activeConnection } from '$lib/entities/peer';
import { classStateMachineTutor, classStateTutor, CSTR } from '$lib/entities/class';

export async function acceptClass(connection: DataConnection) {
  try {
    activeConnection.set(connection);
    classStateTutor.subscribe(classStateMachineTutor(connection));
    classStateTutor.set(CSTR.WAITING_FOR_PC_CONFIG);
  } catch (e) {
    // TODO: handle the case when consent isn't given to the media
    console.error('No consent for audio/video', e);
  }
}
