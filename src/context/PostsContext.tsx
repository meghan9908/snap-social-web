
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PostData, CommentData, LikeData } from '@/types/supabase-types';
import { useUser } from '@clerk/clerk-react';

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  timestamp: string;
}

interface PostsContextType {
  posts: Post[];
  likePost: (id: string) => void;
  addComment: (postId: string, text: string) => void;
  addPost: (post: Omit<Post, 'id'>) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, image_url, caption, likes_count, created_at, user_id');

      if (postsError) throw postsError;

      // Get user profiles data separately since there's no relation
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url');

      const currentUser = await supabase.auth.getSession();
      const userId = currentUser?.data?.session?.user?.id;

      const { data: likesData } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', userId || '');

      const { data: commentsData } = await supabase
        .from('comments')
        .select('id, post_id, text, created_at, user_id');

      const formattedPosts: Post[] = (postsData || []).map(post => {
        // Find matching profile for this post's user_id
        const userProfile = profilesData?.find(profile => profile.id === post.user_id);
        
        const username = userProfile?.username || 
                       (post.user_id === userId && user?.username) || 
                       'unknown';
        const avatarUrl = userProfile?.avatar_url || 
                        (post.user_id === userId && user?.imageUrl) || 
                        '';
        
        const postComments = (commentsData || [])
          .filter(comment => comment.post_id === post.id)
          .map(comment => {
            // Find matching profile for this comment's user_id
            const commentUserProfile = profilesData?.find(profile => profile.id === comment.user_id);
            
            const commentUsername = commentUserProfile?.username || 
                                  (comment.user_id === userId && user?.username) || 
                                  'unknown';
            
            return {
              id: comment.id,
              username: commentUsername,
              text: comment.text,
              timestamp: new Date(comment.created_at).toLocaleDateString()
            };
          });
        
        return {
          id: post.id,
          username: username,
          userAvatar: avatarUrl,
          imageUrl: post.image_url,
          caption: post.caption || '',
          likes: post.likes_count || 0,
          isLiked: (likesData || []).some(like => like.post_id === post.id),
          comments: postComments,
          timestamp: new Date(post.created_at).toLocaleDateString()
        };
      });

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const likePost = async (id: string) => {
    const currentUser = await supabase.auth.getSession();
    const userId = currentUser?.data?.session?.user?.id;
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
      });
      return;
    }

    try {
      const post = posts.find(p => p.id === id);
      if (!post) return;

      if (post.isLiked) {
        await supabase
          .from('likes')
          .delete()
          .match({ post_id: id, user_id: userId });

        await supabase
          .from('posts')
          .update({ likes_count: post.likes - 1 })
          .eq('id', id);
      } else {
        await supabase
          .from('likes')
          .insert({
            post_id: id,
            user_id: userId
          });

        await supabase
          .from('posts')
          .update({ likes_count: post.likes + 1 })
          .eq('id', id);
      }

      await fetchPosts();
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const addComment = async (postId: string, text: string) => {
    const currentUser = await supabase.auth.getSession();
    const userId = currentUser?.data?.session?.user?.id;
    
    if (!userId || !text.trim()) return;

    try {
      await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          text: text.trim()
        });

      await fetchPosts();
      
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const addPost = async (post: Omit<Post, 'id'>) => {
    const currentUser = await supabase.auth.getSession();
    const userId = currentUser?.data?.session?.user?.id;
    
    if (!userId) return;

    try {
      await supabase
        .from('posts')
        .insert({
          user_id: userId,
          image_url: post.imageUrl,
          caption: post.caption
        });

      await fetchPosts();
      
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <PostsContext.Provider value={{ posts, likePost, addComment, addPost }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

export default PostsContext;
