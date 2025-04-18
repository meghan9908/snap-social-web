
// Custom type definitions for Supabase tables
export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

export interface PostData {
  id: string;
  image_url: string;
  caption: string;
  likes_count: number;
  created_at: string;
  user_id: string;
  profiles?: Profile;
}

export interface CommentData {
  id: string;
  post_id: string;
  text: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
}

export interface LikeData {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
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
  id: string;
  story_id: string;
  user_id: string;
  viewed_at: string;
}

// Type-safe interfaces for Supabase queries
export interface SupabaseQueryTables {
  profiles: Profile;
  posts: PostData;
  comments: CommentData;
  likes: LikeData;
  stories: StoryData;
  viewed_stories: ViewedStoryData;
}
