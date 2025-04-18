
import { useNavigate } from "react-router-dom";
import { Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/search/SearchInput";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 max-w-screen-lg items-center gap-4">
        <Button 
          variant="ghost" 
          className="px-0 font-semibold text-lg" 
          onClick={() => navigate("/")}
        >
          Instagram
        </Button>
        
        <div className="flex-1 max-w-md">
          <SearchInput />
        </div>
        
        <div className="flex items-center gap-2">
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
    </header>
  );
};

export default TopBar;
