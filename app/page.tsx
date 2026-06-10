import { redirect } from "next/navigation";

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

  return (
    <main>
      <h1>Bookmarks</h1>
      <p>Save and share your bookmarks</p>
    </main>
  );
}
