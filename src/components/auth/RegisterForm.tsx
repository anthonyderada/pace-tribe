import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email: email,
            is_first_login: true, // Add this flag to track first login
          }
        }
      });

      if (error) throw error;

      if (data.user && !data.user.confirmed_at) {
        setVerificationSent(true);
        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      const message = error.message || "An error occurred during registration";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Verify Your Email</h3>
        <p className="text-gray-300">
          We've sent a verification link to <span className="font-medium">{email}</span>
        </p>
        <p className="text-gray-400 text-sm">
          Please check your email and click the link to verify your account.
          Once verified, you'll be able to sign in.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
          onClick={() => setVerificationSent(false)}
        >
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
      </div>
      
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};
