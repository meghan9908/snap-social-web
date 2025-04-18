
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Image, ChevronLeft, Upload, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/ClerkUserContext";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreatePost = () => {
  const [step, setStep] = useState<'select' | 'caption'>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { addPost } = usePosts();
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create posts"
      });
      navigate('/profile', { state: { requireAuth: true } });
    }
  }, [isAuthenticated, navigate, toast]);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Please select an image or video file",
        variant: "destructive"
      });
      return;
    }

    const fileURL = URL.createObjectURL(file);
    setSelectedFile(file);
    setMediaPreview(fileURL);
    setMediaType(isImage ? 'image' : 'video');
    setStep('caption');
  };

  const handleShare = async () => {
    if (!selectedFile || !user || isUploading) return;

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      // Create post
      const postData = {
        user_id: user.id,
        caption,
        image_url: mediaType === 'image' ? publicUrl : null,
        video_url: mediaType === 'video' ? publicUrl : null,
        media_type: mediaType
      };

      const { error: postError } = await supabase
        .from('posts')
        .insert(postData);

      if (postError) throw postError;

      toast({
        title: "Post created!",
        description: "Your post has been shared successfully."
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="h-6 w-6" />
        </Button>
        
        <h1 className="text-lg font-semibold">
          {step === 'select' ? 'Create new post' : 'Add caption'}
        </h1>
        
        {step === 'caption' ? (
          <Button variant="ghost" onClick={() => setStep('select')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {step === 'select' ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-center mb-4">Upload a photo or video</p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground">Click to upload</span>
              </div>
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {mediaPreview && (
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                {mediaType === 'image' ? (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    controls
                    className="w-full h-full"
                  />
                )}
              </div>
            )}
            <Textarea
              placeholder="Write a caption... Use #hashtags to categorize your post"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full resize-none"
              rows={4}
            />
            <Button 
              onClick={handleShare} 
              className="w-full instagram-gradient text-white"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Share"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
