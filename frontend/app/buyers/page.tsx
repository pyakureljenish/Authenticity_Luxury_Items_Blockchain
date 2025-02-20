"use client";

import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { ethers } from "ethers";
import ProductCard from "@/components/ProductCard";

export default function BuyersPage() {
  const { isConnected, contract } = useWeb3();
  const [sellerAddress, setSellerAddress] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !sellerAddress) return;

    try {
      setLoading(true);
      const result = await contract.getAllItemsBySellers(sellerAddress);
      const [names, prices, contractAddress, tokenIds, itemIds, availability] =
        result;

      const productsData = await Promise.all(
        names.map(async (name: string, index: number) => {
          const imageLinks = await contract.getImageDisplayLinks(
            sellerAddress,
            itemIds[index]
          );
          return {
            id: itemIds[index],
            name,
            price: prices[index],
            tokenId: tokenIds[index],
            isAvailable: availability[index],
            images: imageLinks,
            sellerAddress,
            contractAddress,
          };
        })
      );

      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const fetchItemIds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !sellerAddress) return;

    try {
      setLoading(true);
      const result = await contract.getAllItemIdsBySeller(sellerAddress);
      console.log(result);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error fetching products");
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

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Products</h1>

        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <form onSubmit={fetchItemIds} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter seller address"
              value={sellerAddress}
              onChange={(e) => setSellerAddress(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-luxury-black text-white px-6 py-2 rounded-full disabled:opacity-50"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={`${product.sellerAddress}-${product.id}`}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
