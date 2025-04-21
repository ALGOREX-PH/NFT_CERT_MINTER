import React from 'react';
import { Award } from 'lucide-react';

interface CertificatePreviewProps {
  recipientName: string;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ recipientName }) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative rounded-lg overflow-hidden transform transition-all duration-700 hover:scale-[1.02] group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-secondary-500/20 to-accent-500/20 opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
      
      <div className="relative border-4 border-primary-500/30 bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[400px]">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-50">
          <div className="text-xs">NFT Certificate</div>
          <div className="text-xs">{`#${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`}</div>
        </div>
        
        <div className="mb-3 text-center">
          <Award size={64} className="text-primary-400 mx-auto mb-2" />
          <h3 className="text-xl text-primary-300 font-light uppercase tracking-widest">Certificate of</h3>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            ACHIEVEMENT
          </h2>
        </div>
        
        <div className="w-full border-t border-b border-slate-700 py-6 my-4 text-center">
          <p className="text-slate-400 mb-2">This certificate is proudly presented to</p>
          <h2 className="font-bold text-2xl sm:text-3xl mb-1 text-white">
            {recipientName || 'Your Name'}
          </h2>
          <p className="text-slate-400 text-sm">
            for successfully minting their first NFT Certificate on the Ethereum Sepolia Testnet
          </p>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-sm text-slate-400">Issued on {formattedDate}</p>
          <div className="mt-4 flex items-center justify-center">
            <div className="w-16 h-[1px] bg-primary-500/50"></div>
            <div className="mx-3 text-xs text-primary-400">VERIFIED ON BLOCKCHAIN</div>
            <div className="w-16 h-[1px] bg-primary-500/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;