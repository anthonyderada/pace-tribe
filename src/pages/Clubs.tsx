import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Clubs = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Running Clubs</h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" placeholder="Search clubs..." />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Create Club
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((club) => (
          <Card key={club} className="border-0 bg-zinc-900/90">
            <CardHeader>
              <CardTitle className="text-zinc-100">Trail Blazers</CardTitle>
              <CardDescription className="text-zinc-400">
                San Francisco, CA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 mb-4">
                A community of trail runners exploring the Bay Area's best paths.
              </p>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => navigate(`/clubs/${club}`)}
              >
                View Club
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clubs;