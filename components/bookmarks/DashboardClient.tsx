"use client";

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
  return (
    <main className="animate-fade-in bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <BookmarkList handle={handle} initialBookmarks={initialBookmarks} />
      </div>
    </main>
  );
}
