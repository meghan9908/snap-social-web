
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

const ProfilePage = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Check if navigated from a post interaction that requires authentication
  useEffect(() => {
    if (location.state && location.state.requireAuth) {
      toast({
        title: "Authentication Required",
        description: "Please log in to interact with posts"
      });
    }
  }, [location.state, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-xl font-bold mb-4">Welcome to Instagram</h1>
        <p className="mb-6">Please log in to see your profile and interact with posts</p>
        <Button 
          onClick={() => {
            login();
            toast({
              title: "Logged in successfully",
              description: "Welcome back! You can now interact with posts"
            });
          }} 
          className="instagram-gradient text-white"
        >
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="container pb-16">
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          size="sm" 
          className="mb-2"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <ProfileHeader />
      <ProfilePosts />
    </div>
  );
};

export default ProfilePage;
