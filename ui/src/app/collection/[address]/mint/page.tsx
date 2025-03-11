import { Suspense } from "react";
import { Address } from "viem";
import { notFound } from "next/navigation";
import { getCollectionDetailsAction } from "@/app/actions/contractActions";
import MintForm from "./MintForm";

export default async function MintNftsPage({
  params,
}: {
  params: { address: string };
}) {
  // Validate address format
  if (
    !params.address ||
    !params.address.startsWith("0x") ||
    params.address.length !== 42
  ) {
    return notFound();
  }

  const collectionAddress = params.address as Address;

  try {
    // Get collection information to verify it exists and for display
    const collectionInfo = await getCollectionDetailsAction(collectionAddress);

    return (
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mint New NFTs</h1>
          <p className="text-gray-600 mt-2">
            Create new NFTs for the {collectionInfo.name} collection
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Collection Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Collection Name
              </p>
              <p>{collectionInfo.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Symbol</p>
              <p>{collectionInfo.symbol}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Current Supply
              </p>
              <p>
                {collectionInfo.totalSupply} / {collectionInfo.maxSupply || "∞"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Contract Address
              </p>
              <p className="font-mono text-sm break-all">{collectionAddress}</p>
            </div>
          </div>

          <Suspense fallback={<div>Loading mint form...</div>}>
            <MintForm
              collectionAddress={collectionAddress}
              collectionInfo={collectionInfo}
            />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading collection for minting:", error);
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>
            Error: Could not load collection information. The collection may not
            exist or there was a problem connecting to the blockchain.
          </p>
          <p className="mt-2 text-sm">{(error as Error).message}</p>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({
  params,
}: {
  params: { address: string };
}) {
  try {
    const collectionInfo = await getCollectionDetailsAction(
      params.address as Address
    );
    return {
      title: `Mint NFTs | ${collectionInfo.name}`,
      description: `Create new NFTs for the ${collectionInfo.name} collection`,
    };
  } catch {
    return {
      title: "Mint NFTs",
      description: "Create new NFTs for your collection",
    };
  }
}
