import { NextResponse } from "next/server";
import { sendSignupEmail } from "@/lib/email/send-signup-email";
import { findUserByEmail, getProfileByUserId } from "@/lib/auth/users";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return NextResponse.json(
      { error: "No account found for that email. Please sign up first." },
      { status: 404 },
    );
  }

  if (user.email_confirmed_at) {
    return NextResponse.json(
      { error: "This email is already confirmed. You can log in." },
      { status: 409 },
    );
  }

  const profile = await getProfileByUserId(user.id);
  const handle =
    profile?.handle ??
    (typeof user.user_metadata?.handle === "string"
      ? user.user_metadata.handle
      : "user");

  const { error: emailError } = await sendSignupEmail({
    email,
    handle,
    password,
  });

  if (emailError) {
    console.error("resend confirmation error:", emailError);
    return NextResponse.json(
      { error: emailError.message ?? "Failed to send confirmation email." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
