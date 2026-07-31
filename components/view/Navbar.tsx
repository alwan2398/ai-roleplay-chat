"use client";

import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
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
        <Button
          size={"lg"}
          className="hidden md:flex py-2.5 px-5 bg-transparent border border-white/20 text-white/90 rounded-full transition-all hover:border-violet-500/50 hover:bg-white/3 hover:shadow-[0_0_15px_rgba(147,51,234,0.15)] cursor-pointer"
        >
          <span className="text-sm font-medium">Log In</span>
        </Button>
        <Button
          size={"lg"}
          className="py-2.5 px-5 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-full transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] cursor-pointer border-0"
        >
          <span className="text-sm font-medium">Join Free</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
