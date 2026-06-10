"use client";

import { useState } from "react";
import type { Bookmark } from "@/lib/types";
import BookmarkCard from "@/components/bookmarks/BookmarkCard";
import BookmarkForm from "@/components/bookmarks/BookmarkForm";

type BookmarkListProps = {
  initialBookmarks: Bookmark[];
};

export default function BookmarkList({ initialBookmarks }: BookmarkListProps) {
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
      }
    } catch {
      setBookmarks(previous);
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Bookmark
        </button>
      </div>

      {bookmarks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center text-gray-500 shadow-sm">
          No bookmarks yet. Add your first one.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
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

      <BookmarkForm
        open={formOpen}
        onClose={closeForm}
        bookmark={editingBookmark}
        onSuccess={handleSuccess}
      />
    </>
  );
}
