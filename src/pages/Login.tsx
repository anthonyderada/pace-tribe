import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border-0 bg-zinc-900/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-zinc-100">Welcome back</CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in to your Pace Tribe account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Sign In
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;