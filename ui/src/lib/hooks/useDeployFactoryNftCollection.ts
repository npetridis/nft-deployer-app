"use client";

import { useState } from "react";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  http,
  decodeEventLog,
} from "viem";
import { arbitrum } from "viem/chains";
import { writeContract } from "viem/actions";
import { toast } from "sonner";

import nftFactoryAbi from "@public/abis/NftFactoryAbi.json";
import { getDeploymentFee } from "../web3/server";

const FACTORY_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_FACTORY_ADDRESS as Address;

const COLLECTION_CREATED_SIGNATURE =
  process.env.NEXT_PUBLIC_COLLECTION_CREATED_SIGNATURE ||
  "0x6974864ab24c795f57c207a650ae6763287c14a1c55fedc8506acb02796eb1a5";

const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
});

export type DeployNftCollectionProps = {
  name: string;
  symbol: string;
  baseURI: string;
  maxSupply: number;
  ownerAddress: Address;
};

export const useDeployFactoryNftCollection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    hash: `0x${string}`;
    contractAddress: Address | null;
  } | null>(null);

  const deployNftCollection = async (params: DeployNftCollectionProps) => {
    if (!params.ownerAddress) {
      setError("Wallet not connected");
      return null;
    }

    // Check if the browser has ethereum provider (like MetaMask)
    if (!window.ethereum) {
      setError("Wallet not connected");
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to deploy a collection.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create wallet client using the browser's ethereum provider
      const walletClient = createWalletClient({
        account: params.ownerAddress,
        chain: arbitrum,
        transport: custom(window.ethereum),
      });

      const deploymentFee = await getDeploymentFee();

      // Manually set gas parameters to help with estimation issues
      // const gasLimit = BigInt(3000000); // Set a high gas limit (3M gas) for contract deployment

      // console.log("Using manual gas limit:", gasLimit.toString());

      // First try to simulate the transaction to check for issues
      let hash: `0x${string}`;

      try {
        const { request } = await publicClient.simulateContract({
          account: params.ownerAddress,
          address: FACTORY_CONTRACT_ADDRESS,
          abi: nftFactoryAbi.abi,
          functionName: "createCollection",
          args: [
            params.name,
            params.symbol,
            params.baseURI,
            BigInt(params.maxSupply),
          ],
          value: deploymentFee,
        });

        console.log("Simulation successful, proceeding with transaction");

        // Call the createCollection function on the contract with manual gas settings
        hash = await writeContract(walletClient, {
          ...request,
          // gas: gasLimit, // Override with manual gas limit
        });
      } catch (simulationError) {
        console.error("Transaction simulation failed:", simulationError);
        console.log("Trying direct transaction with manual parameters...");

        // If simulation fails, try direct transaction with additional settings
        hash = await writeContract(walletClient, {
          account: params.ownerAddress,
          address: FACTORY_CONTRACT_ADDRESS,
          abi: nftFactoryAbi.abi,
          functionName: "createCollection",
          args: [
            params.name,
            params.symbol,
            params.baseURI,
            BigInt(params.maxSupply),
          ],
          value: deploymentFee,
          // gas: gasLimit,
          // Force MetaMask to accept the transaction even if it thinks it will fail
        });
      }

      console.log("Transaction hash:", hash);

      toast.success("Transaction submitted", {
        description: `Tx hash: ${hash}. \nWaiting for the transaction to be mined.`,
        duration: 5000,
      });

      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      console.log("--- Transaction receipt:", receipt);

      // Find the contract address from the transaction events
      let contractAddress: Address | null = null;

      // Look for logs with the CollectionCreated event signature
      const collectionCreatedLog = receipt.logs.find(
        (log) => log.topics[0] === COLLECTION_CREATED_SIGNATURE
      );

      if (collectionCreatedLog) {
        // Decode the event with the correct event name specified
        const event = decodeEventLog({
          abi: nftFactoryAbi.abi,
          data: collectionCreatedLog.data,
          topics: collectionCreatedLog.topics,
          eventName: "CollectionCreated",
        });

        console.log("Parsed CollectionCreated event:", event);

        // Extract the contract address
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        contractAddress = (event?.args as any)?.collectionAddress as Address;

        toast.success("Transaction was successfully mined", {
          description: `Nft Collection address: ${contractAddress}.\nTx hash: ${hash}.`,
          duration: 5000,
        });
      } else {
        console.log("CollectionCreated event not found in transaction logs");

        // Debugging: Print all event signatures found
        console.log("Available log topics:");
        receipt.logs.forEach((log, i) => {
          console.log(`Log ${i} topic 0:`, log.topics[0]);
        });
      }

      // Set the result
      const finalResult = {
        hash,
        contractAddress,
      };
      setResult(finalResult);

      return finalResult;
    } catch (err) {
      console.error("Error deploying NFT collection:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to deploy NFT collection");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deployNftCollection,
    isLoading,
    error,
    result,
  };
};
