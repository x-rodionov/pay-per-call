import TonWeb, { type AddressType } from 'tonweb';
import { type KeyPair, isPasswordNeeded, mnemonicToKeyPair } from 'tonweb-mnemonic';
import type { WalletV3ContractBase } from 'tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-base';
import { TON_MAINNET_API_KEY, TON_TESTNET_API_KEY } from '$lib/shared/lib/env';
import type { User } from '$lib/shared/api/users';
import type { WalletV3ContractR1 } from 'tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-r1';
import type { Address } from 'tonweb/dist/types/utils/address';

const TEST_MODE = true;

const apiKey = TEST_MODE ? TON_TESTNET_API_KEY : TON_MAINNET_API_KEY;
const providerUrl = TEST_MODE
	? 'https://testnet.toncenter.com/api/v2/jsonRPC'
	: 'https://toncenter.com/api/v2/jsonRPC';

export const tonweb = new TonWeb(
	new TonWeb.HttpProvider(providerUrl, { apiKey })
) as TonWebWithPayments;
/** The BigNumber.js library */
const BN = TonWeb.utils.BN;

export const MNEMONICS_LENGTH = 24;

/**
 * Given the 24-word mnemonic, returns the wallet object along with its key pair
 *  for further use in transactions and other operations.
 * @param mnemonics The 24 words provided by TON when creating a new wallet
 * @param password An optional password to encrypt the wallet
 * @returns The public and private key pairs, as well as the wallet object
 */
export async function getKeyPairAndWallet(mnemonics: string[], password?: string) {
	if (mnemonics.length !== MNEMONICS_LENGTH) {
		throw new Error(
			`Invalid mnemonics length. Expected ${MNEMONICS_LENGTH}, but got ${mnemonics.length}`
		);
	}
	if ((await isPasswordNeeded(mnemonics)) && password == undefined) {
		throw new Error('This mnemonic requires a password but none was provided');
	}
	const keyPair = await mnemonicToKeyPair(mnemonics, password);
	const wallet = tonweb.wallet.create({ publicKey: keyPair.publicKey });
	wallet.address = await wallet.getAddress();
	localStorage.setItem('privateKey', TonWeb.utils.bytesToBase64(keyPair.secretKey));
	localStorage.setItem('publicKey', TonWeb.utils.bytesToBase64(keyPair.publicKey));
	return {
		keyPair,
		wallet
	};
}

/**
 * Looks for the public and private keys in localStorage and returns them along
 *   with the wallet object if they exist.
 * Returns `undefined` otherwise.
 */
export function getPersistedWallet() {
	const privateKey = localStorage.getItem('privateKey');
	const publicKey = localStorage.getItem('publicKey');
	if (privateKey && publicKey) {
		const keyPair: KeyPair = {
			secretKey: TonWeb.utils.base64ToBytes(privateKey),
			publicKey: TonWeb.utils.base64ToBytes(publicKey)
		};
		const wallet = tonweb.wallet.create({ publicKey: keyPair.publicKey });
		return {
			keyPair,
			wallet
		};
	}
	return undefined;
}

export function removeKeys() {
	localStorage.removeItem('privateKey');
	localStorage.removeItem('publicKey');
}

export function generateRandomBigNum() {
	const buffer = new Uint8Array(8);
	window.crypto.getRandomValues(buffer);
	return new BN(buffer);
}

type BigNumber = InstanceType<TonWeb['utils']['BN']>;
export interface ChannelConfig {
	channelId: BigNumber;
	addressA: Address;
	addressB: Address;
	initBalanceA: BigNumber;
	initBalanceB: BigNumber;
}

type ChannelState = {
	balanceA: BigNumber;
	balanceB: BigNumber;
	seqnoA: BigNumber;
	seqnoB: BigNumber;
};

// I'm not 100% sure of the types here. I inferred them from the payments channel example code.
// They should be tested in runtime and adjusted accordingly.
type FromWallet = {
	deploy(): FromWallet;
	send(amount: BigNumber): Promise<FromWallet>;
	topUp(amounts: { coinsA: BigNumber; coinsB: BigNumber }): FromWallet;
	init(state: ChannelState): FromWallet;
	close(state: ChannelState & { hisSignature: string }): void;
};
type PaymentChannel = {
	getAddress(): Promise<{
		toString(isUserFriendly?: boolean, isUrlSafe?: boolean, isBounceable?: boolean): string;
	}>;
	getData(): Promise<{ balanceA: BigNumber; balanceB: BigNumber }>;
	fromWallet(options: { wallet: WalletV3ContractBase; secretKey: Uint8Array }): FromWallet;
	signState(state: ChannelState): Promise<string>;
	signClose(state: ChannelState): Promise<string>;
	verifyState(state: ChannelState, signature: string): Promise<boolean>;
	verifyClose(state: ChannelState, signature: string): Promise<boolean>;
};

/**
 * This is required since the original TonWeb interface is actually a class, so interface merging doesn't work.
 */
interface TonWebWithPayments extends TonWeb {
	payments: {
		createChannel(
			config: ChannelConfig & {
				isA: boolean;
				myKeyPair: KeyPair;
				hisPublicKey: Uint8Array;
			}
		): PaymentChannel;
	};
}

/**
 * To be used by the tutee to request that the tutor start the lesson (and hence payment channel).
 */
export async function requestLessonStart(tutor: User, lessonLength: number = 60) {
	const { wallet: myWallet, keyPair } = getPersistedWallet()!;

	const tutorWalletAddress = tutor.wallet_id;
	const pricePerMin = Number(tutor.cost_per_minute);
	const tutorPublicKey = new Uint8Array(Buffer.from(tutor.public_key, 'base64'));

	const myAddress = await myWallet.getAddress();

	const channelConfig: ChannelConfig = {
		channelId: generateRandomBigNum(), // For each new channel there must be a new ID
		addressA: myAddress,
		addressB: tutorWalletAddress as any,
		initBalanceA: new BN(TonWeb.utils.fromNano(pricePerMin * lessonLength)),
		initBalanceB: new BN(0)
	};

	const tuteeChannel = tonweb.payments.createChannel({
		...channelConfig,
		isA: true,
		myKeyPair: keyPair,
		hisPublicKey: tutorPublicKey,
	});

	const fromWallet = tuteeChannel.fromWallet({
		wallet: myWallet,
		secretKey: keyPair.secretKey,
	});

	return {
		channel: tuteeChannel,
		channelConfig,
		fromWallet,
	};
}

/**
 * To be called by the tutor after the tutee requests a lesson and sends the channel config.
 */
export async function acceptLessonStart(tutee: User, channelConfig: ChannelConfig) {
	const { wallet: myWallet, keyPair } = getPersistedWallet()!;
	const tuteePublicKey = new Uint8Array(Buffer.from(tutee.public_key, 'base64'));

	const tutorChannel = tonweb.payments.createChannel({
		...channelConfig,
		isA: false,
		myKeyPair: keyPair,
		hisPublicKey: tuteePublicKey,
	});

	const fromWallet = tutorChannel.fromWallet({
		wallet: myWallet,
		secretKey: keyPair.secretKey,
	});

	return {
		channel: tutorChannel,
		fromWallet,
	};
}

/**
 * To be used by the tutee to deploy the payment channel after the tutor accepts the request.
 */
async function confirmChannelAcceptance(keyPair: KeyPair) {
	// const myWallet = tonweb.wallet.create({ publicKey: keyPair.publicKey });

}
