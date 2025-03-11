// src/utils/create-metadata.ts
import { arweave, getWallet } from "./client";

interface NftAttribute {
  trait_type: string;
  value: string | number;
}

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: NftAttribute[];
}

export async function uploadMetadataToArweave(
  metadata: NftMetadata,
  tokenId: number | string
) {
  try {
    // Get wallet
    const wallet = await getWallet();

    // Convert metadata to JSON string
    const metadataStr = JSON.stringify(metadata, null, 2);

    // Create the transaction
    const transaction = await arweave.createTransaction(
      {
        data: metadataStr,
      },
      wallet
    );

    // Add tags
    transaction.addTag("Content-Type", "application/json");
    transaction.addTag("App-Name", "MyNFTCollection");
    transaction.addTag("Type", "NFT-Metadata");
    transaction.addTag("Token-ID", tokenId.toString());

    // Sign the transaction
    await arweave.transactions.sign(transaction, wallet);

    // Submit the transaction
    const response = await arweave.transactions.post(transaction);

    if (response.status !== 200 && response.status !== 202) {
      throw new Error(`Failed to upload metadata: ${response.statusText}`);
    }

    console.log(
      `Metadata uploaded to Arweave with transaction ID: ${transaction.id}`
    );
    console.log(`View at: https://arweave.net/${transaction.id}`);

    return {
      id: transaction.id,
      url: `https://arweave.net/${transaction.id}`,
    };
  } catch (error) {
    console.error("Error uploading metadata to Arweave:", error);
    throw error;
  }
}
