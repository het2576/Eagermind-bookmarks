import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth";
import { isValidBookmarkUrl } from "@/lib/api/bookmarks";

export async function GET() {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("bookmarks GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title?: string; url?: string; is_public?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const title = body.title?.trim();
  const url = body.url?.trim();
  const is_public = body.is_public;

  if (!title || title.length > 200) {
    return NextResponse.json(
      { error: "Title is required and must be 200 characters or fewer" },
      { status: 400 },
    );
  }

  if (!url || !isValidBookmarkUrl(url)) {
    return NextResponse.json(
      { error: "URL must be a valid http:// or https:// address" },
      { status: 400 },
    );
  }

  if (typeof is_public !== "boolean") {
    return NextResponse.json(
      { error: "is_public must be a boolean" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      title,
      url,
      is_public,
    })
    .select()
    .single();

  if (error) {
    console.error("bookmarks POST error:", error);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
