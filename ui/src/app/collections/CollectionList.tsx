"use client";

import { Button } from "@/components/ui/button";
import { CollectionInfo } from "@/types/nft";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Address } from "viem";
import {
  getCollectionDetailsAction,
  getUserCollectionsAction,
} from "@/app/actions";

export default function CollectionList({
  userAddress,
}: {
  userAddress: Address | undefined;
}) {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserCollections() {
      if (!userAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const addresses = await getUserCollectionsAction(userAddress);

        // If no collections are found, we're done
        if (!addresses || addresses.length === 0) {
          setCollections([]);
          return;
        }

        // Fetch details for each collection in parallel
        const collectionsData = await Promise.all(
          addresses.map(async (address) => {
            try {
              // Use the server action to get collection details
              const info = await getCollectionDetailsAction(address);
              return info;
            } catch (err) {
              console.error(
                `Error fetching data for contract ${address}:`,
                err
              );
              // Return partial data if there's an error with this specific contract
              return {
                address,
                name: "Error loading",
                symbol: "ERR",
                totalSupply: 0,
                maxSupply: 0,
                owner: userAddress,
              };
            }
          })
        );

        setCollections(collectionsData.filter(Boolean) as CollectionInfo[]);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("Failed to fetch your collections from the blockchain");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserCollections();
  }, [userAddress]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-12 h-[30vh]">
        <Loader2 className="h-4 w-4 animate-spin mr-4" />
        <p>Loading your collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded text-red-700">
        {error}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">
          You don&apos;t have any NFT collections yet
        </p>
        <Button asChild>
          <Link href="/create-collection">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Collection
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left border-b">Collection Name</th>
            <th className="py-3 px-4 text-left border-b">Symbol</th>
            <th className="py-3 px-4 text-left border-b">Supply</th>
            <th className="py-3 px-4 text-left border-b">Contract Address</th>
            <th className="py-3 px-4 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr key={collection.address} className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b">
                <Link
                  href={`/collection/${collection.address}`}
                  className="font-medium hover:text-blue-600 transition-colors"
                >
                  {collection.name}
                </Link>
              </td>
              <td className="py-3 px-4 border-b">{collection.symbol}</td>
              <td className="py-3 px-4 border-b">
                {collection.totalSupply} / {collection.maxSupply || "∞"}
              </td>
              <td className="py-3 px-4 border-b font-mono text-sm">
                <a
                  href={`https://arbiscan.io/address/${collection.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {collection.address.substring(0, 8)}...
                  {collection.address.substring(collection.address.length - 6)}
                </a>
              </td>
              <td className="py-3 px-4 border-b">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/collection/${collection.address}`}>View</Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/collection/${collection.address}/mint`}>
                      Mint
                    </Link>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
