
// Custom type definitions for Supabase tables
export interface Profile {
  username: string;
  avatar_url: string;
}

export interface PostData {
  id: string;
  image_url: string;
  caption: string;
  likes_count: number;
  created_at: string;
  profiles?: Profile;
  user_id: string;
}

export interface CommentData {
  id: string;
  post_id: string;
  text: string;
  created_at: string;
  profiles?: Profile;
}

export interface LikeData {
  post_id: string;
}

export interface StoryData {
  id: string;
  image_url: string;
  created_at: string;
  expires_at: string;
  user_id: string;
  profiles?: Profile;
}

export interface ViewedStoryData {
  story_id: string;
}
