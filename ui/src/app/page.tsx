import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
                src="/placeholder.svg?height=450&width=600"
                alt="NFT Collection Creator"
                fill
                className="object-cover bg-amber-200"
                priority
              />
            </div>
          </div>
        </section>

        {/* Featured NFT Showcase */}
        <section className="bg-muted/50 py-16 w-full">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-10">
              Featured Collections
            </h2>
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4">
                            <Image
                              src={`/placeholder.svg?height=300&width=300&text=NFT ${
                                index + 1
                              }`}
                              alt={`Featured NFT ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <h3 className="font-medium">
                              Collection #{index + 1}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              By Creator{index + 1}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        </section>
      </main>
    </div>
  );
}
