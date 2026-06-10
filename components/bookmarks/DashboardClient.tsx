"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/lib/types";
import BookmarkList from "@/components/bookmarks/BookmarkList";

type DashboardClientProps = {
  handle: string;
  initialBookmarks: Bookmark[];
};

export default function DashboardClient({
  handle,
  initialBookmarks,
}: DashboardClientProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Bookmarks</h1>
            <Link
              href={`/${handle}`}
              className="mt-1 inline-block text-sm text-blue-600 hover:underline"
            >
              @{handle}
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:self-auto"
          >
            Log out
          </button>
        </header>

        <BookmarkList initialBookmarks={initialBookmarks} />
      </div>
    </main>
  );
}
