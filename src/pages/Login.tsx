import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkProfileCompletion = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, bio, location")
        .eq("id", userId)
        .single();

      // Consider profile incomplete if any of these fields are null
      const isProfileIncomplete = !profile?.username || !profile?.bio || !profile?.location;
      
      if (isProfileIncomplete) {
        toast({
          title: "Welcome!",
          description: "Please complete your profile information.",
        });
        navigate("/profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      navigate("/profile"); // Redirect to profile on error to be safe
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await checkProfileCompletion(data.user.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border-0 bg-zinc-900/90">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">
            Welcome back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-zinc-400">Don't have an account? </span>
            <Button
              variant="link"
              onClick={() => navigate("/register")}
              className="text-emerald-500 hover:text-emerald-400"
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;