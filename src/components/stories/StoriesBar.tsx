
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Story {
  id: string;
  username: string;
  avatar: string;
}

const stories: Story[] = [
  {
    id: "1",
    username: "your_story",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format",
  },
  {
    id: "2",
    username: "jane_smith",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format",
  },
  {
    id: "3",
    username: "travel_guy",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format",
  },
  {
    id: "4",
    username: "photography",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format",
  },
  {
    id: "5",
    username: "food_lover",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format",
  },
  {
    id: "6",
    username: "fashion_blog",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format",
  },
];

const StoriesBar = () => {
  return (
    <div className="py-4 mb-1">
      <ScrollArea className="w-full">
        <div className="flex space-x-4 px-4">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center">
              <div className="story-ring flex items-center justify-center mb-1">
                <Avatar className="w-16 h-16 border-2 border-background">
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs truncate w-16 text-center">{story.username}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default StoriesBar;
