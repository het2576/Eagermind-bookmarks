"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const HANDLE_PATTERN = /^[a-z0-9_]{3,30}$/;

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const normalizedHandle = handle.trim().toLowerCase();

    if (!HANDLE_PATTERN.test(normalizedHandle)) {
      setError(
        "Handle must be 3–30 characters: lowercase letters, numbers, and underscores only",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          handle: normalizedHandle,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409 && data.error === "Email already in use") {
          setError("Email already in use");
          return;
        }

        if (response.status === 409 && data.error === "handle already taken") {
          setError("Handle already taken");
          return;
        }

        if (response.status === 429) {
          setError(
            data.error ??
              "Too many signup attempts. Please wait a few minutes and try again.",
          );
          return;
        }

        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.href = "/confirm";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 text-gray-900">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-900">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-900">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {password.length > 0 && password.length < 8 && (
          <p className="mt-1 text-sm text-red-600">Password must be at least 8 characters</p>
        )}
      </div>

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
          lowercase letters, numbers, and underscores only
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
