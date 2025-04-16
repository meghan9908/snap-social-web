
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Image, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePosts } from "@/context/PostsContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const CreatePost = () => {
  const [step, setStep] = useState<'select' | 'caption'>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const { addPost } = usePosts();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const demoImages = [
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600",
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600",
    "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=600"
  ];

  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
    setStep('caption');
  };

  const handleShare = () => {
    if (!selectedImage || !currentUser) return;
    
    addPost({
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      imageUrl: selectedImage,
      caption: caption,
      likes: 0,
      isLiked: false,
      comments: [],
      timestamp: "Just now"
    });
    
    toast({
      title: "Post created!",
      description: "Your post has been shared successfully."
    });
    
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
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
          <div className="w-10"></div> {/* Spacer for alignment */}
        )}
      </div>

      {/* Content */}
      {step === 'select' ? (
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-center mb-4">Select a photo to share</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {demoImages.map((image, index) => (
              <div 
                key={index} 
                onClick={() => handleSelectImage(image)}
                className="aspect-square cursor-pointer relative overflow-hidden rounded-md hover:opacity-90 transition-opacity"
              >
                <img 
                  src={image} 
                  alt={`Demo ${index}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Image className="h-8 w-8 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {selectedImage && (
            <div className="p-4 border-b">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full max-h-80 object-contain"
              />
            </div>
          )}
          <div className="p-4 flex-1">
            <Textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full h-40 resize-none"
            />
          </div>
          <div className="p-4 border-t">
            <Button onClick={handleShare} className="w-full instagram-gradient text-white">
              Share
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
