import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const HANDLE_PATTERN = /^[a-z0-9_]{3,30}$/;

async function getAuthenticatedUser(request: Request) {
  const supabase = await createClient();
  const authHeader = request.headers.get("Authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    if (user) {
      return user;
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { handle?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const handle = body.handle?.trim().toLowerCase();

  if (!handle || !HANDLE_PATTERN.test(handle)) {
    return NextResponse.json(
      { error: "Handle must be 3–30 characters: lowercase letters, numbers, and underscores only" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").insert({
    id: user.id,
    handle,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "handle already taken" }, { status: 409 });
    }

    console.error("create-profile insert error:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }

  return NextResponse.json({ handle }, { status: 201 });
}
