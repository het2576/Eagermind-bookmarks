"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function ResendConfirmationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Failed to resend confirmation email.");
        return;
      }

      setMessage("Confirmation email sent. Check your inbox and click the button.");
      toast.success("Confirmation email sent");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 text-left">
      <Separator className="mb-6" />
      <h2 className="mb-2 text-sm font-semibold">
        Didn&apos;t get the email?
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Enter the same email and password you used to sign up. We&apos;ll send a
        new confirmation link to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="password"
          required
          minLength={8}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button
          type="submit"
          disabled={loading}
          variant="outline"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Sending..." : "Resend confirmation email"}
        </Button>
      </form>

      {message && <p className="mt-3 text-sm text-emerald-500">{message}</p>}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}
