import Link from "next/link";
// import UserAvatar from "./UserAvatar";
// import { auth } from "@/lib/session/auth";
// import NavItems from "./NavItems";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NavItems from "./NavItems";

export async function Header() {
  // const session = await auth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid grid-cols-3 h-16 items-center justify-self-center">
        <Link href={"/"}>
          <div className="flex items-center gap-2 mr-4">
            <div className="h-5 w-5 bg-black" />
            <span className="font-medium">PostBook</span>
          </div>
        </Link>

        <NavItems />

        <div className="justify-self-end">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
