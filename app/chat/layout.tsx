"use client";

import { Suspense } from "react";
import AuthModal from "@/components/view/AuthModal";
import AuthQueryTrigger from "@/components/view/AuthQueryTrigger";
import { AuthModalProvider } from "@/context/AuthModalContext";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthModalProvider>
      <Suspense fallback={null}>
        <AuthQueryTrigger />
      </Suspense>
      <div className="w-full h-full min-h-screen bg-[#09050e]">
        {children}
      </div>
      <AuthModal />
    </AuthModalProvider>
  );
}
