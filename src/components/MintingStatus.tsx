import React from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

interface MintingStatusProps {
  status: 'none' | 'pending' | 'success' | 'error';
  transactionHash: string | null;
  errorMessage: string | null;
}

const MintingStatus: React.FC<MintingStatusProps> = ({ 
  status, 
  transactionHash, 
  errorMessage 
}) => {
  if (status === 'none') return null;

  return (
    <div className={`mt-6 rounded-md p-4 ${
      status === 'pending' ? 'bg-secondary-900/50' :
      status === 'success' ? 'bg-success-900/50' :
      'bg-error-900/50'
    }`}>
      <div className="flex items-center">
        {status === 'pending' && (
          <Loader size={20} className="text-secondary-400 mr-2 animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle size={20} className="text-success-400 mr-2" />
        )}
        {status === 'error' && (
          <XCircle size={20} className="text-error-400 mr-2" />
        )}
        
        <h3 className="font-medium">
          {status === 'pending' && 'Transaction in Progress'}
          {status === 'success' && 'Transaction Successful'}
          {status === 'error' && 'Transaction Failed'}
        </h3>
      </div>
      
      <div className="mt-2">
        {status === 'pending' && (
          <p className="text-sm text-slate-400">
            Your NFT is being minted. Please wait...
          </p>
        )}
        
        {status === 'success' && transactionHash && (
          <div className="text-sm">
            <p className="text-success-300 mb-2">
              Your NFT certificate has been successfully minted!
            </p>
            <p className="text-slate-400">
              View on Etherscan:
              <a 
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-primary-400 hover:text-primary-300 underline"
              >
                {transactionHash.substring(0, 6)}...{transactionHash.substring(62)}
              </a>
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <p className="text-sm text-error-300">
            {errorMessage || 'Something went wrong. Please try again.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default MintingStatus;