"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount, useSwitchChain } from "wagmi";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDeployFactoryNftCollection } from "@/lib/hooks/useDeployFactoryNftCollection";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { arbitrum } from "viem/chains";

const createCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required."),
  ticker: z
    .string()
    .min(1, "Ticker is required.")
    .max(8, "Ticker must be 8 characters or less.")
    .refine((value) => /^[A-Z0-9]+$/.test(value), {
      message: "Ticker must contain only uppercase letters and numbers",
    }),
  maxSupply: z
    .string()
    .refine((val) => !val || !isNaN(parseInt(val)), "Must be a number")
    .transform((val) => (val ? parseInt(val) : 100))
    .optional(),
  description: z.string().optional(),
});

type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;

export default function CreateCollectionPage() {
  const router = useRouter();
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync, isPending: isSwitchingNetwork } = useSwitchChain();

  const isArbitrum = chain?.id === arbitrum.id;

  const {
    deployNftCollection,
    isLoading: isDeploying,
    error: deploymentError,
    result,
  } = useDeployFactoryNftCollection();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionSchema),
  });

  const handleSwitchNetwork = async () => {
    if (!switchChainAsync) {
      toast.error("Network switching not supported", {
        description:
          "Please manually change your network to Arbitrum in your wallet.",
      });
    }

    try {
      await switchChainAsync({ chainId: arbitrum.id });
    } catch {
      toast.error("Failed to switch network", {
        description:
          "Please manually change your network to Arbitrum in your wallet.",
      });
    }
  };

  const onSubmit = async (formData: CreateCollectionFormValues) => {
    if (!address) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to deploy a collection.",
      });
      return;
    }

    try {
      await deployNftCollection({
        name: formData.name,
        symbol: formData.ticker,
        baseURI: "https://arweave.net/",
        maxSupply: 100, // default maxSupply
        ownerAddress: address,
      });
    } catch {
      toast.error("Transaction failed.", {
        description: "There was an error deploying your NFT collection.",
      });
    }
  };

  useEffect(() => {
    if (result) {
      console.log("Transaction result:", result);
      toast.success("Transaction was successfull", {
        description: `The tx hash is ${result.hash}.`,
        duration: 5000,
      });

      router.push("/collection/" + result?.contractAddress);
      return;
    }
  }, [result]);

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Step Progress Indicator */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create NFT Collection</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Provide basic information for your new NFT collection.
        </p>
      </div>

      {!isConnected && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to create a collection.
          </AlertDescription>
        </Alert>
      )}

      {deploymentError && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Deployment Failed</AlertTitle>
          <AlertDescription>
            {deploymentError || "There was an error deploying your collection"}
          </AlertDescription>
        </Alert>
      )}

      {isConnected && !isArbitrum && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Wrong Network</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <p>This application only works on the Arbitrum network.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchNetwork}
              disabled={isSwitchingNetwork}
              className="w-fit flex items-center gap-2"
            >
              {isSwitchingNetwork ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Switching...
                </>
              ) : (
                <span>Switch to Arbitrum</span>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <div className="flex flex-col space-y-2">
          <Label htmlFor="ticker">Collection Ticker</Label>
          <Input id="ticker" placeholder="e.g. MAC" {...register("ticker")} />
          {errors.ticker && (
            <p className="text-red-500 text-sm">{errors.ticker.message}</p>
          )}
        </div>
        <div className="pt-4">
          <Button
            type="submit"
            variant={"default"}
            disabled={isDeploying || !isArbitrum}
          >
            {isDeploying ? (
              <>
                <Loader2 className="mr-1 animate-spin h-4 w-4" />
                Deploying...
              </>
            ) : (
              "Pay fee and Deploy Collection"
            )}
          </Button>
        </div>
        {result?.contractAddress && result?.hash && (
          <div className="flex flex-col space-y-2">
            <div>tx hash: {result?.hash}</div>
            <div>contract: {result?.contractAddress}</div>
          </div>
        )}
      </form>
    </div>
  );
}
