
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleTabChange = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background/95 backdrop-blur">
      <div className="container flex h-full items-center justify-around max-w-screen-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleTabChange("/")}
          className={cn(
            "flex flex-col items-center justify-center h-full rounded-none",
            activeTab === "/" && "text-foreground"
          )}
        >
          <Home className={cn("h-6 w-6", activeTab !== "/" && "text-muted-foreground")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleTabChange("/explore")}
          className={cn(
            "flex flex-col items-center justify-center h-full rounded-none",
            activeTab === "/explore" && "text-foreground"
          )}
        >
          <Search className={cn("h-6 w-6", activeTab !== "/explore" && "text-muted-foreground")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleTabChange("/create")}
          className={cn(
            "flex flex-col items-center justify-center h-full rounded-none",
            activeTab === "/create" && "text-foreground"
          )}
        >
          <PlusSquare className={cn("h-6 w-6", activeTab !== "/create" && "text-muted-foreground")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleTabChange("/activity")}
          className={cn(
            "flex flex-col items-center justify-center h-full rounded-none",
            activeTab === "/activity" && "text-foreground"
          )}
        >
          <Heart className={cn("h-6 w-6", activeTab !== "/activity" && "text-muted-foreground")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleTabChange("/profile")}
          className={cn(
            "flex flex-col items-center justify-center h-full rounded-none",
            activeTab === "/profile" && "text-foreground"
          )}
        >
          <User className={cn("h-6 w-6", activeTab !== "/profile" && "text-muted-foreground")} />
        </Button>
      </div>
    </div>
  );
};

export default BottomNav;
