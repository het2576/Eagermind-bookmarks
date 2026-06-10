"use client";

import type { Bookmark } from "@/lib/types";

type BookmarkCardProps = {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
};

function truncateUrl(url: string, maxLength = 50) {
  if (url.length <= maxLength) {
    return url;
  }

  return `${url.slice(0, maxLength)}…`;
}

export default function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
}: BookmarkCardProps) {
  function handleDelete() {
    if (!confirm("Delete this bookmark?")) {
      return;
    }

    onDelete(bookmark.id);
  }

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate font-medium text-blue-600 hover:underline"
          >
            {bookmark.title}
          </a>
          <p className="mt-1 truncate text-sm text-gray-500">
            {truncateUrl(bookmark.url)}
          </p>
          <span
            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              bookmark.is_public
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {bookmark.is_public ? "Public" : "Private"}
          </span>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEdit(bookmark)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
