
import StoriesBar from "@/components/stories/StoriesBar";
import PostsList from "@/components/posts/PostsList";

const FeedPage = () => {
  return (
    <div className="container max-w-md mx-auto">
      <StoriesBar />
      <PostsList />
    </div>
  );
};

export default FeedPage;
