import { ethers } from 'ethers';
import { NFT_CONTRACT_ABI } from './contractABI';

// Replace this with your deployed contract address
const NFT_CONTRACT_ADDRESS = '0x2894978Ecfc8391e577201041a29Cbe4ebfbC09B';

export type MintResult = {
  hash: string;
  tokenId?: string;
};

export const mintNFTCertificate = async (
  signer: ethers.JsonRpcSigner,
  recipientName: string
): Promise<MintResult> => {
  try {
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      signer
    );
    
    const mintTx = await nftContract.mintCertificate(recipientName);
    const receipt = await mintTx.wait();
    
    // Get the token ID from the event logs
    const event = receipt.logs.find(
      (log: any) => log.eventName === 'CertificateMinted'
    );
    const tokenId = event ? event.args.tokenId.toString() : undefined;
    
    return {
      hash: receipt.hash,
      tokenId
    };
  } catch (error) {
    console.error('Error minting NFT certificate:', error);
    throw error;
  }
};

// Function to get the metadata of an NFT (in a real app)
export const getCertificateMetadata = async (
  provider: ethers.BrowserProvider,
  tokenId: string
) => {
  try {
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      provider
    );
    
    const uri = await nftContract.tokenURI(tokenId);
    const metadata = JSON.parse(atob(uri.split(',')[1]));
    return metadata;
  } catch (error) {
    console.error('Error fetching certificate metadata:', error);
    throw error;
  }
};