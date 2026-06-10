import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets.
     * Reserved app routes (/login, /signup, /dashboard, /settings, /api, /confirm)
     * are real pages — not public profile handles. Handle collision is also
     * blocked in app/[handle]/page.tsx via RESERVED_HANDLES.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
