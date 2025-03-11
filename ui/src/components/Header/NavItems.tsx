"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "My Collections", href: "/collections" },
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
                  "text-md transition-colors hover:text-blue-700",
                  pathname === item.href
                    ? "text-blue-500"
                    : "text-secondary-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
