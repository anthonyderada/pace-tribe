import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";

const EventDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-card">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Saturday Morning Run</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            March 30, 2024 - 8:00 AM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Event Details</h3>
              <p className="text-muted-foreground mb-4">
                Join us for a casual 5K run through Golden Gate Park. Perfect for runners of all levels. We'll meet at the park entrance and finish with coffee at the nearby café.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Golden Gate Park, San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">24 attendees</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Organized by</h3>
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Trail Blazers</CardTitle>
                  <CardDescription>Running Club</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">A community of trail runners exploring the Bay Area's best paths.</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <Button className="w-full mt-8 bg-accent-primary hover:bg-accent-dark">
            Register for Event
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetail;