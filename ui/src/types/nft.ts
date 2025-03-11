export type NftAttribute = {
  trait_type: string;
  value: string | number;
  // Optional fields that some metadata standards include
  display_type?: string;
  max_value?: number;
};

export type NftMetadata = {
  name: string;
  description: string;
  image: string; // Arweave transaction ID or full URL
  attributes?: NftAttribute[];

  // Additional optional fields commonly found in NFT metadata
  // external_url?: string;
  // background_color?: string;
  // animation_url?: string;
  // youtube_url?: string;
};

// Token type for use in components
export type NftToken = {
  tokenId: number;
  owner: string;
  tokenURI: string;
  metadata?: NftMetadata;
};

// Collection info type
export type CollectionInfo = {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number;
  maxSupply: number;
  owner: string;
};
