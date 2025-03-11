"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { mintNftAction } from "./actions";
import { ImageUpload } from "./ImageUpload";
import { AttributeFields } from "./AttributeFields";
import { CollectionInfo } from "@/types/nft";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.instanceof(File, { message: "Image is required" }),
  attributes: z
    .array(
      z.object({
        trait_type: z.string().min(1, "Trait type is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MintFormProps {
  collectionAddress: Address;
  collectionInfo: CollectionInfo;
}

export default function MintForm({ collectionAddress }: MintFormProps) {
  const router = useRouter();
  const { address } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
    txHash?: string;
  }>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      attributes: [],
    },
  });

  const handleSubmit = async (data: FormValues) => {
    if (!address) {
      setResult({ success: false, error: "Please connect your wallet" });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData object
      const formData = new FormData();
      formData.append("contractAddress", collectionAddress);
      formData.append("ownerAddress", address);
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("image", data.image);
      formData.append("attributes", JSON.stringify(data.attributes || []));

      // Send to server action
      const result = await mintNftAction(formData);

      setResult({
        success: result.success,
        error: result.error,
        txHash: result.txHash ?? undefined,
      });

      //
      // TODO: Add wait for receipt functionality

      // Navigate to collection page after successful mint
      if (result.success && result.redirectTo) {
        setTimeout(() => {
          router.push(result.redirectTo!);
          router.refresh();
        }, 3000);
      }
    } catch (error) {
      setResult({
        success: false,
        error: (error as Error).message || "Failed to mint NFT",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Create New NFT</h2>

      {result?.success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your NFT has been minted successfully.
            {result.txHash && (
              <div className="mt-2">
                <p className="font-medium text-sm">Transaction Hash:</p>
                <a
                  href={`https://arbiscan.io/tx/${result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm font-mono break-all"
                >
                  {result.txHash}
                </a>
              </div>
            )}
            <p className="mt-2 text-sm">Redirecting to collection page...</p>
          </AlertDescription>
        </Alert>
      )}

      {result?.error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NFT Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Cosmic Explorer #1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your NFT..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>NFT Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    onChange={onChange}
                    value={value as File}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AttributeFields control={form.control} name="attributes" />

          <div className="pt-4 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !address}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Minting..." : "Mint NFT"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
