"use client";

import { NftItem, useCollectionStore } from "@/store/collectionStore";

const ReviewCollectionPage = () => {
  const { collectionData, nfts } = useCollectionStore();

  return (
    <div className="w-xl flex flex-col justify-start align-top">
      <h1>Collection Review</h1>
      <ul>
        <li>{collectionData?.name}</li>
        <li>{collectionData?.ticker}</li>
      </ul>
      <ul>
        {nfts.map((nft: NftItem, index) => (
          <li key={index}>
            <h2>{nft.name}</h2>
            <p>{nft.description}</p>
            <p>Owner: {nft.owner}</p>
            <p> Metadata: {JSON.stringify(nft.metadata)}</p>
            {/* <img src={nft.image} alt={nft.name} /> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewCollectionPage;
