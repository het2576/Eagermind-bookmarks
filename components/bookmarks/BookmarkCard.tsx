"use client";

import { useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Bookmark } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDelete() {
    onDelete(bookmark.id);
    setConfirmOpen(false);
  }

  return (
    <>
      <Card className="group p-4 transition-all duration-200 hover:border-foreground/20">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-medium transition-colors hover:text-muted-foreground"
              >
                {bookmark.title}
              </a>
              <Badge
                variant="outline"
                className={
                  bookmark.is_public
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                    : "border-zinc-500/20 bg-zinc-500/10 text-zinc-500"
                }
              >
                {bookmark.is_public ? "Public" : "Private"}
              </Badge>
            </div>
            <div className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
              <ExternalLink className="h-3 w-3 shrink-0" />
              <p className="truncate">{truncateUrl(bookmark.url, 68)}</p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(bookmark.created_at))}
              </p>
              <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(bookmark)}
                  aria-label="Edit bookmark"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setConfirmOpen(true)}
                  className="hover:text-destructive"
                  aria-label="Delete bookmark"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete bookmark?</DialogTitle>
            <DialogDescription>
              This removes &quot;{bookmark.title}&quot; from your collection.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
