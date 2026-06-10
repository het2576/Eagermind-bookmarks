import SettingsForm from "@/components/auth/SettingsForm";
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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold text-gray-900">
          Settings
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          {profile
            ? "Update your public profile handle"
            : "Claim a handle to enable your public profile"}
        </p>
        <SettingsForm currentHandle={profile?.handle ?? null} />
      </div>
    </main>
  );
}
