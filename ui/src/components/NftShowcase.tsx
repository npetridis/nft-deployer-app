import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function NftShowcase() {
  return (
    <section className="bg-muted/50 py-16 w-full">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-10">
          Featured Collections
        </h2>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
                        <h3 className="font-medium">Collection #{index + 1}</h3>
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
  );
}
