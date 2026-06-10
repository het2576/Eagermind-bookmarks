"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

      toast.success("Check your inbox to confirm your account");
      window.location.href = "/confirm";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {password.length > 0 && password.length < 8 && (
          <p className="text-sm text-destructive">
            Password must be at least 8 characters
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="handle">Handle</Label>
        <Input
          id="handle"
          type="text"
          required
          pattern="[a-z0-9_]{3,30}"
          autoComplete="username"
          value={handle}
          onChange={(event) => setHandle(event.target.value.toLowerCase())}
        />
        <p className="text-sm text-muted-foreground">
          lowercase letters, numbers, and underscores only
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Creating account..." : "Sign up"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
