
import Layout from "@/components/Layout";
import FeedPage from "./FeedPage";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PostsProvider } from "@/context/PostsContext";

const Index = () => {
  const location = useLocation();
  
  return (
    <AuthProvider>
      <PostsProvider>
        <Layout>
          <FeedPage />
        </Layout>
      </PostsProvider>
    </AuthProvider>
  );
};

export default Index;
