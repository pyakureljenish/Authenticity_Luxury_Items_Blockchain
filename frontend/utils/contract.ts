import { ethers } from "ethers";
import MyNFTMarketplaceABI from "./MyNFTMarketplaceABI.json";

const getNetworkConfig = () => {
  const network = process.env.NEXT_PUBLIC_NETWORK;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!network || !contractAddress) {
    throw new Error(
      "Network configuration missing. Please check your .env.local file"
    );
  }

  return {
    network,
    contractAddress,
    rpcUrl:
      network === "hardhat"
        ? "http://127.0.0.1:8545"
        : `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
  };
};

export function getContract(provider: ethers.Provider) {
  const { contractAddress } = getNetworkConfig();
  return new ethers.Contract(contractAddress, MyNFTMarketplaceABI, provider);
}

export function getProvider() {
  const { network, rpcUrl } = getNetworkConfig();

  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }

  // Fallback to RPC provider
  return new ethers.JsonRpcProvider(rpcUrl);
}

export function getSignedContract(signer: ethers.Signer) {
  const { contractAddress } = getNetworkConfig();
  return new ethers.Contract(contractAddress, MyNFTMarketplaceABI, signer);
}
