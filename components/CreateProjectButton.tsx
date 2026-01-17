"use client";

import { Plus } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreateProjectButton() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? (systemTheme ?? "light") : theme;
  const isDark = currentTheme === "dark";

  return (
    <Link
      href={"/projects/new"}
      className={`p-3.5 rounded-full shadow-lg transition-transform hover:scale-110 ${
        isDark
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      <Plus />
    </Link>
  );
}
