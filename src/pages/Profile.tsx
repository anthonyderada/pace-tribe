import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 border-0 bg-zinc-900/90">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-4xl text-white">JD</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-zinc-100 mb-2">John Doe</h1>
              <p className="text-zinc-400 flex items-center justify-center md:justify-start gap-2 mb-4">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-0 bg-zinc-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Users className="h-5 w-5" />
              My Clubs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">No clubs joined yet</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-zinc-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">No upcoming events</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;