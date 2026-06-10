import Link from "next/link";
import { MailCheck } from "lucide-react";
import ResendConfirmationForm from "@/components/auth/ResendConfirmationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ConfirmPage() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] animate-fade-in items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card">
            <MailCheck className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
          Check your email - we sent you a confirmation link. Click it to activate
          your account.
          </p>

          <ResendConfirmationForm />

          <Button asChild variant="link" className="mt-4">
            <Link href="/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
