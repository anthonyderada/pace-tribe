import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Running Events</h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10 bg-card border-input" placeholder="Search events..." />
          </div>
          <Button className="bg-accent-primary hover:bg-accent-dark">
            Create Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((event) => (
          <Card key={event} className="bg-card border-input">
            <CardHeader>
              <CardTitle className="text-foreground">Saturday Morning Run</CardTitle>
              <CardDescription className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                March 30, 2024 - 8:00 AM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Join us for a casual 5K run through Golden Gate Park.
              </p>
              <Button 
                className="w-full bg-accent-primary hover:bg-accent-dark"
                onClick={() => navigate(`/events/${event}`)}
              >
                View Event
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;