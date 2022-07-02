import { writable } from 'svelte/store';

import type { WalletV3ContractR1 } from 'tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-r1';

export const wallet = writable<WalletV3ContractR1 | null>(null);
