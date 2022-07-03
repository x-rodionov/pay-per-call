import TonWeb from 'tonweb';
import type { WalletV3ContractBase } from 'tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-base';
import type { User } from '$lib/shared/api/users';

import { tonweb, getPersistedWallet, generateRandomBigNum, type ChannelConfig } from './ton';

/** The BigNumber.js library */
const BN = TonWeb.utils.BN;

type BigNumber = InstanceType<TonWeb['utils']['BN']>;

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
export type PaymentChannel = {
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

export async function generatePCConfig(tutor: User, classDuration: number): Promise<ChannelConfig> {
	const { wallet: myWallet } = getPersistedWallet()!;
	const tutorWallet = tonweb.wallet.create({
		publicKey: TonWeb.utils.base64ToBytes(tutor.public_key)
	});

	const pricePerMin = new BN(tutor.cost_per_minute);

	return {
		channelId: generateRandomBigNum(),
		addressA: await myWallet.getAddress(),
		addressB: await tutorWallet.getAddress(),
		initBalanceA: pricePerMin.mul(new BN(classDuration)),
		initBalanceB: new BN(0)
	};
}

/** Create a payment channel from the tutee's side. */
export function createChannelTutee(channelConfig: ChannelConfig, tutor: User) {
  const { keyPair } = getPersistedWallet()!;
  const tutorPublicKey = new Uint8Array(Buffer.from(tutor.public_key, 'base64'));

	return tonweb.payments.createChannel({
    ...channelConfig,
		isA: true,
		myKeyPair: keyPair,
		hisPublicKey: tutorPublicKey,
	});
}

export function getTuteeWalletSender(tuteeChannel: PaymentChannel) {
	const { wallet: myWallet, keyPair } = getPersistedWallet()!;

	return tuteeChannel.fromWallet({
		wallet: myWallet,
		secretKey: keyPair.secretKey
	});
}

export function generateInitState(channelConfig: ChannelConfig): ChannelState {
	return {
		balanceA: channelConfig.initBalanceA,
		balanceB: channelConfig.initBalanceB,
		seqnoA: new BN(0),
		seqnoB: new BN(0)
	};
}

export function getStateForSeqno(seqno: number, channelConfig: ChannelConfig, tutor: User): ChannelState {
	const balanceB = new BN(tutor.cost_per_minute).mul(new BN(seqno));
	return {
		balanceA: channelConfig.initBalanceA.sub(balanceB),
		balanceB,
		seqnoA: new BN(seqno),
		seqnoB: new BN(0)
	};
}

export function serializeChannelConfig(channelConfig: ChannelConfig) {
	return {
		channelId: channelConfig.channelId.toString(),
		addressA: channelConfig.addressA,
		addressB: channelConfig.addressB,
		initBalanceA: channelConfig.initBalanceA.toString(),
		initBalanceB: channelConfig.initBalanceB.toString(),
	};
}
