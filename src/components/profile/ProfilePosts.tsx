
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Bookmark, TagIcon } from "lucide-react";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/ClerkUserContext";
import { useUser } from "@clerk/clerk-react";

const ProfilePosts = () => {
  const { posts } = usePosts();
  const { user } = useUser();
  const { currentUser } = useAuth();

  // Filter posts by the current user
  const userPosts = posts.filter(post => 
    user && post.username === (user.username || user.firstName || 'user')
  );

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="posts" className="flex items-center justify-center">
          <Grid className="h-4 w-4 mr-2" />
          <span className="sr-only sm:not-sr-only sm:block">Posts</span>
        </TabsTrigger>
        <TabsTrigger value="saved" className="flex items-center justify-center">
          <Bookmark className="h-4 w-4 mr-2" />
          <span className="sr-only sm:not-sr-only sm:block">Saved</span>
        </TabsTrigger>
        <TabsTrigger value="tagged" className="flex items-center justify-center">
          <TagIcon className="h-4 w-4 mr-2" />
          <span className="sr-only sm:not-sr-only sm:block">Tagged</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="mt-0">
        <div className="grid grid-cols-3 gap-1">
          {userPosts.map((post) => (
            <div key={post.id} className="aspect-square">
              <img 
                src={post.imageUrl} 
                alt="Post" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        {userPosts.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No posts yet.
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="saved" className="mt-0">
        <div className="text-center py-10 text-muted-foreground">
          Only you can see what you've saved.
        </div>
      </TabsContent>
      
      <TabsContent value="tagged" className="mt-0">
        <div className="text-center py-10 text-muted-foreground">
          Photos and videos you're tagged in will appear here.
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfilePosts;
