import NavbarClient from "@/components/nav/NavbarClient";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let handle: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("handle")
      .eq("id", user.id)
      .maybeSingle();

    handle = profile?.handle ?? null;
  }

  return (
    <NavbarClient
      isLoggedIn={Boolean(user)}
      handle={handle}
      email={user?.email ?? null}
    />
  );
}
