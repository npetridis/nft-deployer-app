"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Address } from "viem";
import { useAccount } from "wagmi";

export const MintNewNfts = ({
  collectionOnwer,
}: {
  collectionOnwer: Address;
}) => {
  const params = useParams();
  const collectionAddress = params.address as Address;
  const { address } = useAccount();

  if (!address || !collectionAddress) {
    return null;
  }

  const accountIsOwner =
    address.toLowerCase() === collectionOnwer.toLowerCase();

  if (!accountIsOwner) {
    return null;
  }

  return (
    <Button asChild>
      <Link href={`/collection/${collectionAddress}/mint`}>Mint New NFTs</Link>
    </Button>
  );
};
