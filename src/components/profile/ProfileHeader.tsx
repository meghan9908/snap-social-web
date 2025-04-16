
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const ProfileHeader = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex items-center">
        <Avatar className="w-20 h-20 mr-4">
          <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold">{currentUser.username}</h1>
            <div className="space-x-2">
              <Button variant="outline" size="sm" className="font-medium">Edit Profile</Button>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-2 text-sm">
            <div><span className="font-semibold">{currentUser.postsCount}</span> posts</div>
            <div><span className="font-semibold">{currentUser.followers.toLocaleString()}</span> followers</div>
            <div><span className="font-semibold">{currentUser.following.toLocaleString()}</span> following</div>
          </div>
          
          <div className="text-sm">
            <div className="font-semibold">{currentUser.name}</div>
            {currentUser.bio && <div>{currentUser.bio}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
