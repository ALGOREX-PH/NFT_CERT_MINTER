import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-6 text-center text-sm text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()} NFT Certificate Minter • Built with ❤️ on Ethereum Sepolia
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://sepolia.etherscan.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Sepolia Etherscan
          </a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors flex items-center"
          >
            <Github size={16} className="mr-1" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;