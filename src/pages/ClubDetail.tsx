import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Calendar } from "lucide-react";

const ClubDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-card">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Trail Blazers</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            San Francisco, CA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <p className="text-muted-foreground">
                A community of trail runners exploring the Bay Area's best paths. We welcome runners of all levels and organize weekly group runs, training sessions, and social events.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">156 members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Founded 2022</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Saturday Morning Run</CardTitle>
                    <CardDescription>March 30, 2024 - 8:00 AM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Join us for a casual 5K run through Golden Gate Park.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <Button className="w-full mt-8 bg-accent-primary hover:bg-accent-dark">
            Join Club
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDetail;