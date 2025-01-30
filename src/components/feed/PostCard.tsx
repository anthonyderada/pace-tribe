import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Post = {
  id: string;
  content: string;
  image_url: string | null;
  distance: number | null;
  duration: string | null;
  pace: string | null;
  created_at: string;
  event_id: string | null;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  events?: {
    title: string;
    club: {
      name: string;
    };
  } | null;
  _count?: {
    post_likes: number;
    post_comments: number;
  };
  liked?: boolean;
};

interface PostCardProps {
  post: Post;
  userId?: string;
}

export const PostCard = ({ post, userId }: PostCardProps) => {
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Must be logged in to like posts");

      if (post.liked) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("post_likes")
          .insert({ post_id: post.id, user_id: userId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success(post.liked ? "Post unliked" : "Post liked");
    },
    onError: (error) => {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    },
  });

  return (
    <Card className="bg-zinc-900/90 border-zinc-800">
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.profiles.avatar_url || undefined} />
          <AvatarFallback className="bg-zinc-800">
            {post.profiles.username[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Link
            to={`/profile/${post.profiles.id}`}
            className="font-semibold text-zinc-100 hover:underline"
          >
            {post.profiles.username}
          </Link>
          <p className="text-sm text-zinc-400">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {post.content && (
          <p className="text-zinc-100">{post.content}</p>
        )}
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Run recap"
            className="rounded-lg w-full object-cover max-h-96"
          />
        )}
        {(post.distance || post.duration || post.pace) && (
          <div className="grid grid-cols-3 gap-4 bg-zinc-800/50 p-4 rounded-lg">
            {post.distance && (
              <div>
                <p className="text-sm text-zinc-400">Distance</p>
                <p className="text-zinc-100">{post.distance} km</p>
              </div>
            )}
            {post.duration && (
              <div>
                <p className="text-sm text-zinc-400">Duration</p>
                <p className="text-zinc-100">{post.duration}</p>
              </div>
            )}
            {post.pace && (
              <div>
                <p className="text-sm text-zinc-400">Pace</p>
                <p className="text-zinc-100">{post.pace}/km</p>
              </div>
            )}
          </div>
        )}
        {post.events && (
          <Link
            to={`/events/${post.event_id}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300"
          >
            <LinkIcon className="h-4 w-4" />
            <span>
              {post.events.title} ({post.events.club.name})
            </span>
          </Link>
        )}
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-zinc-300"
          onClick={() => userId && toggleLikeMutation.mutate()}
          disabled={!userId || toggleLikeMutation.isPending}
        >
          <Heart
            className={`h-4 w-4 mr-1 ${post.liked ? "fill-red-500 text-red-500" : ""}`}
          />
          {post._count?.post_likes || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-zinc-300"
          asChild
        >
          <Link to={`/posts/${post.id}`}>
            <MessageCircle className="h-4 w-4 mr-1" />
            {post._count?.post_comments || 0}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};