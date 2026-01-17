"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  {
    ssr: false,
  },
);

interface MarkdownPreviewProps {
  source: string;
}

export default function MarkdownPreview({ source }: MarkdownPreviewProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse h-20 bg-muted/20 rounded-md w-full" />;
  }

  return (
    <div
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
      style={{ backgroundColor: "transparent" }}
      className="markdown-preview-wrapper"
    >
      <style>{`
        .markdown-preview-wrapper[data-color-mode="light"] .w-md-editor-preview pre,
        .markdown-preview-wrapper[data-color-mode="light"] .w-md-editor-preview code {
           background-color: rgba(0, 0, 0, 0.05) !important;
        }
      `}</style>
      <MDEditor
        source={source}
        style={{
          backgroundColor: "transparent",
          color: "inherit",
          fontSize: "inherit",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}
