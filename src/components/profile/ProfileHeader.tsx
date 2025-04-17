
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@/context/ClerkUserContext";
import UpdateUsernameModal from "./UpdateUsernameModal";
import { Pencil } from "lucide-react";

const ProfileHeader = () => {
  const { user } = useUser();
  const { currentUser } = useAuth();
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

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

      <UpdateUsernameModal 
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
      />
    </div>
  );
};

export default ProfileHeader;
