import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';

// Initialize the MetaMask connector correctly
export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

// Export connectors for use with Web3ReactProvider
export const connectors = [[metaMask, metaMaskHooks]];
