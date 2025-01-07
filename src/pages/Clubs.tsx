import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Clubs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Running Clubs</h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-dark" />
            <Input className="pl-10" placeholder="Search clubs..." />
          </div>
          <Button className="bg-accent-primary hover:bg-accent-dark">
            Create Club
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((club) => (
          <Card key={club}>
            <CardHeader>
              <CardTitle className="text-text-primary">Trail Blazers</CardTitle>
              <CardDescription className="text-text-secondary">
                San Francisco, CA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary mb-4">
                A community of trail runners exploring the Bay Area's best paths.
              </p>
              <Button className="w-full bg-accent-primary hover:bg-accent-dark">
                Join Club
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clubs;