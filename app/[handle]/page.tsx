import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { isReservedHandle } from "@/lib/constants/reserved-handles";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const normalizedHandle = handle.toLowerCase();

  return {
    title: `@${normalizedHandle} — Bookmarks`,
    description: `Public bookmarks shared by @${normalizedHandle}`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { handle } = await params;
  const normalizedHandle = handle.toLowerCase();

  if (isReservedHandle(normalizedHandle)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, handle")
    .ilike("handle", normalizedHandle)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicBookmarks = bookmarks ?? [];
  const bookmarkCount = publicBookmarks.length;
  const initial = profile.handle.slice(0, 1).toUpperCase();

  return (
    <main className="animate-fade-in bg-background px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <header className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 border border-border">
            <AvatarFallback className="text-xl">{initial}</AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            @{profile.handle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {bookmarkCount} public bookmark{bookmarkCount === 1 ? "" : "s"}
          </p>
        </header>

        <Separator className="my-8" />

        {bookmarkCount === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
            No public bookmarks yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {publicBookmarks.map((bookmark) => (
              <li key={bookmark.id}>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-accent/50">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{bookmark.title}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {bookmark.url}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Card>
                </a>
              </li>
            ))}
          </ul>
        )}

        {!user && (
          <div className="mt-8 text-center">
            <Separator className="mb-6" />
            <p className="mb-4 text-sm text-muted-foreground">
              Create your own bookmark profile - it&apos;s free
            </p>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
