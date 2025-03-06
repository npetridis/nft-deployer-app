"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useUserContracts } from "@/lib/hooks/useUserContracts";
import { useEffect } from "react";

export default function CollectionsPage() {
  const { address, isConnected } = useAccount();
  const { contracts, isLoading, error } = useUserContracts(address);

  // This is a workaround for Hydration mismatch in Next.js when using localStorage
  useEffect(() => {
    // Force a re-render on client side to avoid hydration mismatch
  }, []);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
        <p className="text-lg">
          Please connect your wallet to view your collections
        </p>
        <Button asChild>
          <Link href="/new-collection">Create new collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your NFT Collections on Arbitrum</h1>
        <Button asChild>
          <Link href="/new-collection">Create new collection</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <p>Loading your collections...</p>
        </div>
      ) : error ? (
        <div className="p-4 border border-red-300 bg-red-50 rounded text-red-700">
          {error}
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            You don't have any NFT collections yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left border-b">
                  Collection Name
                </th>
                <th className="py-3 px-4 text-left border-b">Symbol</th>
                <th className="py-3 px-4 text-left border-b">
                  Contract Address
                </th>
                <th className="py-3 px-4 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.address} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{contract.name}</td>
                  <td className="py-3 px-4 border-b">{contract.symbol}</td>
                  <td className="py-3 px-4 border-b font-mono text-sm">
                    <a
                      href={`https://arbiscan.io/address/${contract.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {contract.address.substring(0, 8)}...
                      {contract.address.substring(contract.address.length - 6)}
                    </a>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/define-nfts?contract=${contract.address}`}>
                        Mint NFTs
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
