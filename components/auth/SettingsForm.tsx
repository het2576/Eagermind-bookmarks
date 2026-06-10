"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

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
    } catch {
      setError("Failed to save handle");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-gray-900">
      {currentHandle && (
        <p className="mb-4 text-sm text-gray-600">
          Current handle:{" "}
          <span className="font-medium text-gray-900">@{currentHandle}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="handle" className="mb-1 block text-sm font-medium text-gray-900">
            Handle
          </label>
          <input
            id="handle"
            type="text"
            required
            pattern="[a-z0-9_]{3,30}"
            autoComplete="username"
            value={handle}
            onChange={(event) => setHandle(event.target.value.toLowerCase())}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            3–30 characters. Lowercase letters, numbers, and underscores only.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {successHandle && (
          <p className="text-sm text-green-700">
            Handle saved! Your profile is live at{" "}
            <Link
              href={`/${successHandle}`}
              className="font-medium text-blue-600 hover:underline"
            >
              /{successHandle}
            </Link>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : currentHandle ? "Update handle" : "Claim handle"}
        </button>
      </form>

      {currentHandle && (
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/dashboard" className="font-medium text-blue-600 hover:underline">
            Back to dashboard
          </Link>
        </p>
      )}
    </div>
  );
}
