"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark as BookmarkIcon, ExternalLink, Plus } from "lucide-react";
import type { Bookmark } from "@/lib/types";
import BookmarkCard from "@/components/bookmarks/BookmarkCard";
import BookmarkForm from "@/components/bookmarks/BookmarkForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type BookmarkListProps = {
  handle: string;
  initialBookmarks: Bookmark[];
};

export default function BookmarkList({
  handle,
  initialBookmarks,
}: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  function openCreateForm() {
    setEditingBookmark(null);
    setFormOpen(true);
  }

  function openEditForm(bookmark: Bookmark) {
    setEditingBookmark(bookmark);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingBookmark(null);
  }

  function handleSuccess(bookmark: Bookmark) {
    setBookmarks((current) => {
      const existingIndex = current.findIndex((item) => item.id === bookmark.id);

      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = bookmark;
        return updated;
      }

      return [bookmark, ...current];
    });
  }

  async function handleDelete(id: string) {
    const previous = bookmarks;
    setBookmarks((current) => current.filter((item) => item.id !== id));

    try {
      const response = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });

      if (!response.ok) {
        setBookmarks(previous);
        toast.error("Failed to delete bookmark");
        return;
      }

      toast.success("Bookmark deleted");
    } catch {
      setBookmarks(previous);
      toast.error("Failed to delete bookmark");
    }
  }

  return (
    <>
      <header className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">My Bookmarks</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/${handle}`} target="_blank" rel="noopener noreferrer">
                @{handle}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button type="button" onClick={openCreateForm}>
              <Plus className="h-4 w-4" />
              Add bookmark
            </Button>
          </div>
        </div>
        <Separator className="mt-6" />
      </header>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookmarkIcon className="mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">No bookmarks yet</h3>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Add your first bookmark to get started.
          </p>
          <Button onClick={openCreateForm}>Add bookmark</Button>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <BookmarkCard
                bookmark={bookmark}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}

      {formOpen && (
        <BookmarkForm
          key={editingBookmark?.id ?? "new"}
          open={formOpen}
          onClose={closeForm}
          bookmark={editingBookmark}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
