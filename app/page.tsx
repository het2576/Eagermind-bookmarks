import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_code?: string }>;
}) {
  const params = await searchParams;

  if (params.error_code === "otp_expired") {
    redirect("/login?error=link_expired");
  }

  if (params.error === "access_denied") {
    redirect("/login?error=confirmation_failed");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-gray-900">
      <div className="w-full max-w-lg text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Bookmarks</h1>
        <p className="mb-8 text-lg text-gray-600">
          Save and share your bookmarks
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
