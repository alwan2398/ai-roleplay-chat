import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats text containing roleplay actions wrapped in asterisks (*action* or **action**).
 * Hides literal asterisk characters in presentation layer and styles inner action text as grey italic,
 * while regular dialogue retains standard text color.
 *
 * Streaming-safe split/tokenizer approach:
 * 1. Normalizes double asterisks `**` to single `*`.
 * 2. Splits string by `*`.
 * 3. Even indices (0, 2, 4...) are normal dialogue.
 * 4. Odd indices (1, 3, 5...) are roleplay actions.
 */
export function formatRoleplayText(text: string): React.ReactNode[] {
  if (!text) return [];

  // Normalize double asterisks (**) to single (*)
  const normalized = text.replace(/\*\*/g, "*");

  // Split by asterisk delimiter
  const parts = normalized.split("*");

  return parts
    .map((part, index) => {
      if (!part) return null;

      const isAction = index % 2 === 1;

      if (isAction) {
        return React.createElement(
          "span",
          { key: index, className: "text-gray-400 italic" },
          part
        );
      }

      return React.createElement(
        "span",
        { key: index },
        part
      );
    })
    .filter(Boolean) as React.ReactNode[];
}
