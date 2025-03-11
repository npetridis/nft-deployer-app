"use server";

import { Address } from "viem";
import {
  getNftCollectionDetails,
  getNftsInCollection,
  getAllCollections,
  getCollectionsByUser,
} from "@/lib/web3/server";
import { unstable_cache } from "next/cache";

// Cache the collection details for 30 seconds
export const getCollectionDetailsAction = unstable_cache(
  async (collectionAddress: Address) => {
    return await getNftCollectionDetails(collectionAddress);
  },
  ["collection-details"],
  { revalidate: 30 }
);

// Cache the collection NFTs for 30 seconds
export const getCollectionNftsAction = unstable_cache(
  async (collectionAddress: Address) => {
    const nftList = await getNftsInCollection(collectionAddress);

    // Additionally, fetch metadata for each NFT
    const nftsWithMetadata = await Promise.all(
      nftList.map(async (nft) => {
        try {
          // For Arweave URIs, handle different formats
          const metadataUrl = nft.tokenURI.startsWith("ar://")
            ? `https://arweave.net/${nft.tokenURI.replace("ar://", "")}`
            : nft.tokenURI;

          const response = await fetch(metadataUrl);
          const metadata = await response.json();

          return {
            ...nft,
            metadata,
          };
        } catch (error) {
          console.error(
            `Failed to fetch metadata for token ${nft.tokenId}:`,
            error
          );
          return nft;
        }
      })
    );

    return nftsWithMetadata;
  },
  ["collection-nfts"],
  { revalidate: 30 }
);

// Get all collections
export const getAllCollectionsAction = unstable_cache(
  async () => {
    return await getAllCollections();
  },
  ["all-collections"],
  { revalidate: 60 }
);

// Get collections by user
export const getUserCollectionsAction = unstable_cache(
  async (userAddress: Address) => {
    return await getCollectionsByUser(userAddress);
  },
  ["user-collections"],
  { revalidate: 60 }
);
