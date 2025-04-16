
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  type: 'like' | 'follow' | 'comment';
  username: string;
  avatar: string;
  content?: string;
  timestamp: string;
  postImage?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: 'like',
    username: "jane_smith",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format",
    timestamp: "2h ago",
    postImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150"
  },
  {
    id: "2",
    type: 'follow',
    username: "photography_pro",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format",
    timestamp: "4h ago"
  },
  {
    id: "3",
    type: 'comment',
    username: "travel_enthusiast",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format",
    content: "Great photo! Where was this taken?",
    timestamp: "1d ago",
    postImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150"
  },
  {
    id: "4",
    type: 'like',
    username: "design_lover",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format",
    timestamp: "2d ago",
    postImage: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=150"
  },
  {
    id: "5",
    type: 'follow',
    username: "food_blog",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format",
    timestamp: "3d ago"
  }
];

const ActivityPage = () => {
  return (
    <div className="container max-w-md mx-auto pb-16">
      <h1 className="text-xl font-semibold p-4">Activity</h1>
      
      <div className="divide-y">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center p-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={activity.avatar} alt={activity.username} />
              <AvatarFallback>{activity.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-medium">{activity.username}</span>{" "}
                {activity.type === 'like' && "liked your post."}
                {activity.type === 'follow' && "started following you."}
                {activity.type === 'comment' && (
                  <>
                    <span>commented: </span>
                    <span className="font-normal">{activity.content}</span>
                  </>
                )}
                <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
              </div>
            </div>
            
            {activity.type === 'follow' ? (
              <Button variant="outline" size="sm" className="ml-2">
                Follow
              </Button>
            ) : activity.postImage && (
              <div className="w-10 h-10 ml-2">
                <img 
                  src={activity.postImage}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;
