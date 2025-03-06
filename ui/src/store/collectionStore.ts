// store/collectionStore.ts
import { Address } from "viem";
import { create } from "zustand";

export interface NftTrait {
  traitType: string;
  value: string;
}

export interface NftItem {
  name: string;
  description: string;
  image: FileList | null;
  owner: string;
  metadata: NftTrait[];
}

interface CollectionFormData {
  image: FileList | null;
  name: string;
  ticker: string;
}

interface CollectionStoreState {
  collectionData: CollectionFormData | null;
  setCollectionData: (data: CollectionFormData) => void;

  //nft collection data
  txHash: string | null;
  contractAddress: Address | null;
  setDeployedContract: (txHash: string, contractAddress: Address) => void;

  // Add NFT data to the store
  nfts: NftItem[];
  setNfts: (nfts: NftItem[]) => void;
}

export const useCollectionStore = create<CollectionStoreState>((set) => ({
  collectionData: null,
  setCollectionData: (data) => set({ collectionData: data }),

  txHash: null,
  contractAddress: null,
  setDeployedContract: (txHash, contractAddress) =>
    set({ txHash, contractAddress }),

  nfts: [],
  setNfts: (newNfts) => set({ nfts: newNfts }),
}));
