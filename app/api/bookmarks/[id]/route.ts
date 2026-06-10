import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth";
import { isValidBookmarkUrl } from "@/lib/api/bookmarks";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: { title?: string; url?: string; is_public?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const updates: { title?: string; url?: string; is_public?: boolean } = {};

  if (body.title !== undefined) {
    const title = body.title.trim();

    if (!title || title.length > 200) {
      return NextResponse.json(
        { error: "Title must be 1–200 characters" },
        { status: 400 },
      );
    }

    updates.title = title;
  }

  if (body.url !== undefined) {
    const url = body.url.trim();

    if (!url || !isValidBookmarkUrl(url)) {
      return NextResponse.json(
        { error: "URL must be a valid http:// or https:// address" },
        { status: 400 },
      );
    }

    updates.url = url;
  }

  if (body.is_public !== undefined) {
    if (typeof body.is_public !== "boolean") {
      return NextResponse.json(
        { error: "is_public must be a boolean" },
        { status: 400 },
      );
    }

    updates.is_public = body.is_public;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "At least one field is required to update" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("bookmarks PUT error:", error);
    return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) {
    console.error("bookmarks DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }

  if (!data?.length) {
    return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
