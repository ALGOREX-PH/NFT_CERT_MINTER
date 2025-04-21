import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { WalletProvider } from './contexts/WalletContext';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <App />
      <Toaster position="bottom-right" />
    </WalletProvider>
  </StrictMode>
);