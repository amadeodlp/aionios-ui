'use client';

import { store } from '@/store';
import { Provider } from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core';
import { useEffect } from 'react';
import { connectors, metaMask } from '@/web3/connectors';
import ModalContainer from '@/components/organisms/ModalContainer';

export function Providers({ children }: { children: React.ReactNode }) {
  // Try to connect on initial load
  useEffect(() => {
    // Attempt to eagerly connect
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to MetaMask');
    });
  }, []);

  return (
    <Provider store={store}>
      <Web3ReactProvider connectors={connectors}>
        {children}
        <ModalContainer />
      </Web3ReactProvider>
    </Provider>
  );
}
