import { writable } from 'svelte/store';

export enum ClassState {
	/** Waiting for the tutor to accept the Peer.js data connection. */
	WAITING_FOR_DATA_ACCEPTANCE = '0:WAITING_FOR_DATA_ACCEPTANCE',
	/** The tutor has accepted the Peer.js data connection. */
	DATA_ACCEPTED = '1:DATA_ACCEPTED',
	/** Waiting for the tutor to agree on the initial configuration of the payment channel. */
	WAITING_FOR_PC_CONFIG_ACK = '2:WAITING_FOR_PC_CONFIG_ACK',
	/** The tutor has agreed on the initial configuration of the payment channel. */
	PC_CONFIG_ACKED = '3:PC_CONFIG_ACKED',
	/** The addresses of the channel on either ends don't match, error state.  */
	PC_ADDRESS_MISMATCH = 'E:PC_ADDRESS_MISMATCH',
	/** Waiting for the blockchain to process the transaction of creating a payment channel. */
	BC_WAITING_FOR_PC_CREATION = '4:BC_WAITING_FOR_PC_CREATION',
	/** Waiting for the blockchain to process the transaction of topping up the tutee's end. */
	BC_WAITING_FOR_TOP_UP = '5:BC_WAITING_FOR_TOP_UP',
	/** Waiting for the blockchain to process the transaction of initializing the payment channel. */
	BC_WAITING_FOR_CHANNEL_INIT = '6:BC_WAITING_FOR_CHANNEL_INIT',
	/** The payment channel is ready to start moving money from the tutee to the tutor. */
	READY_FOR_TRANSACTIONS = '7:READY_FOR_TRANSACTIONS',
	/** Waiting for the tutor to accept the Peer.js call. */
	WAITING_FOR_MEDIA_ACCEPTANCE = '8:WAITING_FOR_MEDIA_ACCEPTANCE',
	/** The tutor has accepted the Peer.js call. */
	MEDIA_ACCEPTED = '9:MEDIA_ACCEPTED',
	/**
	 * After sending a tentative state of the payment channel, waiting for the tutor
	 * to verify the signature and approve the state.
	 */
	WAITING_FOR_APPROVAL = '10:WAITING_FOR_APPROVAL',
	/** The tutor has approved the change of state of the payment channel. */
	APPROVAL_RECEIVED = '11:APPROVAL_RECEIVED',
	/** The channel was closed by the initiative of the tutee. */
	CLOSING_REQUEST_SENT = '12A:WAITING_FOR_FIN_ACK',
	/** The tutor has requested to close the payment channel. */
	FIN_RECEIVED = '12B:FIN_RECEIVED',
	/** After sending a closing request to the tutor, waiting for them to confirm. */
	WAITING_FOR_FIN_ACK = '13A:WAITING_FOR_FIN_ACK',
	/** The tutor has confirmed closing the payment channel. */
	FIN_ACK_RECEIVED = '14A:FIN_ACK_RECEIVED'
}

export const classState = writable<ClassState | undefined>(undefined);
