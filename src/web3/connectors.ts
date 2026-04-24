import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import type { Web3ReactHooks } from '@web3-react/core';

export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

export const connectors: [MetaMask, Web3ReactHooks][] = [[metaMask, metaMaskHooks]];
