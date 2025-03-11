"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import CollectionList from "./CollectionList";

export default function CollectionsPage() {
  const { address, isConnected, isConnecting } = useAccount();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your NFT Collections on Arbitrum</h1>
        <Button asChild>
          <Link href="/create-collection">
            <Plus className="h-4 w-4" />
            Create new collection
          </Link>
        </Button>
      </div>

      {!isConnected && !isConnecting ? (
        <div className="flex flex-col items-center justify-center h-[40vh] gap-4  rounded-lg">
          <p className="text-lg">
            Connect your wallet to view your collections
          </p>
        </div>
      ) : (
        <CollectionList userAddress={address} />
      )}
    </div>
  );
}
