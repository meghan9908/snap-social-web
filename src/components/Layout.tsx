
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./navigation/BottomNav";
import TopBar from "./navigation/TopBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isCreateRoute = location.pathname === "/create";
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!isCreateRoute && <TopBar />}
      <main className="flex-1">
        {children}
      </main>
      {!isCreateRoute && <BottomNav />}
    </div>
  );
};

export default Layout;
