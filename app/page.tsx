import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Globe, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_code?: string }>;
}) {
  const params = await searchParams;

  if (params.error_code === "otp_expired") {
    redirect("/login?error=link_expired");
  }

  if (params.error === "access_denied") {
    redirect("/login?error=confirmation_failed");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const features = [
    {
      title: "Save anything",
      description: "Add links with a title and URL in seconds.",
      icon: Bookmark,
    },
    {
      title: "Share publicly",
      description: "Toggle bookmarks public. They appear on your @handle page.",
      icon: Globe,
    },
    {
      title: "Stay private",
      description: "Keep personal links hidden. Only you can see them.",
      icon: Lock,
    },
  ];

  return (
    <main className="animate-fade-in bg-background px-4">
      <section className="relative mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl flex-col items-center justify-center overflow-hidden py-20 text-center">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <Badge
          variant="outline"
          className="mb-6 rounded-full border-foreground/15 bg-background px-3 py-1 text-muted-foreground shadow-sm"
        >
          Open Beta
        </Badge>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Your links, organized. Your profile, shareable.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
          Save bookmarks privately. Share the ones that matter. One link to your
          public profile.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/signup">Get started free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/het257">See an example</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 py-16 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card
              key={feature.title}
              className="rounded-xl border-border bg-card transition-colors hover:border-foreground/20"
            >
              <CardContent className="p-6">
                <Icon className="mb-5 h-5 w-5 text-foreground" />
                <h2 className="font-medium">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-5 border-t border-border py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Ready to start?</h2>
        <Button asChild>
          <Link href="/signup">Create your account</Link>
        </Button>
      </section>
    </main>
  );
}
