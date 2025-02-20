"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";
import { getContract, getSignedContract } from "@/utils/contract";

interface Web3ContextType {
  connect: () => Promise<void>;
  connecting: boolean;
  isConnected: boolean;
  account: string | null;
  contract: ethers.Contract | null;
  signer: ethers.Signer | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [connecting, setConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setConnecting(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Network configuration
      const networks = {
        hardhat: { chainId: 31337, name: "Hardhat" },
        sepolia: { chainId: 11155111, name: "Sepolia" },
      };

      const currentNetwork = process.env
        .NEXT_PUBLIC_NETWORK as keyof typeof networks;
      const expectedChainId = networks[currentNetwork]?.chainId;

      if (chainId !== expectedChainId) {
        // Request network switch
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Network needs to be added to MetaMask
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${expectedChainId.toString(16)}`,
                  chainName: networks[currentNetwork].name,
                  rpcUrls: [
                    currentNetwork === "hardhat"
                      ? "http://127.0.0.1:8545"
                      : "https://sepolia.infura.io/v3/",
                  ],
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
        setConnecting(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && Array.isArray(accounts)) {
        const newSigner = await provider.getSigner();

        try {
          if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
            throw new Error("Contract address not configured");
          }

          const newContract = getSignedContract(newSigner);
          setAccount(accounts[0]);
          setSigner(newSigner);
          setContract(newContract);
          setIsConnected(true);
        } catch (contractError) {
          console.error("Error initializing contract:", contractError);
          alert(
            "Error connecting to the marketplace contract. Please check your configuration."
          );
        }
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Failed to connect. Please check console for details.");
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsConnected(false);
        setAccount(null);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        connect,
        connecting,
        isConnected,
        account,
        contract,
        signer,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
