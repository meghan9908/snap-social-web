import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/ClerkUserContext";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle, Image, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id: string;
  username: string;
  avatar: string;
  viewed: boolean;
  content?: string;
}

const StoriesBar = () => {
  const { user } = useUser();
  const { currentUser } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [isViewStoryOpen, setIsViewStoryOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [storyUrl, setStoryUrl] = useState("");
  const [storyPreview, setStoryPreview] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data: storiesData, error } = await supabase
        .from('stories')
        .select(`
          id,
          image_url,
          profiles:user_id (username, avatar_url)
        `)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: viewedData } = await supabase
        .from('viewed_stories')
        .select('story_id')
        .eq('user_id', supabase.auth.getUser()?.data?.user?.id || '');

      const formattedStories = storiesData.map(story => ({
        id: story.id,
        username: story.profiles?.username || 'unknown',
        avatar: story.profiles?.avatar_url || '',
        viewed: viewedData?.some(view => view.story_id === story.id) || false,
        content: story.image_url
      }));

      setStories(formattedStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stories. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleAddStory = () => {
    if (user) {
      setIsAddStoryOpen(true);
    }
  };

  const closeAddStory = () => {
    setIsAddStoryOpen(false);
    setStoryUrl("");
    setStoryPreview("");
  };

  const handleStoryUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoryUrl(e.target.value);
    // For demo purposes, we'll set the preview to the URL directly
    // In a real app, you'd validate that this is an image URL
    setStoryPreview(e.target.value);
  };

  const handleSubmitStory = () => {
    if (!storyUrl) {
      toast({
        title: "Missing image",
        description: "Please provide a story image URL",
        variant: "destructive"
      });
      return;
    }

    // Create a new story and add it to the beginning of the array
    const newStory = {
      id: Date.now().toString(),
      username: currentUser?.username || "your_story",
      avatar: user?.imageUrl || "",
      viewed: false,
      content: storyUrl
    };

    // Add the new story and update the first story to be the user's story
    setStories([newStory, ...stories.filter(story => story.id !== "1")]);
    
    toast({
      title: "Story added",
      description: "Your story has been added successfully!",
    });
    
    closeAddStory();
  };

  const handleViewStory = (story: Story) => {
    setCurrentStory(story);
    setIsViewStoryOpen(true);
    
    // Mark story as viewed
    setStories(prevStories => 
      prevStories.map(s => 
        s.id === story.id ? { ...s, viewed: true } : s
      )
    );
  };

  const closeViewStory = () => {
    setIsViewStoryOpen(false);
    setCurrentStory(null);
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
          {stories.map((story) => (
            <div 
              key={story.id} 
              className="flex flex-col items-center"
              onClick={() => handleViewStory(story)}
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

      {/* Add Story Dialog */}
      <Dialog open={isAddStoryOpen} onOpenChange={closeAddStory}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a new story</DialogTitle>
            <DialogDescription>
              Add an image URL to create your story
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <label htmlFor="storyUrl" className="sr-only">Image URL</label>
                <input
                  id="storyUrl"
                  placeholder="Paste image URL here..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={storyUrl}
                  onChange={handleStoryUrlChange}
                />
              </div>
            </div>
            
            {storyPreview && (
              <div className="relative aspect-square w-full overflow-hidden rounded-md">
                <img 
                  src={storyPreview} 
                  alt="Story preview" 
                  className="object-cover w-full h-full"
                  onError={() => {
                    setStoryPreview("");
                    toast({
                      title: "Invalid image",
                      description: "Please provide a valid image URL",
                      variant: "destructive"
                    });
                  }}
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={closeAddStory}>
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={handleSubmitStory}
              disabled={!storyPreview}
            >
              Add Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Story Dialog */}
      <Dialog open={isViewStoryOpen} onOpenChange={closeViewStory}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden max-h-[80vh]">
          <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
            {currentStory && currentStory.content && (
              <img 
                src={currentStory.content} 
                alt={`${currentStory.username}'s story`} 
                className="object-cover w-full h-full"
              />
            )}
            <div className="absolute top-4 left-4 right-4 flex items-center">
              <Avatar className="w-8 h-8 mr-2 border-2 border-white">
                <AvatarImage src={currentStory?.avatar} />
                <AvatarFallback>{currentStory?.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-white font-semibold text-sm">
                {currentStory?.username}
              </span>
              <button 
                className="text-white ml-auto rounded-full bg-black/20 p-1"
                onClick={closeViewStory}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoriesBar;
