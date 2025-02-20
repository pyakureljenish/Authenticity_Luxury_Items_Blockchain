"use client";

import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { ethers } from "ethers";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: ethers.BigNumber;
    tokenId: number;
    isAvailable: boolean;
    images: string[];
    sellerAddress: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { contract } = useWeb3();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.buyItem(product.sellerAddress, product.id, {
        value: product.price,
        gasLimit: 200000,
      });
      await tx.wait();
      alert("Purchase successful!");
    } catch (error: any) {
      console.error("Error purchasing item:", error);
      alert(`Error purchasing item: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative h-48">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">
          Price: {ethers.formatUnits(product.price, "gwei")} GWEI
        </p>
        <p className="text-gray-600 mb-4">
          Token ID: {product.tokenId.toString()}
        </p>
        <button
          onClick={handlePurchase}
          disabled={loading || !product.isAvailable}
          className="w-full bg-luxury-black text-white px-4 py-2 rounded-full disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : !product.isAvailable
            ? "Not Available"
            : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
