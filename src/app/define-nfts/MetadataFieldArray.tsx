"use client";

import { useFieldArray, Control, FieldErrorsImpl } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { Plus } from "lucide-react";

// The zod schema for a single trait could look like this:
export const nftTraitSchema = z.object({
  traitType: z.string().min(1, "Trait Type is required"),
  value: z.string().min(1, "Value is required"),
});

// Type for a single trait item
export type NftTraitFormValue = z.infer<typeof nftTraitSchema>;

// This is how your main form's structure might look for reference
// interface DefineNftsFormValues {
//   nfts: Array<{
//     name: string
//     description: string
//     image: FileList | null
//     owner: string
//     metadata: NftTraitFormValue[]
//   }>
// }

// Props for the child component
interface MetadataFieldArrayProps {
  control: Control<any>; // or `Control<DefineNftsFormValues>` if it's not generic
  name: string; // e.g., `nfts.${index}.metadata`
  errors: FieldErrorsImpl; // pass in formState.errors to handle error messages
}

export function MetadataFieldArray({
  control,
  name,
  errors,
}: MetadataFieldArrayProps) {
  // useFieldArray for "metadata" on the relevant NFT
  const {
    fields: traitFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name, // e.g. "nfts.0.metadata"
  });

  return (
    <div className="space-y-2">
      <Label>Metadata (Traits)</Label>
      {traitFields.map((trait, traitIndex) => {
        // We'll parse out the relevant error if it exists
        const traitError = (errors as any)?.nfts?.[0]?.metadata?.[traitIndex];
        // ^ Adjust indexing logic in the parent as needed

        return (
          <div key={trait.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                placeholder="Trait Type"
                // Because the parent form is controlling the entire shape,
                // you’ll need the full path: `nfts.${nftIndex}.metadata.${traitIndex}.traitType`
                // The parent will supply that path via the `name` prop. We'll demonstrate usage in the parent below.
                {...control.register(
                  `${name}.${traitIndex}.traitType` as const
                )}
              />
              {traitError?.traitType && (
                <p className="text-red-500 text-sm">
                  {traitError.traitType.message as string}
                </p>
              )}
            </div>

            <div className="flex-1">
              <Input
                placeholder="Value"
                {...control.register(`${name}.${traitIndex}.value` as const)}
              />
              {traitError?.value && (
                <p className="text-red-500 text-sm">
                  {traitError.value.message as string}
                </p>
              )}
            </div>

            <Button
              variant="destructive"
              type="button"
              onClick={() => remove(traitIndex)}
            >
              X
            </Button>
          </div>
        );
      })}

      <Button
        variant="secondary"
        type="button"
        onClick={() => append({ traitType: "", value: "" })}
      >
        <span className="mr-2">
          <Plus />
        </span>{" "}
        Add Another Trait
      </Button>
    </div>
  );
}
