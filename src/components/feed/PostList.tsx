import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "./PostCard";
import { useAuth } from "@/contexts/AuthContext";

export const PostList = () => {
  const { user } = useAuth();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url
          ),
          events (
            id,
            title,
            clubs (
              name
            )
          ),
          post_likes (
            id,
            user_id
          ),
          post_comments (
            id
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return posts.map(post => ({
        ...post,
        _count: {
          post_likes: post.post_likes?.length || 0,
          post_comments: post.post_comments?.length || 0,
        },
        liked: post.post_likes?.some(like => like.user_id === user?.id) || false,
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-zinc-800/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} userId={user?.id} />
      ))}
    </div>
  );
};