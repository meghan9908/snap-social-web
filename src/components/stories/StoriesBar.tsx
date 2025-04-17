
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/ClerkUserContext";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Story {
  id: string;
  username: string;
  avatar: string;
  viewed: boolean;
}

const stories: Story[] = [
  {
    id: "1",
    username: "your_story",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format",
    viewed: false,
  },
  {
    id: "2",
    username: "jane_smith",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format",
    viewed: true,
  },
  {
    id: "3",
    username: "travel_guy",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format",
    viewed: false,
  },
  {
    id: "4",
    username: "photography",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format",
    viewed: true,
  },
  {
    id: "5",
    username: "food_lover",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format",
    viewed: false,
  },
  {
    id: "6",
    username: "fashion_blog",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format",
    viewed: false,
  },
];

const StoriesBar = () => {
  const { user } = useUser();
  const { currentUser } = useAuth();
  const [userStories, setUserStories] = useState<Story[]>(stories);

  const handleAddStory = () => {
    if (user) {
      toast({
        title: "Story upload coming soon",
        description: "You'll be able to add your stories here soon!",
      });
    }
  };

  const handleViewStory = (storyId: string) => {
    // Mark story as viewed
    setUserStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId ? { ...story, viewed: true } : story
      )
    );
    
    toast({
      title: "Story viewed",
      description: "Full story viewer coming soon!",
    });
  };
  
  return (
    <div className="py-4 mb-1">
      <ScrollArea className="w-full">
        <div className="flex space-x-4 px-4">
          {/* Add story button (only for authenticated users) */}
          {user && (
            <div className="flex flex-col items-center">
              <div className="relative mb-1 cursor-pointer" onClick={handleAddStory}>
                <div className="rounded-full bg-gray-100 p-[2px]">
                  <div className="rounded-full bg-white p-[2px] relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{currentUser?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                      <PlusCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-xs truncate w-16 text-center">Add story</span>
            </div>
          )}

          {/* Display stories */}
          {userStories.map((story) => (
            <div 
              key={story.id} 
              className="flex flex-col items-center"
              onClick={() => handleViewStory(story.id)}
            >
              <div className="relative mb-1 cursor-pointer">
                <div className={`rounded-full ${
                  story.viewed ? "bg-gray-300" : "bg-gradient-to-tr from-yellow-400 to-pink-600"
                } p-[2px]`}>
                  <div className="rounded-full bg-white p-[2px]">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
              <span className="text-xs truncate w-16 text-center">{
                story.id === "1" && user ? "Your story" : story.username
              }</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default StoriesBar;
