
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LogOut, LogIn } from "lucide-react";

const ProfilePage = () => {
  const { isAuthenticated, login, loginWithGoogle, logout } = useAuth();
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

  const handleGoogleLogin = () => {
    loginWithGoogle();
    toast({
      title: "Logged in with Google",
      description: "Welcome! You can now interact with posts"
    });
  };

  const handleRegularLogin = () => {
    login();
    toast({
      title: "Logged in successfully",
      description: "Welcome back! You can now interact with posts"
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-xl font-bold mb-4">Welcome to Instagram</h1>
        <p className="mb-6">Please log in to see your profile and interact with posts</p>
        
        <div className="flex flex-col space-y-3 w-full max-w-xs">
          <Button 
            onClick={handleRegularLogin} 
            className="instagram-gradient text-white"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <Button 
            onClick={handleGoogleLogin} 
            variant="outline"
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          >
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.93 11.5H12v3h4.97a4.5 4.5 0 1 1-4.97-6 4.47 4.47 0 0 1 3.18 1.24L17.07 7.9A7.49 7.49 0 1 0 12 19.5a7.5 7.5 0 0 0 7.5-7.5c0-.17-.01-.33-.02-.5Z" />
            </svg>
            Sign in with Google
          </Button>
        </div>
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
