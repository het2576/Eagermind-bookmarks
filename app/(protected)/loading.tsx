import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedLoading() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl space-y-3">
        <Skeleton className="h-[72px] w-full rounded-xl" />
        <Skeleton className="h-[72px] w-full rounded-xl" />
        <Skeleton className="h-[72px] w-full rounded-xl" />
      </div>
    </main>
  );
}
