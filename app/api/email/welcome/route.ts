import { NextResponse } from "next/server";
import { sendSignupEmail } from "@/lib/email/send-signup-email";

export async function POST(request: Request) {
  let body: { email?: string; handle?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim();
  const handle = body.handle?.trim().toLowerCase();
  const password = body.password;

  if (!email || !handle || !password) {
    return NextResponse.json(
      { error: "email, handle, and password are required" },
      { status: 400 },
    );
  }

  const { error } = await sendSignupEmail({ email, handle, password });

  if (error) {
    console.error("welcome email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
