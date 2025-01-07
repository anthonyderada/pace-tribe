import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login attempt", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-light">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">Welcome back</h2>
          <p className="mt-2 text-text-secondary">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full bg-accent-primary hover:bg-accent-dark">
              Sign in
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{" "}
            <button onClick={() => navigate("/register")} className="text-accent-primary hover:text-accent-dark">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;