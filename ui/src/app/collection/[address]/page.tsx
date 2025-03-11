import {
  getCollectionDetailsAction,
  getCollectionNftsAction,
} from "@/app/actions/contractActions";
import { notFound } from "next/navigation";
import { Address } from "viem";
import { MintNewNfts } from "./MintNewNfts";
import { NftGrid } from "./NftGrid";

export default async function CollectionPage({
  params,
}: {
  params: { address: string };
}) {
  try {
    // Validate the address format (basic check)
    if (
      !params.address ||
      !params.address.startsWith("0x") ||
      params.address.length !== 42
    ) {
      return notFound();
    }

    const collectionAddress = params.address as Address;

    // Fetch collection data and NFTs in parallel
    const [collectionInfo, nfts] = await Promise.all([
      getCollectionDetailsAction(collectionAddress),
      getCollectionNftsAction(collectionAddress),
    ]);

    // const accountIsOwner = collectionInfo.owner === collectionInfo.address;

    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{collectionInfo.name}</h1>
            <p className="text-gray-500">{collectionInfo.symbol}</p>
          </div>
          <MintNewNfts collectionOnwer={collectionInfo.owner} />
        </div>
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Collection Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-500">
                  Contract Address
                </span>
                <a
                  href={`https://arbiscan.io/address/${collectionAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {collectionAddress}
                </a>
              </div>
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-500">
                  Owner
                </span>
                <a
                  href={`https://arbiscan.io/address/${collectionInfo.owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {collectionInfo.owner}
                </a>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-500">
                  Total Supply
                </span>
                <span>
                  {collectionInfo.totalSupply} / {collectionInfo.maxSupply}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">{collectionInfo.name}</h1>
            <p className="text-gray-600">Symbol: {collectionInfo.symbol}</p>
            <p className="text-gray-600">
              NFTs: {collectionInfo.totalSupply} /{" "}
              {collectionInfo.maxSupply || "Unlimited"}
            </p>
            <p className="text-gray-600">
              Owner:
              <span className="font-mono text-sm ml-2">
                {collectionInfo.owner}
              </span>
            </p>
          </div>

          Owner-only actions rendered client-side
          <OwnerActions
            collectionAddress={collectionAddress}
            ownerAddress={collectionInfo.owner}
          />
        </div> */}

        {nfts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">This collection has no NFTs yet.</p>
          </div>
        ) : (
          <NftGrid nfts={nfts} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading collection:", error);
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>
            Error: {(error as Error).message || "Failed to load collection"}
          </p>
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
      title: `${collectionInfo.name} | NFT Collection`,
      description: `View the ${collectionInfo.name} NFT collection on the blockchain`,
    };
  } catch {
    return {
      title: "NFT Collection",
      description: "NFT Collection details",
    };
  }
}
