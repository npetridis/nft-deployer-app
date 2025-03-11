import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center my-12">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <p>Loading wallet information...</p>
    </div>
  );
}
