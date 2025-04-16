
import React, { createContext, useState, useContext, ReactNode } from 'react';

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

const mockPosts: Post[] = [
  {
    id: "post1",
    username: "johndoe",
    userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600",
    caption: "Working from home today. The view isn't bad! #workfromhome #productivity",
    likes: 127,
    isLiked: false,
    comments: [
      {
        id: "comment1",
        username: "jane_smith",
        text: "This looks so cozy!",
        timestamp: "2h ago"
      },
      {
        id: "comment2",
        username: "travel_enthusiast",
        text: "Great setup! 👍",
        timestamp: "1h ago"
      }
    ],
    timestamp: "3h ago"
  },
  {
    id: "post2",
    username: "techguru",
    userAvatar: "https://images.unsplash.com/photo-1623184663110-89ba5b565eb6?q=80&w=200&auto=format",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600",
    caption: "Just got this new laptop! The screen resolution is amazing. #tech #newgadget",
    likes: 243,
    isLiked: true,
    comments: [
      {
        id: "comment3",
        username: "gadget_lover",
        text: "What model is this?",
        timestamp: "45m ago"
      }
    ],
    timestamp: "6h ago"
  },
  {
    id: "post3",
    username: "catlovers",
    userAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600",
    caption: "My cat just being adorable as usual. #catsofinstagram #cute",
    likes: 598,
    isLiked: false,
    comments: [
      {
        id: "comment4",
        username: "cat_lady",
        text: "What a gorgeous baby! 😍",
        timestamp: "1h ago"
      },
      {
        id: "comment5",
        username: "pet_photographer",
        text: "Great shot! The lighting is perfect.",
        timestamp: "30m ago"
      }
    ],
    timestamp: "8h ago"
  }
];

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const likePost = (id: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === id) {
          return { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            username: "johndoe", // Use the current user
            text,
            timestamp: "Now"
          };
          return { 
            ...post, 
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
  };

  const addPost = (newPost: Omit<Post, 'id'>) => {
    const post: Post = {
      ...newPost,
      id: `post-${Date.now()}`,
    };
    
    setPosts(prevPosts => [post, ...prevPosts]);
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
