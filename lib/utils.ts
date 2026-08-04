import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats text containing roleplay actions wrapped in single (*action*) or double (**action**) asterisks.
 * Hides literal asterisk characters in presentation layer and styles inner action text as grey italic,
 * while regular dialogue retains standard text color.
 */
export function formatRoleplayText(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match text wrapped in single (*text*) or double (**text**) asterisks, handling trailing streaming actions
  const regex = /(\*{1,2}[^*]+(?:\*{1,2}|$))/g;
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part, index) => {
      if (part.startsWith("*")) {
        // Strip opening and closing asterisks (* or **) for presentation
        const innerText = part.replace(/^\*+|\*+$/g, "");
        if (!innerText) return null;

        return React.createElement(
          "span",
          { key: index, className: "text-gray-400 italic" },
          innerText
        );
      }

      return React.createElement(
        "span",
        { key: index, className: "text-white" },
        part
      );
    })
    .filter(Boolean) as React.ReactNode[];
}
