"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Bookmark } from "@/lib/types";
import Modal from "@/components/ui/Modal";

type BookmarkFormProps = {
  open: boolean;
  onClose: () => void;
  bookmark?: Bookmark | null;
  onSuccess: (bookmark: Bookmark) => void;
};

export default function BookmarkForm({
  open,
  onClose,
  bookmark,
  onSuccess,
}: BookmarkFormProps) {
  const isEditing = Boolean(bookmark);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(bookmark?.title ?? "");
      setUrl(bookmark?.url ?? "");
      setIsPublic(bookmark?.is_public ?? false);
      setError(null);
    }
  }, [open, bookmark]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = { title: title.trim(), url: url.trim(), is_public: isPublic };
      const response = await fetch(
        isEditing ? `/api/bookmarks/${bookmark!.id}` : "/api/bookmarks",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Failed to save bookmark");
        return;
      }

      onSuccess(data as Bookmark);
      onClose();
    } catch {
      setError("Failed to save bookmark");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit bookmark" : "New bookmark"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-900">
        <div>
          <label htmlFor="bookmark-title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input
            id="bookmark-title"
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="bookmark-url" className="mb-1 block text-sm font-medium">
            URL
          </label>
          <input
            id="bookmark-url"
            type="url"
            required
            placeholder="https://"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Public — anyone can see this
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : isEditing ? "Save changes" : "Add bookmark"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
