"use client";

import { useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { arbitrum } from "viem/chains";
import { useCollectionStore } from "@/store/collectionStore";
import erc721Abi from "@/../public/erc721Abi.json";

export type DeployNftCollectionProps = {
  ownderAddress: string;
  name: string;
  ticker: string;
};

export const useDeployNftCollection = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const setDeployedContract = useCollectionStore(
    (state) => state.setDeployedContract
  );
  const contractAddress = useCollectionStore((state) => state.contractAddress);
  const txHash = useCollectionStore((state) => state.txHash);

  async function handleDeployNftCollection({
    ownderAddress,
    name,
    ticker,
  }: DeployNftCollectionProps) {
    const chain = arbitrum;
    try {
      setIsDeploying(true);

      // 1. Check that we have a browser wallet (e.g., MetaMask)
      if (!window.ethereum) {
        alert("No MetaMask (or other) wallet found. Please install one.");
        return;
      }

      // 2. Create a viem 'wallet client' from the user's browser provider
      const walletClient = createWalletClient({
        chain: chain, // or any chain your user has selected
        transport: custom(window.ethereum),
      });

      // if current chain is not mainnet, switch to mainnet
      const currentChainId = await walletClient.getChainId();
      if (currentChainId !== chain.id) {
        try {
          await walletClient.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + chain.id.toString(16) }],
          });
          console.log("Successfully switched to Mainnet.");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          // If so, we prompt to add it
          if (error.code === 4902) {
            // Optionally add the chain using wallet_addEthereumChain
            alert(`Please add the ${chain.name} network to your wallet.`);
            return;
          } else {
            console.error("Failed to switch network:", error);
          }
        }
      }

      // For reading receipts after deployment (optional)
      const publicClient = createPublicClient({
        chain: chain,
        transport: http(), // or the same 'custom(window.ethereum)' if you prefer
      });

      // Request user accounts (prompts MetaMask to connect)
      const accounts = await walletClient.requestAddresses();
      const account = accounts[0];
      if (!account) {
        alert("No account selected.");
        return;
      }

      // Deploy the contract
      console.log("Deploying NFT...");
      let hash;
      try {
        hash = await walletClient.deployContract({
          abi: erc721Abi.abi,
          bytecode: erc721Abi.bytecode.object as `0x${string}`,
          account, // The user paying for this transaction
          // constructor arguments if your contract's constructor requires them, e.g.:
          args: [ownderAddress, name, ticker],
          // gasLimit: 3000000, // or whatever limit you need
        });
      } catch (error) {
        console.error("Deployment error:", error);
        alert("Deployment failed. Check console for details.");
        return;
      }

      console.log("Transaction hash:", hash);

      // Wait for the transaction to be mined, so we get the contract address
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      console.log("Deployment receipt:", receipt);
      if (receipt.status === "reverted") {
        alert("Transaction reverted. Deployment failed.");
        return;
      }

      if (!receipt.contractAddress) {
        console.log("Something went wrong with contract deployment");
        alert("No contract address for deployed contract.");

        return;
      }

      const deployedAddress = receipt.contractAddress;
      console.log("NFT Contract deployed at:", deployedAddress);

      setDeployedContract(receipt.transactionHash, deployedAddress);
      
      // Store deployed contract in localStorage for demo purposes
      try {
        const storedData = localStorage.getItem('deployed_contracts');
        const contracts = storedData ? JSON.parse(storedData) : [];
        contracts.push({
          address: deployedAddress,
          owner: ownderAddress,
          txHash: receipt.transactionHash,
          deployedAt: new Date().toISOString()
        });
        localStorage.setItem('deployed_contracts', JSON.stringify(contracts));
      } catch (e) {
        console.error("Failed to store contract in local storage:", e);
      }
    } catch (error) {
      console.error("Deployment error:", error);
      alert("Deployment failed. Check console for details.");
    } finally {
      setIsDeploying(false);
    }
  }

  return {
    isDeploying,
    deployNftCollection: handleDeployNftCollection,
    contractAddress,
    txHash,
  };
};
