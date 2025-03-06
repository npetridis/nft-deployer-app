"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { arbitrum } from "viem/chains";
import { useAccount } from "wagmi";
import erc721Abi from "../../public/erc721Abi.json";

export function Profile() {
  const { address } = useAccount();
  // const { data, error, status } = useEnsName({ address });

  const chain = arbitrum;

  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  async function handleDeploy() {
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
          args: ["0x853A350eB68F23C95E2F7DCf79F16Cdb4059Df8e"],
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

      const deployedAddress = receipt.contractAddress;
      console.log("NFT Contract deployed at:", deployedAddress);

      setContractAddress(deployedAddress || null);
      setTxHash(receipt.transactionHash);
    } catch (error) {
      console.error("Deployment error:", error);
      alert("Deployment failed. Check console for details.");
    } finally {
      setIsDeploying(false);
    }
  }

  return (
    <>
      <header className="flex justify-between items-center p-4 border-b-2 w-full">
        <h1 className="text-xl">Dashboard</h1>
        <ConnectButton />
      </header>
      <div className="flex justify-center pt-32">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div>Address: {address}</div>
          {/* {status === "pending" && <div>Loading ENS name</div>}
          {status === "error" && (
            <div>Error fetching ENS name: {error.message}</div>
          )}
          {status === "success" && <div>ENS name: {data}</div>} */}
          <div className="">
            {isDeploying ? (
              <div>Deploying NFT...</div>
            ) : contractAddress ? (
              <>
                <div>Deployed NFT at: {contractAddress}</div>
                <div>tx hash: {txHash}</div>
              </>
            ) : (
              <div>No NFT deployed yet</div>
            )}
          </div>
          <Button onClick={handleDeploy}>Deploy NFT</Button>
        </div>
      </div>
    </>
  );
}
