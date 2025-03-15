import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, MessageCircle, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-4 md:py- row-start-2">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=24&width=24"
              alt="NFT"
              width={24}
              height={24}
              className="rounded-md bg-amber-200"
            />
            <span className="font-semibold">NFT Creator</span>
          </div> */}
          <div className="font-semibold">NFT Creator</div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span>Powered by Arbitrum</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://github.com/npetridis/nft-deployer-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
