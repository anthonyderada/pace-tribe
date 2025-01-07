import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border-0 bg-zinc-900/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-zinc-100">Create Account</CardTitle>
          <CardDescription className="text-zinc-400">
            Join the Pace Tribe community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-200">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Enter your name"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
              />
            </div>
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
                placeholder="Create a password"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Create Account
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => navigate("/login")}
          >
            Already have an account?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;