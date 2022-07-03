import TonWeb from 'tonweb';

import { getPersistedWallet, tonweb, type ChannelConfig } from './ton';
import type { PaymentChannel, serializeChannelConfig } from './ton-v2';
import type { User } from './users';

const BN = TonWeb.utils.BN;

export function deserializeChannelConfig(
  channelConfig: ReturnType<typeof serializeChannelConfig>
): ChannelConfig {
  return {
    channelId: new BN(channelConfig.channelId),
    addressA: channelConfig.addressA,
    addressB: channelConfig.addressB,
    initBalanceA: new BN(channelConfig.initBalanceA),
    initBalanceB: new BN(channelConfig.initBalanceB)
  };
}

/** Create a payment channel from the tutee's side. */
export function createChannelTutor(channelConfig: ChannelConfig, tutee: User) {
  const { keyPair } = getPersistedWallet()!;
  const tuteePublicKey = TonWeb.utils.base64ToBytes(tutee.public_key);

  return tonweb.payments.createChannel({
    ...channelConfig,
    isA: false,
    myKeyPair: keyPair,
    hisPublicKey: tuteePublicKey
  });
}

export function getTutorWalletSender(tuteeChannel: PaymentChannel) {
  const { wallet: myWallet, keyPair } = getPersistedWallet()!;

  return tuteeChannel.fromWallet({
    wallet: myWallet,
    secretKey: keyPair.secretKey
  });
}
