"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? (systemTheme ?? "light") : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    if (isDark) setTheme("light");
    else setTheme("dark");
  };

  return (
    <>
      <Button
        id="theme-toggle"
        title="Toggle theme"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-live="polite"
        onClick={toggleTheme}
        className={`py-6! px-4! rounded-full shadow-lg`}
      >
        <MoonIcon
          className={`${isDark ? "" : "hidden"}`}
          fill={isDark ? "black" : undefined}
        />
        <SunIcon className={`${isDark ? "hidden" : ""}`} />
      </Button>
    </>
  );
}
