"use server";

import { Address } from "viem";
import { uploadNftImage } from "@/lib/arweave/uploadNftImage";
import { uploadMetadataToArweave } from "@/lib/arweave/uploadNftMetadata";
import { mintNft } from "@/lib/web3/mintNft";
import { NftMetadata } from "@/types/nft";
import { validateCollectionOwner } from "@/lib/web3/server";
import { revalidatePath } from "next/cache";

export type MintAttribute = {
  trait_type: string;
  value: string;
};

export type MintNftData = {
  name: string;
  description: string;
  image: File;
  attributes: MintAttribute[];
};

export type MintActionResult = {
  success: boolean;
  error?: string;
  details?: string;
  txHash?: string | undefined;
  redirectTo?: string;
  nftId?: number;
};

export async function mintNftAction(
  formData: FormData
): Promise<MintActionResult> {
  try {
    // Extract data from the form
    const contractAddress = formData.get("contractAddress") as string;
    const ownerAddress = formData.get("ownerAddress") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    // Parse attributes from JSON string
    const attributesJson = formData.get("attributes") as string;
    const attributes = JSON.parse(attributesJson) as MintAttribute[];

    // Validate inputs
    if (!contractAddress || !ownerAddress || !name || !imageFile) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Validate ownership
    const isOwner = await validateCollectionOwner(
      contractAddress as Address,
      ownerAddress as Address
    );

    if (!isOwner) {
      return {
        success: false,
        error: "You don't have permission to mint NFTs for this collection",
      };
    }

    // 1. Upload image to Arweave
    console.log("Uploading image to Arweave...");
    const imageResult = await uploadNftImage(imageFile);

    if (!imageResult || !imageResult.id) {
      return {
        success: false,
        error: "Failed to upload image to Arweave",
      };
    }

    // 2. Prepare metadata
    const metadata: NftMetadata = {
      name,
      description,
      image: imageResult.id,
      attributes: attributes.map((attr) => ({
        trait_type: attr.trait_type,
        value: attr.value,
      })),
    };

    // 3. Upload metadata to Arweave
    console.log("Uploading metadata to Arweave...");
    const metadataResult = await uploadMetadataToArweave(metadata, "N/A"); // TODO: remove token id

    if (!metadataResult || !metadataResult.id) {
      return {
        success: false,
        error: "Failed to upload metadata to Arweave",
      };
    }

    // 4. Mint the NFT to the contract
    const metadataUri = metadataResult.id;
    console.log("Minting NFT to contract...");

    const mintResult = await mintNft({
      contractAddress: contractAddress as Address,
      ownerAddress: ownerAddress as Address,
      metadataUri,
    });

    if (mintResult.error) {
      return {
        success: false,
        error: mintResult.error,
        details: JSON.stringify(mintResult.details || {}),
      };
    }

    // Revalidate the collection page to show the new NFT
    revalidatePath(`/collection/${contractAddress}`);

    return {
      success: true,
      txHash: mintResult.txHash ?? undefined,
      redirectTo: `/collection/${contractAddress}`,
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    return {
      success: false,
      error: "Failed to mint NFT",
      details: (error as Error).message,
    };
  }
}
