"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthModal } from "@/context/AuthModalContext";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { openAuthModal } = useAuthModal();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  // Fallback initial from user's name or email
  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="fixed w-full z-50 flex justify-between items-center py-3 px-4 md:px-6 border-b border-white/6 bg-transparent backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold font-secondary bg-linear-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
            Love AI
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-x-3">
        {isPending ? (
          <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
        ) : user ? (
          /* LOGGED IN: Avatar & Dropdown Menu */
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer transition-transform hover:scale-105">
                {user.image && (
                  <AvatarImage src={user.image} alt={user.name || "User"} />
                )}
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-white/50 truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:text-red-300 focus:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2 shrink-0" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          /* NOT LOGGED IN: Log In & Join Free Buttons */
          <>
            <Button
              size={"lg"}
              onClick={() => openAuthModal("signin")}
              className="hidden md:flex py-2.5 px-5 bg-transparent border border-white/20 text-white/90 rounded-full transition-all hover:border-violet-500/50 hover:bg-white/3 hover:shadow-[0_0_15px_rgba(147,51,234,0.15)] cursor-pointer"
            >
              <span className="text-sm font-medium">Log In</span>
            </Button>
            <Button
              size={"lg"}
              onClick={() => openAuthModal("signup")}
              className="py-2.5 px-5 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-full transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] cursor-pointer border-0"
            >
              <span className="text-sm font-medium">Join Free</span>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
