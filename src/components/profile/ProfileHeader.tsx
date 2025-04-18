
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@/context/ClerkUserContext";
import UpdateUsernameModal from "./UpdateUsernameModal";
import { Pencil, UserPlus, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ProfileHeader = () => {
  const { user } = useUser();
  const { currentUser } = useAuth();
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) return;

      const currentUserData = await supabase.auth.getSession();
      const currentUserId = currentUserData?.data?.session?.user?.id;

      if (!currentUserId) return;

      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', user.id)
        .single();

      if (error) {
        console.error('Error checking follow status:', error);
        return;
      }

      setIsFollowing(!!data);
    };

    checkFollowStatus();
  }, [user]);

  const handleFollow = async () => {
    if (!user) return;

    const currentUserData = await supabase.auth.getSession();
    const currentUserId = currentUserData?.data?.session?.user?.id;

    if (!currentUserId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to follow this user",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', user.id);
        
        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You have unfollowed ${user.username || user.firstName}`,
        });
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: user.id
          });
        
        setIsFollowing(true);
        toast({
          title: "Followed",
          description: `You are now following ${user.username || user.firstName}`,
        });
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex items-center">
        <Avatar className="w-20 h-20 mr-4">
          <AvatarImage src={user.imageUrl} alt={currentUser?.username || user.firstName || ""} />
          <AvatarFallback>{user.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold mr-2">
                {currentUser?.username || "username"}
              </h1>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => setIsUsernameModalOpen(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="font-medium"
                onClick={handleFollow}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-2 text-sm">
            <div>
              <span className="font-semibold">
                {currentUser?.postsCount || 0}
              </span> posts
            </div>
            <div>
              <span className="font-semibold">
                {currentUser?.followers || 0}
              </span> followers
            </div>
            <div>
              <span className="font-semibold">
                {currentUser?.following || 0}
              </span> following
            </div>
          </div>
          
          <div className="text-sm">
            <div className="font-semibold">{user.fullName}</div>
          </div>
        </div>
      </div>

      <UpdateUsernameModal 
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
      />
    </div>
  );
};

export default ProfileHeader;

