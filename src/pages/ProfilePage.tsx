
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-xl font-bold mb-4">Welcome to Instagram</h1>
        <p className="mb-6">Please log in to see your profile</p>
        <Button onClick={login} className="instagram-gradient text-white">
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="container pb-16">
      <ProfileHeader />
      <ProfilePosts />
    </div>
  );
};

export default ProfilePage;
