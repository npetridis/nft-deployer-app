"use client";

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "My Collections", href: "/collections" },
  {
    label: "GitHub",
    href: "https://github.com/npetridis/nft-deployer-app",
    linkProps: { target: "_blank", rel: "noopener noreferrer" },
  },
];

export default function NavItems() {
  const pathname = usePathname();
  const isConnected = true;

  return (
    <nav className="hidden md:flex flex-1 justify-center justify-self-center">
      <ul className="flex gap-8">
        {isConnected &&
          menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "text-md transition-colors hover:text-blue-700 inline-flex items-center",
                  pathname === item.href
                    ? "text-blue-500"
                    : "text-secondary-foreground"
                )}
                {...item.linkProps}
              >
                <span>{item.label}</span>
                {item.linkProps && (
                  <ExternalLink className="h-3.5 w-3.5 ml-1 inline-block" />
                )}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
