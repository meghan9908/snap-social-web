
import { useNavigate } from "react-router-dom";
import { Search, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 max-w-screen-lg items-center">
        <div className="flex flex-1 items-center justify-between">
          <Button 
            variant="ghost" 
            className="px-0 font-semibold text-lg" 
            onClick={() => navigate("/")}
          >
            Instagram
          </Button>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Send className="h-5 w-5" />
              <span className="sr-only">Direct messages</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
