import { createServerClient } from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const HANDLE_PATTERN = /^[a-z0-9_]{3,30}$/;

async function ensureProfile(userId: string, handle: unknown) {
  if (typeof handle !== "string") {
    return;
  }

  const normalizedHandle = handle.trim().toLowerCase();

  if (!HANDLE_PATTERN.test(normalizedHandle)) {
    return;
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    return;
  }

  const { error } = await admin.from("profiles").insert({
    id: userId,
    handle: normalizedHandle,
  });

  if (error && error.code !== "23505") {
    console.error("confirm profile insert error:", error);
  }
}

async function verifyTokenHash(
  supabase: ReturnType<typeof createServerClient>,
  token_hash: string,
  preferredType: EmailOtpType | null,
) {
  const types: EmailOtpType[] = preferredType
    ? [preferredType, "signup", "email", "invite"]
  : ["signup", "email", "invite"];

  const tried = new Set<EmailOtpType>();

  for (const type of types) {
    if (tried.has(type)) {
      continue;
    }

    tried.add(type);

    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });

    if (!error && data.user) {
      return { data, error: null, type };
    }

    if (error) {
      console.error(`verifyOtp failed for type=${type}:`, error.message);
    }
  }

  return { data: null, error: new Error("Invalid or expired confirmation link"), type: null };
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const successRedirect = NextResponse.redirect(new URL("/dashboard", origin));
  const failureRedirect = NextResponse.redirect(
    new URL("/login?error=confirmation_failed", origin),
  );

  const response = successRedirect;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  if (token_hash) {
    const { data, error } = await verifyTokenHash(supabase, token_hash, type);

    if (error || !data?.user) {
      return failureRedirect;
    }

    await ensureProfile(data.user.id, data.user.user_metadata?.handle);

    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true });

    return response;
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("exchangeCodeForSession error:", error.message);
      return failureRedirect;
    }

    if (data.user) {
      await ensureProfile(data.user.id, data.user.user_metadata?.handle);

      const admin = createAdminClient();
      await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true });
    }

    return response;
  }

  return failureRedirect;
}
