"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MessageCircle, Plus, Heart, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useAuthModal } from "@/context/AuthModalContext";

const tabItems = [
  { label: "Browse", href: "/", icon: Compass },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Create", href: "/create", icon: Plus },
  { label: "Favorite", href: "/favorite", icon: Heart },
  { label: "Profile", href: "/profile", icon: User },
];

const TabBar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { openAuthModal } = useAuthModal();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href !== "/" && !session) {
      e.preventDefault();
      openAuthModal("signin");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/6">
        <div className="flex items-center justify-around px-1 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            const isCreate = item.label === "Create";

            if (isCreate) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 -mt-3"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-200 active:scale-95">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[0.6rem] font-medium text-violet-300 mt-0.5">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors duration-200 active:bg-white/4 min-w-14"
              >
                <div className="relative">
                  <Icon
                    className={`w-5.5 h-5.5 transition-colors duration-200 ${
                      isActive ? "text-violet-400" : "text-white/40"
                    }`}
                  />
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.6)]" />
                  )}
                </div>
                <span
                  className={`text-[0.6rem] font-medium transition-colors duration-200 ${
                    isActive ? "text-violet-300" : "text-white/40"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabBar;
