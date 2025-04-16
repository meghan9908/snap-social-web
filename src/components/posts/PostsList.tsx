
import PostCard from "./PostCard";
import { usePosts } from "@/context/PostsContext";

const PostsList = () => {
  const { posts } = usePosts();
  
  return (
    <div className="max-w-md mx-auto pb-16">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsList;
