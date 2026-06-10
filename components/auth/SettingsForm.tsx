"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const HANDLE_PATTERN = /^[a-z0-9_]{3,30}$/;

type SettingsFormProps = {
  currentHandle?: string | null;
};

export default function SettingsForm({ currentHandle }: SettingsFormProps) {
  const [handle, setHandle] = useState(currentHandle ?? "");
  const [error, setError] = useState<string | null>(null);
  const [successHandle, setSuccessHandle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessHandle(null);

    const normalizedHandle = handle.trim().toLowerCase();

    if (!HANDLE_PATTERN.test(normalizedHandle)) {
      setError(
        "Handle must be 3–30 characters: lowercase letters, numbers, and underscores only",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/create-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ handle: normalizedHandle }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setError("That handle is taken. Try another.");
          return;
        }

        setError(data.error ?? "Failed to save handle");
        return;
      }

      setSuccessHandle(data.handle ?? normalizedHandle);
      setHandle(data.handle ?? normalizedHandle);
      toast.success("Handle saved");
    } catch {
      setError("Failed to save handle");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {currentHandle && (
        <p className="mb-4 text-sm text-muted-foreground">
          Current handle:{" "}
          <span className="font-medium text-foreground">@{currentHandle}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="settings-handle">Handle</Label>
          <Input
            id="settings-handle"
            type="text"
            required
            pattern="[a-z0-9_]{3,30}"
            autoComplete="username"
            value={handle}
            onChange={(event) => setHandle(event.target.value.toLowerCase())}
          />
          <p className="text-sm text-muted-foreground">
            3-30 characters. Lowercase letters, numbers, and underscores only.
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {successHandle && (
          <p className="text-sm text-emerald-500">
            Handle saved! Your profile is live at{" "}
            <Link
              href={`/${successHandle}`}
              className="font-medium text-foreground hover:underline"
            >
              /{successHandle}
            </Link>
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Saving..." : currentHandle ? "Update handle" : "Claim handle"}
        </Button>
      </form>

      {currentHandle && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/dashboard" className="font-medium text-foreground hover:underline">
            Back to dashboard
          </Link>
        </p>
      )}
    </div>
  );
}
