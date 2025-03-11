"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  ImagePlus,
  PlusCircle,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground mx-auto max-w-3xl">
            Follow these simple steps to create and manage your NFT collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Step 1 */}
          <div
            className={`bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
              isVisible ? "animate-fade-in-1" : "opacity-0"
            }`}
          >
            <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Connect Your Wallet</h3>
            <p className="text-gray-600">
              Connect your Ethereum wallet to get started. We support MetaMask,
              Coinbase Wallet, and more.
            </p>
            <div className="mt-6 text-sm text-gray-500 flex items-start">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span>No registration required, just connect and go</span>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:mt-8 ${
              isVisible ? "animate-fade-in-2" : "opacity-0"
            }`}
          >
            <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <PlusCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Create Collection</h3>
            <p className="text-gray-600">
              Deploy your NFT collection smart contract. Define name, symbol,
              and supply limit.
            </p>
            <div className="mt-6 text-sm text-gray-500 flex items-start">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span>One-time gas fee for collection deployment</span>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:mt-16 ${
              isVisible ? "animate-fade-in-3" : "opacity-0"
            }`}
          >
            <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <ImagePlus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Mint NFTs</h3>
            <p className="text-gray-600">
              Upload artwork and create NFTs in your collection. Add metadata,
              attributes, and more.
            </p>
            <div className="mt-6 text-sm text-gray-500 flex items-start">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Free minting with no additional gas fees</span>
            </div>
          </div>
        </div>

        <div
          className={`mt-20 text-center transition-all duration-700 delay-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 px-8 py-6 text-lg h-auto"
            asChild
          >
            <Link href="/create-collection">
              <div className="flex items-center gap-2">
                Start Creating Now
                <ChevronRight className="h-5 w-5 animate-pulse" />
              </div>
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-6 max-w-md mx-auto">
            No coding required. All NFT assets are stored permanently on
            Arweave.
          </p>
        </div>
      </div>
    </section>
  );
}
