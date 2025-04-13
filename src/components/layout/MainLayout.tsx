
import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
