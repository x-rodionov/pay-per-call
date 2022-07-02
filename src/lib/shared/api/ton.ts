import TonWeb, { type AddressType } from 'tonweb';
import { type KeyPair, isPasswordNeeded, mnemonicToKeyPair } from 'tonweb-mnemonic';
import type { WalletV3ContractBase } from 'tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-base';
import { TON_MAINNET_API_KEY, TON_TESTNET_API_KEY } from '$lib/shared/lib/env';

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
	localStorage.setItem('privateKey', JSON.stringify(Array.from(keyPair.secretKey)));
	localStorage.setItem('publicKey', JSON.stringify(Array.from(keyPair.publicKey)));
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
			secretKey: new Uint8Array(JSON.parse(privateKey)),
			publicKey: new Uint8Array(JSON.parse(publicKey))
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

function generateRandomBigNum() {
	const buffer = new Uint8Array(8);
	window.crypto.getRandomValues(buffer);
	return new BN(buffer);
}

type BigNumber = InstanceType<TonWeb['utils']['BN']>;
interface ChannelConfig {
	channelId: BigNumber;
	addressA: AddressType;
	addressB: string;
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
	getAddress(): string;
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
				hisPublicKey: string;
			}
		): PaymentChannel;
	};
}

/**
 * To be used by the tutee to request that the tutor start the lesson (and hence payment channel).
 */
export async function requestLessonStart(keyPair: KeyPair, lessonId: string, minutes: number) {
	// TODO: request lesson info from Supabase to get the tutor's wallet address and minute price
	const tutorWalletAddress = '';
	/** In nanoTONs */
	const pricePerMin = 1;
	const tutorPublicKey = '';

	const myWallet = tonweb.wallet.create({ publicKey: keyPair.publicKey });

	const channelConfig: ChannelConfig = {
		channelId: generateRandomBigNum(), // For each new channel there must be a new ID
		addressA: myWallet.address!,
		addressB: tutorWalletAddress,
		initBalanceA: new BN(TonWeb.utils.fromNano(pricePerMin * minutes)),
		initBalanceB: new BN(0)
	};

	const tuteeChannel = tonweb.payments.createChannel({
		...channelConfig,
		isA: true,
		myKeyPair: keyPair,
		hisPublicKey: tutorPublicKey
	});

	return {
		channel: tuteeChannel,
		channelConfig
	};
}

/**
 * To be called by the tutor after the tutee requests a lesson and sends the channel config.
 */
export async function acceptLessonStart(
	keyPair: KeyPair,
	channelConfig: ChannelConfig,
	tuteePublicKey: string
) {
	const myWallet = tonweb.wallet.create({ publicKey: keyPair.publicKey });

	const tuteeChannel = tonweb.payments.createChannel({
		...channelConfig,
		isA: false,
		myKeyPair: keyPair,
		hisPublicKey: tuteePublicKey
	});

	const fromWallet = tuteeChannel.fromWallet({
		wallet: myWallet,
		secretKey: keyPair.secretKey
	});

	return {
		channel: tuteeChannel,
		fromWallet
	};
}

/**
 * To be used by the tutee to deploy the payment channel after the tutor accepts the request.
 */
async function confirmChannelAcceptance(keyPair: KeyPair) {
	// const myWallet = tonweb.wallet.create({ publicKey: keyPair.publicKey });
	// const fromWalletA = channelA.fromWallet({
	// 	wallet: walletA,
	// 	secretKey: keyPairA.secretKey
	// });
}
