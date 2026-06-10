"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type NavbarClientProps = {
  isLoggedIn: boolean;
  handle: string | null;
  email: string | null;
};

export default function NavbarClient({
  isLoggedIn,
  handle,
  email,
}: NavbarClientProps) {
  const router = useRouter();
  const initial = (handle ?? email ?? "U").slice(0, 1).toUpperCase();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 h-14 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4">
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="inline-flex items-center gap-2 text-sm font-semibold"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-foreground text-background">
            <Bookmark className="h-3.5 w-3.5" />
          </span>
          Bookmarks
        </Link>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {handle && (
                <Link
                  href={`/${handle}`}
                  className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
                >
                  @{handle}
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{initial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
