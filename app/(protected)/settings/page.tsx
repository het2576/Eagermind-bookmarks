import { Settings } from "lucide-react";
import SettingsForm from "@/components/auth/SettingsForm";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("handle")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="flex min-h-[calc(100vh-56px)] animate-fade-in items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card">
            <Settings className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile
              ? "Update your public profile handle"
              : "Claim a handle to enable your public profile"}
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <SettingsForm currentHandle={profile?.handle ?? null} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
