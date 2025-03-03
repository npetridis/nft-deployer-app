import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CollectionsPage() {
  return (
    <div className="flex justify-center items-center h-[40vh]">
      <Button asChild>
        <Link href="/new-collection">Create new collection</Link>
      </Button>
    </div>
  );
}
