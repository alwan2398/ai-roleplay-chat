import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats text containing roleplay actions wrapped in asterisks (e.g., *she smiles warmly*).
 * Actions are rendered as grey italic text, while regular dialogue retains standard text color.
 */
export function formatRoleplayText(text: string): React.ReactNode[] {
  if (!text) return [];

  const regex = /(\*[^*]+\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return React.createElement(
        "span",
        { key: index, className: "text-gray-400 italic" },
        part
      );
    }

    return React.createElement(
      "span",
      { key: index, className: "text-white" },
      part
    );
  });
}
