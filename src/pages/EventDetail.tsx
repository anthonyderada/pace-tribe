import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const EventDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="border-0 bg-zinc-900/90">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-zinc-100">Saturday Morning Run</CardTitle>
          <CardDescription className="flex items-center gap-2 text-zinc-400">
            <Calendar className="h-4 w-4" />
            March 30, 2024 - 8:00 AM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-zinc-100">Event Details</h3>
            <p className="text-zinc-400 mb-4">
              Join us for a casual 5K run through Golden Gate Park. Perfect for runners of all levels. We'll meet at the park entrance and finish with coffee at the nearby café.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-zinc-400" />
                <span className="text-zinc-400">Golden Gate Park, San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-zinc-400" />
                <span className="text-zinc-400">24 attendees</span>
              </div>
            </div>
          </div>
          {user ? (
            <Button className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white">
              Register for Event
            </Button>
          ) : (
            <Button 
              className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => navigate('/login')}
            >
              Login to Register
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 bg-zinc-900/90">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">Organized by</CardTitle>
        </CardHeader>
        <CardContent>
          <Card 
            className="border-0 bg-zinc-900/90 cursor-pointer hover:bg-zinc-800/90 transition-colors"
            onClick={() => navigate('/clubs/1')}
          >
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">Trail Blazers</CardTitle>
              <CardDescription className="text-zinc-400">Running Club</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">A community of trail runners exploring the Bay Area's best paths.</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetail;