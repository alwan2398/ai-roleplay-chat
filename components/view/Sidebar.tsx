"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MessageCircle, Plus, Heart, User } from "lucide-react";

const menuItems = [
  { label: "Browse", href: "/", icon: Compass },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Create", href: "/create", icon: Plus },
  { label: "Favorite", href: "/favorite", icon: Heart },
  { label: "Profile", href: "/profile", icon: User },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      className="
        fixed top-0 left-0 z-40 h-full
        w-55 pt-17
        bg-[#0e0e16]/95 backdrop-blur-xl
        border-r border-white/6
        hidden md:block
      "
    >
      <nav className="flex flex-col gap-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-[0.9rem] font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-violet-600/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(147,51,234,0.15)]"
                    : "text-white/60 hover:text-white/90 hover:bg-white/4"
                }
              `}
            >
              <Icon
                className={`w-4.5 h-4.5 transition-colors duration-200 ${
                  isActive
                    ? "text-violet-400"
                    : "text-white/40 group-hover:text-white/70"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
