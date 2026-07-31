import Navbar from "@/components/view/Navbar";
import Sidebar from "@/components/view/Sidebar";
import TabBar from "@/components/view/TabBar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full min-h-screen bg-glow">
      <Navbar />
      <Sidebar />
      <main className="md:pl-55 pt-17 pb-20 md:pb-0">
        <div className="p-4 md:p-6">{children}</div>
      </main>
      <TabBar />
    </div>
  );
};

export default HomeLayout;

