
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (query.startsWith("#")) {
      const hashtagQuery = query.slice(1); // Remove # from search
      const { data: posts } = await supabase
        .from("posts")
        .select(`
          *,
          post_hashtags!inner(
            hashtags!inner(name)
          )
        `)
        .eq('post_hashtags.hashtags.name', hashtagQuery);
      
      console.log("Hashtag search results:", posts);
      // TODO: Implement hashtag results page
    } else {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", `%${query}%`);
      
      console.log("Profile search results:", profiles);
      // TODO: Implement profile results page
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Search profiles or #hashtags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
    </form>
  );
};

export default SearchInput;
