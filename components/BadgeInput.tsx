"use client";

import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface BadgeInputProps {
  value: string;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
  suggestions?: string[];
}

// When i add the same thing multiple times it actually adds it first and then it deletes it as it is already in the list(in the array i mean).
// TODO: So i have to add a message saying it is already added add a new one.

export default function BadgeInput({
  value,
  onChange,
  placeholder,
  className,
  suggestions = [],
}: BadgeInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const tags = useMemo(() => {
    return value
      ? value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
  }, [value]);

  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    const available = suggestions.filter((s) => !tags.includes(s));
    if (!inputValue) return available;
    return available.filter((s) =>
      s.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [suggestions, tags, inputValue]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      onChange(newTags.join(", "));
    } else {
      toast.error("Tag is already added.");
    }
    setInputValue("");
    // Keep open if you want to add more, or close. Let's keep input focused.
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
        className
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

      <Popover
        open={
          open &&
          (filteredSuggestions.length > 0 || inputValue.trim().length > 0)
        }
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              // Determine if we need to close. Popover handles outside click.
              // However, we need to handle "add on blur" only if not clicking a suggestion.
              // This is tricky with Popover.
              // If we click suggestion, onBlur fires on input?
              // PopoverContent pointer-events might handles this.
              // Let's defer "add on blur" to allow clicking suggestions?
              // Or simply removing "add on blur" which is often annoying anyway.
              // Or use a timeout.
              // For now, removing onBlur auto-add to prevent race condition with click.
              // If user wants to add, they should press Enter.
              // Or we can check if the blur event related target is the popover.
            }}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-30 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 py-0 h-auto bg-transparent placeholder:text-muted-foreground"
          />
        </PopoverTrigger>
        <PopoverContent
          className="p-1 w-[200px]"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-[200px] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="w-full text-left cursor-pointer px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm focus:bg-accent focus:text-accent-foreground focus:outline-none"
                onClick={() => {
                  addTag(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
            {inputValue &&
              !filteredSuggestions.some(
                (s) => s.toLowerCase() === inputValue.toLowerCase()
              ) && (
                <button
                  type="button"
                  className="w-full text-left cursor-pointer px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-sm focus:bg-accent focus:text-accent-foreground focus:outline-none"
                  onClick={() => addTag(inputValue)}
                >
                  Create "{inputValue}"
                </button>
              )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
