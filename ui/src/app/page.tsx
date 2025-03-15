import HowItWorks from "@/components/HowItWorks";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_40px] items-center justify-items-center min-h-screen gap-4 sm:p-6 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 row-start-1 items-center sm:items-start">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Create Your Own NFT Collection in Minutes
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Deploy a fully on-chain NFT collection with just a few clicks.
                No coding required. Mint, manage, and share your digital assets
                with the world on your favorite blockchain.
              </p>
              <Button size="lg">
                <Link href="/create-collection">
                  <div className="flex items-center gap-2">
                    Create Your Collection
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              </Button>
            </div>
            <div className="relative h-[350px] md:h-[450px] rounded-lg overflow-hidden">
              <Image
                src="/arb_arw.png"
                alt="NFT Collection Creator"
                fill
                className="object-cover bg-amber-200"
                priority
              />
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* <NftShowcase /> */}
      </main>
    </div>
  );
}
