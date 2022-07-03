import { writable } from 'svelte/store';

export enum ClassStateTutor {
  WAITING_FOR_PC_CONFIG = '2:WAITING_FOR_PC_CONFIG',
  PC_CONFIG_RECEIVED = '3:PC_CONFIG_RECEIVED',
  WAITING_FOR_MEDIA = '4:WAITING_FOR_MEDIA',
  MEDIA_RECEIVED = '5:MEDIA_RECEIVED',
  WAITING_FOR_TRANSACTIONS = '6:WAITING_FOR_TRANSACTIONS',
  TRANSACTION_RECEIVED = '7:TRANSACTION_RECEIVED',
  CLOSING = '8:CLOSING'
}

export const classStateTutor = writable<ClassStateTutor | undefined>(undefined);
