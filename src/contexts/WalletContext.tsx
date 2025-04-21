import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isCorrectNetwork: boolean;
  switchToSepoliaNetwork: () => Promise<void>;
}

const SEPOLIA_CHAIN_ID = 11155111;

const WalletContext = createContext<WalletContextType>({
  account: null,
  isConnected: false,
  isConnecting: false,
  provider: null,
  signer: null,
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isCorrectNetwork: false,
  switchToSepoliaNetwork: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Check if the browser has Ethereum provider
  const hasEthereumProvider = (): boolean => {
    return window.ethereum !== undefined;
  };

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!hasEthereumProvider()) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Initialize a browser provider
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      
      // Request accounts
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const userAccount = accounts[0];
      setAccount(userAccount);
      
      // Get signer
      const userSigner = await browserProvider.getSigner();
      setSigner(userSigner);
      
      // Get chain ID
      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);
      
      // Check if on Sepolia network
      setIsCorrectNetwork(currentChainId === SEPOLIA_CHAIN_ID);
      
      setIsConnected(true);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setIsConnected(false);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsCorrectNetwork(false);
    toast.success('Wallet disconnected');
  }, []);

  // Switch to Sepolia network
  const switchToSepoliaNetwork = useCallback(async () => {
    if (!hasEthereumProvider() || !provider) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          toast.error('Failed to add Sepolia network');
        }
      }
      console.error('Error switching to Sepolia:', switchError);
    }
  }, [provider]);

  // Setup event listeners
  useEffect(() => {
    if (!hasEthereumProvider()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else if (accounts[0] !== account) {
        // User switched accounts
        setAccount(accounts[0]);
        toast.success('Account changed to ' + accounts[0].substring(0, 6) + '...' + accounts[0].substring(38));
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      setIsCorrectNetwork(newChainId === SEPOLIA_CHAIN_ID);
      
      if (newChainId !== SEPOLIA_CHAIN_ID) {
        toast.error('Please switch to Sepolia Test Network');
      } else {
        toast.success('Connected to Sepolia Test Network');
      }
      
      // Refresh the page on chain change as recommended by MetaMask
      window.location.reload();
    };

    const handleDisconnect = (error: { code: number; message: string }) => {
      console.error('Ethereum disconnected:', error);
      disconnectWallet();
    };

    // Subscribe to events
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', handleChainChanged);
    window.ethereum?.on('disconnect', handleDisconnect);

    // Clean up event listeners
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
      window.ethereum?.removeListener('disconnect', handleDisconnect);
    };
  }, [account, disconnectWallet]);

  const value = {
    account,
    isConnected,
    isConnecting,
    provider,
    signer,
    chainId,
    connectWallet,
    disconnectWallet,
    isCorrectNetwork,
    switchToSepoliaNetwork,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};