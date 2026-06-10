import SignupForm from "@/components/auth/SignupForm";
import { Bookmark } from "lucide-react";

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] animate-fade-in items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6 px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-foreground text-background">
            <Bookmark className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Claim a handle and start building a shareable profile.
          </p>
        </div>
        <SignupForm />
      </div>
    </main>
  );
}
