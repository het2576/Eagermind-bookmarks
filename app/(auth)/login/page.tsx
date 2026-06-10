import LoginForm from "@/components/auth/LoginForm";
import { Bookmark } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  confirmation_failed:
    "Email confirmation failed. Please sign up again or request a new link.",
  link_expired:
    "That confirmation link has expired. Please sign up again to receive a new email.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const urlError = params.error ? ERROR_MESSAGES[params.error] : null;

  return (
    <main className="flex min-h-[calc(100vh-56px)] animate-fade-in items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6 px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-foreground text-background">
            <Bookmark className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log in to manage your private and public links.
          </p>
        </div>
        <LoginForm urlError={urlError} />
      </div>
    </main>
  );
}
