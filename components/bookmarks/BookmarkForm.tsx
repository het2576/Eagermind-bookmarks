"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Bookmark } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

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
  const [title, setTitle] = useState(bookmark?.title ?? "");
  const [url, setUrl] = useState(bookmark?.url ?? "");
  const [isPublic, setIsPublic] = useState(bookmark?.is_public ?? false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        url: url.trim(),
        is_public: isPublic,
      };
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
      toast.success(isEditing ? "Bookmark updated" : "Bookmark added");
      onClose();
    } catch {
      setError("Failed to save bookmark");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit bookmark" : "New bookmark"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your bookmark details."
                : "Add a link to your collection."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookmark-title">Title</Label>
              <Input
                id="bookmark-title"
                type="text"
                required
                maxLength={200}
                placeholder="My favourite article"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookmark-url">URL</Label>
              <Input
                id="bookmark-url"
                type="url"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">Public</p>
                <p className="text-xs text-muted-foreground">
                  Visible on your @handle page
                </p>
              </div>
              <Toggle
                pressed={isPublic}
                onPressedChange={setIsPublic}
                variant="outline"
                aria-label="Toggle public visibility"
              >
                {isPublic ? "On" : "Off"}
              </Toggle>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save changes" : "Add bookmark"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
