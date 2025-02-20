"use client";

import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { ethers } from "ethers";

interface ContractError {
  message: string;
  code?: string;
  data?: unknown;
}

export default function SellersPage() {
  const { isConnected, contract } = useWeb3();
  const [storeName, setStoreName] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [imageURIs, setImageURIs] = useState<string[]>([]);
  const [tokenURI, setTokenURI] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setLoading(true);
      console.log("Attempting to register seller with store name:", storeName);

      // Get the contract and signer addresses
      const contractAddress = await (contract as ethers.Contract).getAddress();
      const signer = (contract as ethers.Contract).runner as ethers.Signer;
      const signerAddress = await signer.getAddress();

      console.log("Contract address:", contractAddress);
      console.log("Sender address:", signerAddress);

      const tx = await contract.registerAsSeller(storeName, {
        value: ethers.parseUnits("10", "gwei"),
        gasLimit: 200000,
      });

      console.log("Transaction hash:", tx.hash);
      console.log("Waiting for transaction confirmation...");

      await tx.wait();
      console.log("Transaction confirmed!");
      alert("Successfully registered as seller!");
    } catch (error: unknown) {
      console.error("Error registering seller:", error);
      const contractError = error as ContractError;
      alert(
        `Error registering seller: ${contractError.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleListItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.listItem(
        itemId,
        itemName,
        ethers.parseUnits(price, "gwei"),
        imageURIs,
        true,
        tokenURI
      );
      await tx.wait();
      alert("Successfully listed item!");
    } catch (error: unknown) {
      console.error("Error listing item:", error);
      const contractError = error as ContractError;
      alert(`Error listing item: ${contractError.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-white rounded-lg shadow">
            <p className="text-center text-lg">
              Please connect your wallet first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-white rounded-lg shadow">
            <p className="text-center text-lg">
              Loading marketplace contract...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

        {/* Register as Seller Form */}
        <div className="mb-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Register as Seller</h2>
          <form onSubmit={handleRegisterSeller}>
            <div className="mb-4">
              <label className="block mb-2">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-luxury-black text-white px-4 py-2 rounded-full disabled:opacity-50"
            >
              {loading ? "Processing..." : "Register (10 GWEI)"}
            </button>
          </form>
        </div>

        {/* List Item Form */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">List New Item</h2>
          <form onSubmit={handleListItem}>
            <div className="grid gap-4">
              <div>
                <label className="block mb-2">Item ID</label>
                <input
                  type="number"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price (in GWEI)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">
                  Image URIs (IPFS CIDs, comma-separated)
                </label>
                <input
                  type="text"
                  value={imageURIs.join(",")}
                  onChange={(e) =>
                    setImageURIs(
                      e.target.value.split(",").map((uri) => uri.trim())
                    )
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Token URI</label>
                <input
                  type="text"
                  value={tokenURI}
                  onChange={(e) => setTokenURI(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-luxury-black text-white px-4 py-2 rounded-full disabled:opacity-50"
            >
              {loading ? "Processing..." : "List Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
