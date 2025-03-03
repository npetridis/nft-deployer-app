"use client";

import { Control, FieldErrorsImpl, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { MetadataFieldArray } from "./MetadataFieldArray";
import { DefineNftsFormValues } from "./formSchema";

interface NftItemFormProps {
  index: number;
  fieldId: string;
  control: Control<DefineNftsFormValues>;
  register: UseFormRegister<DefineNftsFormValues>;
  errors: FieldErrorsImpl<DefineNftsFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export function NftItemForm({
  index,
  fieldId,
  control,
  register,
  errors,
  onRemove,
  canRemove,
}: NftItemFormProps) {
  // For retrieving array-level errors, e.g. errors.nfts?.[index]
  const nftError = errors?.nfts?.[index];

  // We still rely on a nested `useFieldArray` for metadata (inside the child),
  // OR we can delegate it to a separate child component (MetadataFieldArray).
  // Below, we demonstrate re-using the existing <MetadataFieldArray> component.

  return (
    <div key={fieldId} className="border p-4 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">NFT #{index + 1}</h2>
        {canRemove && (
          <Button variant="destructive" type="button" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      {/* NFT Name */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor={`nfts.${index}.name`}>NFT Name</Label>
        <Input
          id={`nfts.${index}.name`}
          placeholder="e.g. Galactic Warrior"
          {...register(`nfts.${index}.name` as const)}
        />
        {nftError?.name && (
          <p className="text-red-500 text-sm">
            {nftError.name.message as string}
          </p>
        )}
      </div>

      {/* NFT Description */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor={`nfts.${index}.description`}>Description</Label>
        <Textarea
          id={`nfts.${index}.description`}
          placeholder="Describe your NFT"
          {...register(`nfts.${index}.description` as const)}
        />
        {nftError?.description && (
          <p className="text-red-500 text-sm">
            {nftError.description.message as string}
          </p>
        )}
      </div>

      {/* NFT Image */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor={`nfts.${index}.image`}>Image</Label>
        <Input
          id={`nfts.${index}.image`}
          type="file"
          accept="image/*"
          {...register(`nfts.${index}.image` as const)}
        />
        {nftError?.image && (
          <p className="text-red-500 text-sm">
            {nftError.image.message as string}
          </p>
        )}
      </div>

      {/* Owner Address */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor={`nfts.${index}.owner`}>Owner Address</Label>
        <Input
          id={`nfts.${index}.owner`}
          placeholder="0x..."
          {...register(`nfts.${index}.owner` as const)}
        />
        {nftError?.owner && (
          <p className="text-red-500 text-sm">
            {nftError.owner.message as string}
          </p>
        )}
      </div>

      {/* Traits: We re-use the existing MetadataFieldArray component */}
      <MetadataFieldArray
        control={control}
        name={`nfts.${index}.metadata`}
        errors={errors}
      />
    </div>
  );
}
