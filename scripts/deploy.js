const hre = require("hardhat");

async function main() {
  const NFTCertificate = await hre.ethers.getContractFactory("NFTCertificate");

  // Deploy the contract and wait for confirmation
  const nft = await NFTCertificate.deploy(); // <-- This already deploys and waits

  console.log(`✅ NFT Certificate deployed to: ${nft.target || nft.address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});