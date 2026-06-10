"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { theme = "system" } = useTheme();

  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      toastOptions={{
        classNames: {
          toast:
            "border-border bg-background text-foreground shadow-lg shadow-black/20",
        },
      }}
    />
  );
}
