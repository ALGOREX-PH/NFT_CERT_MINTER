import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import CertificatePreview from './CertificatePreview';
import MintingStatus from './MintingStatus';
import { mintNFTCertificate } from '../services/nftService';

const NFTMinter: React.FC = () => {
  const { isConnected, signer, isCorrectNetwork } = useWallet();
  const [recipientName, setRecipientName] = useState('Your Name');
  const [isMinting, setIsMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<'none' | 'pending' | 'success' | 'error'>('none');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMint = async () => {
    if (!isConnected || !signer || !isCorrectNetwork) return;
    
    try {
      setIsMinting(true);
      setTransactionStatus('pending');
      setTransactionHash(null);
      setErrorMessage(null);
      
      const result = await mintNFTCertificate(signer, recipientName);
      
      setTransactionHash(result.hash);
      setTransactionStatus('success');
    } catch (error: any) {
      console.error('Minting error:', error);
      setTransactionStatus('error');
      setErrorMessage(error.message || 'Transaction failed. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Mint Your NFT Certificate</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                id="name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">About This Certificate</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-1.5 mr-2"></span>
                  <span>Minted on Ethereum Sepolia Testnet</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-1.5 mr-2"></span>
                  <span>Personalized with recipient's name</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-1.5 mr-2"></span>
                  <span>Permanently stored on blockchain</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-1.5 mr-2"></span>
                  <span>Requires minimal gas fees (testnet ETH)</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={handleMint}
              disabled={!isConnected || !isCorrectNetwork || isMinting}
              className={`
                w-full py-3 px-4 rounded-md font-medium text-white transition-all duration-300
                ${isConnected && isCorrectNetwork && !isMinting
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg'
                  : 'bg-slate-700 cursor-not-allowed opacity-60'
                }
              `}
            >
              {!isConnected 
                ? 'Connect Wallet to Mint' 
                : !isCorrectNetwork 
                  ? 'Switch to Sepolia Network' 
                  : isMinting 
                    ? 'Minting...' 
                    : 'Mint Certificate NFT'}
            </button>
            
            <MintingStatus 
              status={transactionStatus} 
              transactionHash={transactionHash}
              errorMessage={errorMessage}
            />
          </div>
          
          <div className="order-first md:order-last">
            <CertificatePreview recipientName={recipientName} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTMinter;