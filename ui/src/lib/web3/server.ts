import { createPublicClient, http, Address } from "viem";
import { arbitrum } from "viem/chains";
import nftCollectionAbi from "@public/abis/NftCollectionAbi.json";
import nftFactoryAbi from "@public/abis/NftFactoryAbi.json";

// Singleton public client for server-side operations
export const serverPublicClient = createPublicClient({
  chain: arbitrum,
  transport: http(
    process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc"
  ),
});

// Nft Factory smart contract address
const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address;

/**
 * Read NFT collection details from the contract
 */
export async function getNftCollectionDetails(collectionAddress: Address) {
  try {
    // Execute multiple contract read operations in parallel
    const [name, symbol, totalSupply, maxSupply, owner] = await Promise.all([
      serverPublicClient.readContract({
        address: collectionAddress,
        abi: nftCollectionAbi.abi,
        functionName: "name",
      }),
      serverPublicClient.readContract({
        address: collectionAddress,
        abi: nftCollectionAbi.abi,
        functionName: "symbol",
      }),
      serverPublicClient.readContract({
        address: collectionAddress,
        abi: nftCollectionAbi.abi,
        functionName: "totalSupply",
      }),
      serverPublicClient.readContract({
        address: collectionAddress,
        abi: nftCollectionAbi.abi,
        functionName: "maxSupply",
      }),
      serverPublicClient.readContract({
        address: collectionAddress,
        abi: nftCollectionAbi.abi,
        functionName: "owner",
      }),
    ]);

    return {
      address: collectionAddress,
      name: name as string,
      symbol: symbol as string,
      totalSupply: Number(totalSupply),
      maxSupply: Number(maxSupply),
      owner: owner as Address,
    };
  } catch (error) {
    console.error("Error reading collection details:", error);
    throw new Error(
      `Failed to get collection details: ${(error as Error).message}`
    );
  }
}

/**
 * Get all NFTs from a collection
 */
export async function getNftsInCollection(collectionAddress: Address) {
  try {
    // Get total supply
    const totalSupply = await serverPublicClient.readContract({
      address: collectionAddress,
      abi: nftCollectionAbi.abi,
      functionName: "totalSupply",
    });

    const tokenCount = Number(totalSupply);
    const tokens = [];

    // Get token details for each token ID
    for (let i = 0; i < tokenCount; i++) {
      try {
        // Get token owner and URI for each token
        const [owner, tokenURI] = await Promise.all([
          serverPublicClient.readContract({
            address: collectionAddress,
            abi: nftCollectionAbi.abi,
            functionName: "ownerOf",
            args: [BigInt(i)],
          }),
          serverPublicClient.readContract({
            address: collectionAddress,
            abi: nftCollectionAbi.abi,
            functionName: "tokenURI",
            args: [BigInt(i)],
          }),
        ]);

        tokens.push({
          tokenId: i,
          owner: owner as Address,
          tokenURI: tokenURI as string,
        });
      } catch (error) {
        console.error(`Error getting token ${i} details:`, error);
      }
    }

    return tokens;
  } catch (error) {
    console.error("Error reading NFTs from collection:", error);
    throw new Error(
      `Failed to get collection NFTs: ${(error as Error).message}`
    );
  }
}

/**
 * Get all collections from the factory
 */
export async function getAllCollections() {
  try {
    const collections = await serverPublicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: nftFactoryAbi.abi,
      functionName: "getAllCollections",
    });

    return collections as Address[];
  } catch (error) {
    console.error("Error getting all collections:", error);
    throw new Error(`Failed to get collections: ${(error as Error).message}`);
  }
}

/**
 * Get collections by a specific user/owner
 */
export async function getCollectionsByUser(userAddress: Address) {
  try {
    const collections = await serverPublicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: nftFactoryAbi.abi,
      functionName: "getCollectionsByUser",
      args: [userAddress],
    });

    return collections as Address[];
  } catch (error) {
    console.error(`Error getting collections for user ${userAddress}:`, error);
    throw new Error(
      `Failed to get user collections: ${(error as Error).message}`
    );
  }
}

export async function validateCollectionOwner(
  collectionAddress: Address,
  ownerAddress: Address
): Promise<boolean> {
  try {
    // Normalize addresses for comparison (convert to lowercase)
    const normalizedOwnerAddress = ownerAddress.toLowerCase();

    // Get the owner of the collection from the contract
    const contractOwner = await serverPublicClient.readContract({
      address: collectionAddress,
      abi: nftCollectionAbi.abi,
      functionName: "owner",
    });

    // Convert the returned owner to a string and normalize
    const normalizedContractOwner = (contractOwner as string).toLowerCase();

    // Compare the addresses
    return normalizedContractOwner === normalizedOwnerAddress;
  } catch (error) {
    console.error(
      `Error validating collection owner for ${collectionAddress}:`,
      error
    );
    // In case of error, return false to be safe
    return false;
  }
}

export async function getDeploymentFee() {
  try {
    const fee = await serverPublicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: nftFactoryAbi.abi,
      functionName: "deploymentFee",
    });

    return fee as bigint;
  } catch (error) {
    console.error("Error getting deployment fee:", error);
    throw new Error(
      `Failed to get deployment fee: ${(error as Error).message}`
    );
  }
}
