import { createPublicClient, http, createWalletClient, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum } from "viem/chains";
import nftCollectionAbi from "@public/abis/NftCollectionAbi.json";

// Function to mint the NFT to the smart contract
async function mintNftToContract(
  to: Address,
  metadataUri: string,
  contractAddress: string,
  privateKey: string
) {
  // Create a public client for read operations
  const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http(),
  });

  // Create a wallet client for write operations
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: arbitrum,
    transport: http(),
  });

  try {
    // Mint the NFT
    const hash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: nftCollectionAbi.abi,
      functionName: "mint",
      args: [to, metadataUri],
    });

    // Wait for the transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return {
      txHash: hash,
      receipt,
    };
  } catch (error) {
    console.error("Error minting NFT to contract:", error);
    throw error;
  }
}

type MintNftParams = {
  contractAddress: Address;
  ownerAddress: Address;
  metadataUri: string;
};

export async function mintNft({
  contractAddress,
  ownerAddress,
  metadataUri,
}: MintNftParams) {
  let mintResult = null;
  try {
    // Get private key from environment variable - in a real app, this would be more secure
    const privateKey = "0x" + process.env.WALLET_PRIVATE_KEY;

    if (!privateKey) {
      throw new Error("Missing private key for NFT deployment");
    }

    console.log("Minting NFT to contract...");
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Owner Address: ${ownerAddress}`);

    mintResult = await mintNftToContract(
      ownerAddress,
      metadataUri,
      contractAddress,
      privateKey
    );

    console.log("NFT Successfully Minted to Contract:");
    console.log("--------------------------------");
    console.log(`Transaction Hash: ${mintResult.txHash}`);
    console.log("--------------------------------");
  } catch (error) {
    console.error("Error minting NFT to contract:", error);
    return {
      error: "Error minting NFT to contract",
      details: error,
      txHash: null,
      receipt: null,
    };
  }
  return { ...mintResult, error: null, details: null }; // Return the result and error
}
