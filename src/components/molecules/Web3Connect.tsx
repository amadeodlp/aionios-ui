import React, { useCallback } from 'react';
import { metaMask, metaMaskHooks } from '@/web3/connectors';

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = metaMaskHooks;

export default function Web3Connect() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();

  const account = accounts ? accounts[0] : undefined;

  const handleConnect = useCallback(() => {
    if (metaMask?.activate) {
      metaMask.activate()
        .catch((error) => {
          console.error('Error connecting to MetaMask:', error);
        });
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    if (metaMask?.deactivate) {
      void metaMask.deactivate();
    }
  }, []);

  return (
    <div className="p-4 border rounded-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Web3 Connection</h2>
      
      <div className="mb-2">
        <span className="mr-2 font-medium">Status:</span> 
        {isActivating ? (
          <span className="text-yellow-500">Connecting...</span>
        ) : isActive ? (
          <span className="text-green-500">Connected</span>
        ) : (
          <span className="text-red-500">Disconnected</span>
        )}
      </div>
      
      {isActive && account && (
        <div className="mb-2">
          <span className="mr-2 font-medium">Account:</span>
          <span className="font-mono">{account}</span>
        </div>
      )}
      
      {isActive && chainId && (
        <div className="mb-2">
          <span className="mr-2 font-medium">Chain ID:</span>
          <span>{chainId}</span>
        </div>
      )}
      
      <div className="mt-4">
        {!isActive ? (
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Connect to MetaMask
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
