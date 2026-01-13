"use client";

import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeInputProps {
  value: string;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
}

export default function BadgeInput({
  value,
  onChange,
  placeholder,
  className,
}: BadgeInputProps) {
  const [inputValue, setInputValue] = useState("");

  const tags = useMemo(() => {
    return value
      ? value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
  }, [value]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];

      onChange(newTags.join(", "));
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onChange(newTags.join(", "));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-primary/50 shadow-xs transition-[color,box-shadow]",
        className,
      )}
    >
      {tags.map((tag, index) => (
        <Badge key={index} variant={"secondary"} className="">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-muted-foreground hover:text-foreground focus:outline-none"
          >
            <X size={14} />
          </button>
        </Badge>
      ))}

      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        // learn why would you use onBlur
        onBlur={() => inputValue.trim() && addTag(inputValue)}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-30 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 py-0 h-auto bg-transparent placeholder:text-muted-foreground"
      />
    </div>
  );
}
