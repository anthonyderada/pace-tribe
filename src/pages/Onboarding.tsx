import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Required fields
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  // Optional running preferences
  const [preferredDistance, setPreferredDistance] = useState("");
  const [paceRange, setPaceRange] = useState([6, 7]);
  const [seekingTrainingPartners, setSeekingTrainingPartners] = useState(false);
  const [seekingCasualMeetups, setSeekingCasualMeetups] = useState(false);
  const [seekingRacePacers, setSeekingRacePacers] = useState(false);
  const [preferredShoeBrands, setPreferredShoeBrands] = useState<string[]>([]);

  const formatPace = (pace: number) => {
    return `${Math.floor(pace)}:${((pace % 1) * 60).toFixed(0).padStart(2, '0')} min/mile`;
  };

  const formatPaceRange = (range: number[]) => {
    return `${formatPace(range[0])} - ${formatPace(range[1])}`;
  };

  const shoeBrands = [
    "Nike", "Hoka", "ON", "Asics", "Saucony", "Brooks", "Adidas",
    "Mizuno", "Altra", "New Balance", "Salomon", "La Sportiva",
    "Merrel", "Topo Athletic"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !bio.trim() || !location.trim()) {
      setError("Username, bio, and location are required");
      return;
    }

    setLoading(true);

    try {
      const formattedPaceRange = formatPaceRange(paceRange);
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          bio: bio.trim(),
          location: location.trim(),
          preferred_distance: preferredDistance || null,
          comfortable_pace: formattedPaceRange,
          seeking_training_partners: seekingTrainingPartners,
          seeking_casual_meetups: seekingCasualMeetups,
          seeking_race_pacers: seekingRacePacers,
          preferred_shoe_brand: preferredShoeBrands.length > 0 ? preferredShoeBrands : null
        })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Profile created",
        description: "Welcome to the community!",
      });
      
      navigate("/");
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <Card className="max-w-2xl mx-auto border-0 bg-zinc-900/90">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">
            Welcome! Let's set up your profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Required Information</h2>
              <div>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[100px] bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                />
              </div>
              <div>
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Running Preferences (Optional)</h2>
              <p className="text-sm text-zinc-400">You can always update these later in your profile settings</p>
              
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">
                  Preferred Race Distance
                </label>
                <Select
                  value={preferredDistance}
                  onValueChange={setPreferredDistance}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select preferred distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5k">5k</SelectItem>
                    <SelectItem value="10k">10k</SelectItem>
                    <SelectItem value="Half Marathon">Half Marathon</SelectItem>
                    <SelectItem value="Marathon">Marathon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-2 block">
                  Comfortable Pace Range
                </label>
                <div className="space-y-2">
                  <Slider
                    value={paceRange}
                    onValueChange={setPaceRange}
                    min={4.5}
                    max={10}
                    step={0.25}
                    className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[role=slider]]:ring-white [&_[role=slider]]:ring-offset-black [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-white [&_[role=slider]]:focus:ring-offset-2 [&_[role=slider]]:focus:ring-offset-black [&_[role=slider]]:hover:border-white/80 [&_[role=slider]]:active:border-white/70 [&_[role=track]]:bg-zinc-700 [&_[role=range]]:bg-white"
                  />
                  <div className="text-white text-sm">
                    {formatPaceRange(paceRange)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-2 block">
                  Preferred Shoe Brands
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {shoeBrands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`shoe-brand-${brand}`}
                        checked={preferredShoeBrands.includes(brand)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPreferredShoeBrands(prev => [...prev, brand]);
                          } else {
                            setPreferredShoeBrands(prev => prev.filter(b => b !== brand));
                          }
                        }}
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label
                        htmlFor={`shoe-brand-${brand}`}
                        className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 block">
                  Connection Preferences
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="training-partners"
                      checked={seekingTrainingPartners}
                      onCheckedChange={(checked) => 
                        setSeekingTrainingPartners(checked as boolean)
                      }
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <label
                      htmlFor="training-partners"
                      className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Looking for Training Partners
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="casual-meetups"
                      checked={seekingCasualMeetups}
                      onCheckedChange={(checked) => 
                        setSeekingCasualMeetups(checked as boolean)
                      }
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <label
                      htmlFor="casual-meetups"
                      className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Interested in Casual Meetups
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="race-pacers"
                      checked={seekingRacePacers}
                      onCheckedChange={(checked) => 
                        setSeekingRacePacers(checked as boolean)
                      }
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <label
                      htmlFor="race-pacers"
                      className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Looking for Race Day Pacers
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={loading}
            >
              {loading ? "Creating profile..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;