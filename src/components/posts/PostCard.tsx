import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePosts, Post } from "@/context/PostsContext";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/ClerkUserContext";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const { likePost, addComment } = usePosts();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on posts",
      });
      navigate('/profile');
      return;
    }
    
    if (comment.trim()) {
      addComment(post.id, comment);
      setComment("");
      toast({
        title: "Comment added",
        description: "Your comment was added to the post!",
      });
    }
  };

  const handleLikePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
      });
      navigate('/profile');
      return;
    }
    
    likePost(post.id);
  };

  const handleSharePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to share posts",
      });
      navigate('/profile');
      return;
    }
    
    toast({
      title: "Share feature",
      description: "This feature is coming soon!",
    });
  };

  const handleSavePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save posts",
      });
      navigate('/profile');
      return;
    }
    
    toast({
      title: "Save feature",
      description: "This feature is coming soon!",
    });
  };

  const displayedComments = showAllComments 
    ? post.comments 
    : post.comments.slice(0, 2);

  return (
    <div className="bg-background border rounded-md mb-4 animate-fade-in">
      {/* Post header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.userAvatar} alt={post.username} />
            <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{post.username}</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Post image */}
      <img 
        src={post.imageUrl}
        alt="Post content"
        className="w-full aspect-square object-cover"
      />

      {/* Post actions */}
      <div className="p-3">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={handleLikePost}
            >
              <Heart 
                className={cn(
                  "h-6 w-6", 
                  post.isLiked ? "fill-red-500 text-red-500" : "text-foreground"
                )} 
              />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Authentication required",
                    description: "Please log in to comment on posts",
                  });
                  navigate('/profile');
                  return;
                }
              }}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handleSharePost}
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={handleSavePost}
          >
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Likes */}
        <div className="mt-1">
          <span className="font-medium text-sm">{post.likes.toLocaleString()} likes</span>
        </div>
        
        {/* Caption */}
        <div className="mt-1">
          <span className="font-medium text-sm">{post.username}</span>{" "}
          <span className="text-sm">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="mt-1">
            {post.comments.length > 2 && !showAllComments && (
              <button 
                className="text-muted-foreground text-sm"
                onClick={() => setShowAllComments(true)}
              >
                View all {post.comments.length} comments
              </button>
            )}
            {displayedComments.map((comment) => (
              <div key={comment.id} className="mt-1">
                <span className="font-medium text-sm">{comment.username}</span>{" "}
                <span className="text-sm">{comment.text}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Timestamp */}
        <div className="mt-1">
          <span className="text-xs text-muted-foreground uppercase">{post.timestamp}</span>
        </div>
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmitComment} className="border-t px-3 py-2 flex items-center">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isAuthenticated ? "Add a comment..." : "Log in to comment"}
          className="min-h-0 h-9 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          disabled={!isAuthenticated}
        />
        {comment.trim() && isAuthenticated && (
          <Button 
            type="submit" 
            variant="ghost" 
            className="text-primary font-semibold ml-2 h-9 px-3"
          >
            Post
          </Button>
        )}
        {!isAuthenticated && (
          <Button 
            type="button" 
            variant="ghost" 
            className="text-primary font-semibold ml-2 h-9 px-3"
            onClick={() => navigate('/profile')}
          >
            Log in
          </Button>
        )}
      </form>
    </div>
  );
};

export default PostCard;
