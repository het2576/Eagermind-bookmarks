// Root layout

import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Save private links and publish a shareable bookmark profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <Navbar />
          <div className="flex min-h-[calc(100vh-56px)] flex-col">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
