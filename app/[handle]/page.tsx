import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isReservedHandle } from "@/lib/constants/reserved-handles";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">@{profile.handle}&apos;s bookmarks</h1>
          <p className="mt-2 text-gray-600">
            {bookmarkCount} public bookmark{bookmarkCount === 1 ? "" : "s"}
          </p>
        </header>

        {bookmarkCount === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center text-gray-500 shadow-sm">
            No public bookmarks yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {publicBookmarks.map((bookmark) => (
              <li
                key={bookmark.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {bookmark.title}
                </a>
                <p className="mt-1 truncate text-sm text-gray-500">{bookmark.url}</p>
              </li>
            ))}
          </ul>
        )}

        {!user && (
          <p className="mt-8 text-center text-sm text-gray-600">
            <Link href="/signup" className="font-medium text-blue-600 hover:underline">
              Sign up to create your own
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
