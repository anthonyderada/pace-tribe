import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center">
              <span className="text-4xl text-accent-foreground">JD</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-card-foreground mb-2">John Doe</h1>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mb-4">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </p>
              <Button className="bg-accent-primary hover:bg-accent-dark">
                Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Users className="h-5 w-5" />
              My Clubs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No clubs joined yet</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No upcoming events</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;