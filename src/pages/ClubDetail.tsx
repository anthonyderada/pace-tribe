import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Calendar } from "lucide-react";

const ClubDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 border-0 bg-zinc-900/90">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-zinc-100">Trail Blazers</CardTitle>
          <CardDescription className="flex items-center gap-2 text-zinc-400">
            <MapPin className="h-4 w-4" />
            San Francisco, CA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-zinc-100">About</h3>
            <p className="text-zinc-400">
              A community of trail runners exploring the Bay Area's best paths. We welcome runners of all levels and organize weekly group runs, training sessions, and social events.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-zinc-400" />
                <span className="text-zinc-400">156 members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-zinc-400" />
                <span className="text-zinc-400">Founded 2022</span>
              </div>
            </div>
          </div>
          <Button className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white">
            Join Club
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 bg-zinc-900/90">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Card className="border-0 bg-zinc-900/90">
              <CardHeader>
                <CardTitle className="text-lg text-zinc-100">Saturday Morning Run</CardTitle>
                <CardDescription className="text-zinc-400">March 30, 2024 - 8:00 AM</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">Join us for a casual 5K run through Golden Gate Park.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDetail;