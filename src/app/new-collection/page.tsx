"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { useCollectionStore } from "@/store/collectionStore"; // update path if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 1) Define a Zod schema for form validation
const createCollectionSchema = z.object({
  // image: z
  //   .any()
  //   .refine((files) => files?.length > 0, "An image is required.")
  //   .optional(),
  name: z.string().min(1, "Collection name is required."),
  ticker: z.string().min(1, "Ticker is required."),
});

// 2) Infer the TS type for the form inputs from the schema
type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;

export default function CreateCollectionPage() {
  const router = useRouter();
  const setCollectionData = useCollectionStore(
    (state) => state.setCollectionData
  );

  // 3) Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionSchema),
  });

  // 4) Submission handler
  const onSubmit = (data: CreateCollectionFormValues) => {
    // Convert data.image from FileList to FileList | null
    // const imageFileList = data.image instanceof FileList ? data.image : null;

    setCollectionData({
      image: null,
      name: data.name,
      ticker: data.ticker,
    });

    // Navigate to the next step
    router.push("/define-nfts");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Step Progress Indicator */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Create NFT Collection (Step 1 of 2)
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Provide basic information for your new NFT collection.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        {/* <div className="flex flex-col space-y-1">
          <Label htmlFor="image">Collection Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register("image", { required: false })}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">
              {errors.image.message?.toString()}
            </p>
          )}
        </div> */}

        {/* Name */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name">Collection Name</Label>
          <Input
            id="name"
            placeholder="e.g. My Awesome Collection"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Ticker */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="ticker">Collection Ticker</Label>
          <Input id="ticker" placeholder="e.g. MAC" {...register("ticker")} />
          {errors.ticker && (
            <p className="text-red-500 text-sm">{errors.ticker.message}</p>
          )}
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <Button type="submit" variant={"default"}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
