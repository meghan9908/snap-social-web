
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LogOut, LogIn } from "lucide-react";
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton,
  useUser
} from "@clerk/clerk-react";

const ProfilePage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const { user } = useUser();

  // Check if navigated from a post interaction that requires authentication
  useEffect(() => {
    if (location.state && location.state.requireAuth) {
      toast({
        title: "Authentication Required",
        description: "Please log in to interact with posts"
      });
    }
  }, [location.state, toast]);

  return (
    <div className="container pb-16">
      <SignedIn>
        <div className="flex justify-end mt-4">
          <UserButton afterSignOutUrl="/" />
        </div>
        <ProfileHeader />
        <ProfilePosts />
      </SignedIn>
      
      <SignedOut>
        <div className="container flex flex-col items-center justify-center h-[80vh] text-center">
          <h1 className="text-xl font-bold mb-4">Welcome to Instagram</h1>
          <p className="mb-6">Please log in to see your profile and interact with posts</p>
          
          <div className="flex flex-col space-y-3 w-full max-w-xs">
            <SignInButton>
              <Button 
                className="instagram-gradient text-white"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Log In with Clerk
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default ProfilePage;
