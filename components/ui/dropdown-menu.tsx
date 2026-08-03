"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ open: false, setOpen: () => {} });

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) {
  const { open, setOpen } = React.useContext(DropdownMenuContext);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={cn("outline-none cursor-pointer inline-flex items-center", className)}
    >
      {children}
    </div>
  );
}

export function DropdownMenuContent({
  children,
  className,
  align = "end",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
}) {
  const { open } = React.useContext(DropdownMenuContext);

  if (!open) return null;

  const alignmentClass =
    align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-48 rounded-xl border border-white/10 bg-[#16161e] p-1.5 text-white shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95",
        alignmentClass,
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { setOpen } = React.useContext(DropdownMenuContext);

  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={() => {
        if (disabled) return;
        onClick?.();
        setOpen(false);
      }}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-white/10 focus:bg-white/10 text-white/90 hover:text-white",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-white/10", className)} />;
}
