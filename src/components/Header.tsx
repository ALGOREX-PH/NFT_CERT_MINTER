import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Award } from 'lucide-react';

const Header: React.FC = () => {
  const { 
    account, 
    isConnected, 
    connectWallet, 
    disconnectWallet, 
    isConnecting,
    isCorrectNetwork,
    switchToSepoliaNetwork,
    chainId
  } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  return (
    <header className="w-full py-4 px-6 flex flex-col sm:flex-row items-center justify-between relative z-10">
      <div className="flex items-center mb-4 sm:mb-0">
        <Award size={28} className="text-primary-400 mr-2" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          NFT Certificate Minter
        </h1>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {isConnected && (
          <>
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${isCorrectNetwork ? 'bg-success-500' : 'bg-error-500'}`}></div>
              <span className="text-sm font-medium">
                {isCorrectNetwork 
                  ? 'Sepolia Network' 
                  : `Wrong Network (ID: ${chainId})`}
              </span>
            </div>
            
            {!isCorrectNetwork && (
              <button
                onClick={switchToSepoliaNetwork}
                className="px-3 py-1.5 bg-warning-600 hover:bg-warning-700 text-white rounded-md text-sm transition-all duration-200 ease-in-out"
              >
                Switch to Sepolia
              </button>
            )}
            
            <div className="text-sm px-3 py-1.5 bg-slate-800 rounded-md">
              {truncateAddress(account as string)}
            </div>
          </>
        )}
        
        <button
          onClick={isConnected ? disconnectWallet : connectWallet}
          disabled={isConnecting}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
            isConnected 
              ? 'bg-slate-700 hover:bg-slate-800 text-white' 
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          } ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isConnecting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting
            </span>
          ) : isConnected ? 'Disconnect' : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
};

export default Header;