
import { usePosts } from "@/context/PostsContext";

const ExplorePage = () => {
  const { posts } = usePosts();
  
  return (
    <div className="container pb-16">
      <h1 className="sr-only">Explore</h1>
      
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square">
            <img 
              src={post.imageUrl} 
              alt="Explore content" 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
