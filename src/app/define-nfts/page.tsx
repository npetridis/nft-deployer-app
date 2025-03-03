"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";

import { useCollectionStore, NftItem } from "@/store/collectionStore";
import { NftItemForm } from "./NftItemForm";
import { DefineNftsFormValues, defineNftsSchema } from "./formSchema";
import { Plus } from "lucide-react";

export default function DefineNftsPage() {
  const router = useRouter();
  const { address } = useAccount();
  const setNfts = useCollectionStore((state) => state.setNfts);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DefineNftsFormValues>({
    resolver: zodResolver(defineNftsSchema),
    defaultValues: {
      nfts: [
        {
          name: "",
          description: "",
          image: null,
          owner: address ?? "",
          metadata: [{ traitType: "Rarity", value: "Legendary" }],
        },
      ],
    },
  });

  // useFieldArray for top-level "nfts"
  const {
    fields: nftFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "nfts",
  });

  // Submission
  const onSubmit = (data: DefineNftsFormValues) => {
    const preparedNfts: NftItem[] = data.nfts.map((item) => {
      const imageFileList = item.image instanceof FileList ? item.image : null;
      return { ...item, image: imageFileList };
    });

    setNfts(preparedNfts);
    router.push("/review-collection"); // or next step
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Define Your NFTs (Step 2 of 2)
        </h1>
        <p className="text-sm text-muted-foreground">
          Add as many NFTs as you like. Each NFT can have multiple traits.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.nfts?.message && (
          <p className="text-red-500">{errors.nfts.message}</p>
        )}

        {nftFields.map((field, index) => (
          <NftItemForm
            key={field.id}
            fieldId={field.id}
            index={index}
            control={control}
            register={register}
            errors={errors}
            onRemove={() => remove(index)}
            canRemove={nftFields.length > 1}
          />
        ))}

        {/* Add NFT button */}
        <Button
          variant="secondary"
          type="button"
          onClick={() =>
            append({
              name: "",
              description: "",
              image: null,
              owner: address ?? "",
              metadata: [{ traitType: "", value: "" }],
            })
          }
        >
          <span className="mr-2">
            <Plus />
          </span>
          Add NFT
        </Button>

        <div className="flex justify-between pt-8">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/create-collection")}
          >
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </div>
  );
}
