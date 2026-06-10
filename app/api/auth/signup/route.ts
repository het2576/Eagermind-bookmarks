import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSignupEmail } from "@/lib/email/send-signup-email";
import { deleteUserByEmail, findUserByEmail } from "@/lib/auth/users";

const HANDLE_PATTERN = /^[a-z0-9_]{3,30}$/;

export async function POST(request: Request) {
  let body: { email?: string; password?: string; handle?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;
  const handle = body.handle?.trim().toLowerCase();

  if (!email || !password || !handle) {
    return NextResponse.json(
      { error: "email, password, and handle are required" },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  if (!HANDLE_PATTERN.test(handle)) {
    return NextResponse.json(
      {
        error:
          "Handle must be 3–30 characters: lowercase letters, numbers, and underscores only",
      },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const existingUser = await findUserByEmail(email);

  if (existingUser?.email_confirmed_at) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  if (existingUser && !existingUser.email_confirmed_at) {
    await deleteUserByEmail(email);
  }

  const { data: existingHandle } = await admin
    .from("profiles")
    .select("id")
    .eq("handle", handle)
    .maybeSingle();

  if (existingHandle) {
    return NextResponse.json({ error: "handle already taken" }, { status: 409 });
  }

  const { data: createdUser, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { handle },
    });

  if (createError) {
    const message = createError.message.toLowerCase();

    if (
      message.includes("already registered") ||
      message.includes("already exists") ||
      message.includes("duplicate")
    ) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    if (message.includes("rate limit")) {
      return NextResponse.json(
        {
          error:
            "Too many signup attempts. Please wait a few minutes before trying again.",
        },
        { status: 429 },
      );
    }

    console.error("signup createUser error:", createError);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  const userId = createdUser.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: userId,
    handle,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(userId);

    if (profileError.code === "23505") {
      return NextResponse.json({ error: "handle already taken" }, { status: 409 });
    }

    console.error("signup profile insert error:", profileError);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }

  const { error: emailError } = await sendSignupEmail({ email, handle, password });

  if (emailError) {
    console.error("signup email error:", emailError);

    return NextResponse.json(
      {
        error:
          emailError.message ??
          "Account created but email could not be sent. Use resend confirmation on the next page.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
