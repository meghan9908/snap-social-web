
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";

const ProfileHeader = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex items-center">
        <Avatar className="w-20 h-20 mr-4">
          <AvatarImage src={user.imageUrl} alt={user.username || user.firstName || ""} />
          <AvatarFallback>{user.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold">{user.username || user.firstName}</h1>
            <div className="space-x-2">
              <Button variant="outline" size="sm" className="font-medium">Edit Profile</Button>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-2 text-sm">
            <div><span className="font-semibold">0</span> posts</div>
            <div><span className="font-semibold">0</span> followers</div>
            <div><span className="font-semibold">0</span> following</div>
          </div>
          
          <div className="text-sm">
            <div className="font-semibold">{user.fullName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
