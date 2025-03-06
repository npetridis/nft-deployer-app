import * as z from "zod";

export const nftItemSchema = z.object({
  name: z.string().min(1, "NFT Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z
    .any()
    .refine((files) => files?.length > 0, "An image is required.")
    .optional(),
  owner: z.string().min(1, "Owner address is required"),
  metadata: z
    .array(
      z.object({
        traitType: z.string().min(1, "Trait Type is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .nonempty(),
});

// 2) Zod schema for the entire form
export const defineNftsSchema = z.object({
  nfts: z.array(nftItemSchema).nonempty("You must define at least one NFT"),
});

export type DefineNftsFormValues = z.infer<typeof defineNftsSchema>;
