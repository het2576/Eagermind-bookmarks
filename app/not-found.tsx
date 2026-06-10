import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] animate-fade-in items-center justify-center bg-background px-4 text-center">
      <div>
        <p className="text-8xl font-black text-muted-foreground/20">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
