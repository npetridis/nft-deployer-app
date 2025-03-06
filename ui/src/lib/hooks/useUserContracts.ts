"use client";

import { useState, useEffect } from "react";
import { createPublicClient, http, getContract, Address } from "viem";
import { arbitrum } from "viem/chains";
import erc721Abi from "@public/erc721Abi.json";

interface ContractInfo {
  address: Address;
  name: string;
  symbol: string;
  owner: Address;
  tokenCount?: number;
}

export const useUserContracts = (userAddress?: Address) => {
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userAddress) return;

    async function fetchUserContracts() {
      setIsLoading(true);
      setError(null);

      try {
        // Create a public client for Arbitrum
        const publicClient = createPublicClient({
          chain: arbitrum,
          transport: http(),
        });

        // This is just a placeholder - in a real app you'd need to use an indexer API
        // like The Graph or Etherscan API to get all contracts owned by a user
        // For demo purposes, we're using the contracts from the store

        // Get contracts from localStorage for demo
        const storedData = localStorage.getItem("deployed_contracts");
        const deployedContracts: Address[] = storedData
          ? JSON.parse(storedData)
              .filter(
                (item: any) =>
                  item.owner?.toLowerCase() === userAddress.toLowerCase()
              )
              .map((item: any) => item.address as Address)
          : [];

        // Add the contract from the store if it exists
        const resultContracts: ContractInfo[] = [];

        // Fetch each contract's info
        for (const contractAddress of deployedContracts) {
          try {
            const contract = getContract({
              address: contractAddress,
              abi: erc721Abi.abi,
              publicClient,
            });

            const [name, symbol, owner] = await Promise.all([
              contract.read.name(),
              contract.read.symbol(),
              contract.read.owner(),
            ]);

            resultContracts.push({
              address: contractAddress,
              name: name as string,
              symbol: symbol as string,
              owner: owner as Address,
            });
          } catch (err) {
            console.error(`Error fetching contract ${contractAddress}:`, err);
          }
        }

        setContracts(resultContracts);
      } catch (err) {
        console.error("Error fetching user contracts:", err);
        setError("Failed to fetch contracts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserContracts();
  }, [userAddress]);

  return { contracts, isLoading, error };
};
