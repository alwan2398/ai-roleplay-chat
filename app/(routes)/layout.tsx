"use client";

import Navbar from "@/components/view/Navbar";
import Sidebar from "@/components/view/Sidebar";
import TabBar from "@/components/view/TabBar";
import AuthModal from "@/components/view/AuthModal";
import { AuthModalProvider } from "@/context/AuthModalContext";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthModalProvider>
      <div className="h-full min-h-screen bg-glow">
        <Navbar />
        <Sidebar />
        <main className="md:pl-55 pt-17 pb-20 md:pb-0">
          <div className="p-4 md:p-6">{children}</div>
        </main>
        <TabBar />
        <AuthModal />
      </div>
    </AuthModalProvider>
  );
};

export default HomeLayout;

