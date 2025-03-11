"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NftToken } from "@/types/nft";

interface NftGridProps {
  nfts: NftToken[];
  collectionAddress?: string;
}

export function NftGrid({ nfts, collectionAddress }: NftGridProps) {
  // State for handling expanded descriptions
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});

  const toggleDescription = (tokenId: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [tokenId.toString()]: !prev[tokenId.toString()],
    }));
  };

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No NFTs have been minted yet.</p>
        {collectionAddress && (
          <Button className="mt-4" asChild>
            <Link href={`/collection/${collectionAddress}/mint`}>
              Mint Your First NFT
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {nfts.map((token) => (
        <div
          key={token.tokenId}
          className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Image Section */}
          <div className="relative h-48 bg-gray-100">
            {token.metadata?.image ? (
              <Image
                src={
                  token.metadata.image.startsWith("ar://")
                    ? token.metadata.image.replace(
                        "ar://",
                        "https://arweave.net/"
                      )
                    : token.metadata.image.startsWith("http")
                    ? token.metadata.image
                    : `https://arweave.net/${token.metadata.image}`
                }
                alt={token.metadata?.name || `NFT #${token.tokenId}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = "/vercel/svg"; // Placeholder image
                  // const target = e.target as HTMLImageElement;
                  // target.style.display = "none";
                  // const fallback = target.parentElement?.querySelector(".fallback");
                  // if (fallback) fallback.classList.remove("hidden");
                }}
              />
            ) : (
              // <div className="fallback hidden flex items-center justify-center h-full">
              //   <span className="text-gray-400">Image failed to load</span>
              // </div>
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            {/* Token ID Badge */}
            <Badge className="absolute top-2 left-2 bg-black/70 text-white">
              #{token.tokenId}
            </Badge>
          </div>

          {/* Content Section */}
          <div className="p-4">
            {/* Title & Description */}
            <h3 className="font-semibold text-lg mb-1">
              {token.metadata?.name || `NFT #${token.tokenId}`}
            </h3>

            {token.metadata?.description && (
              <div className="mb-3">
                <p
                  className={`text-sm text-gray-600 ${
                    !expandedDescriptions[token.tokenId] ? "line-clamp-2" : ""
                  }`}
                >
                  {token.metadata.description}
                </p>
                {token.metadata.description.length > 120 && (
                  <button
                    onClick={() => toggleDescription(token.tokenId)}
                    className="text-xs text-blue-600 mt-1 hover:underline"
                  >
                    {expandedDescriptions[token.tokenId]
                      ? "Show less"
                      : "Show more"}
                  </button>
                )}
              </div>
            )}

            {/* Owner Info */}
            <div className="text-xs text-gray-500 mb-2 truncate">
              Owner:
              <a
                href={`https://arbiscan.io/address/${token.owner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-blue-600 hover:underline"
              >
                {token.owner.substring(0, 6)}...
                {token.owner.substring(token.owner.length - 4)}
              </a>
            </div>

            {/* Metadata Link */}
            {token.tokenURI && (
              <div className="mt-2 text-xs">
                <a
                  href={
                    token.tokenURI.startsWith("ar://")
                      ? `https://arweave.net/${token.tokenURI.replace(
                          "ar://",
                          ""
                        )}`
                      : token.tokenURI
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate block"
                >
                  View Metadata
                </a>
              </div>
            )}

            {/* Attributes */}
            {token.metadata?.attributes &&
              token.metadata.attributes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">
                    Attributes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {token.metadata.attributes.map((attr, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 bg-gray-50 rounded-md text-xs"
                      >
                        <span className="font-semibold">
                          {attr.trait_type || (attr as any).traitType}:
                        </span>{" "}
                        {attr.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
