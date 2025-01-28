import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CallToAction = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="py-24 bg-black">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {user ? (
          <>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Welcome to Pace Tribe!
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              We are always looking to improve this app for you. Feel free to leave feature ideas or feedback about the current app below.
            </p>
            <Button 
              onClick={() => window.open("https://forms.gle/YourFormLink", "_blank")}
              className="bg-white text-black px-8 py-3 text-lg"
            >
              Feedback Form
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Running Together?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join Pace Tribe today and connect with runners in your area. Whether you're just starting or training for a marathon, there's a club for you.
            </p>
            <Button 
              onClick={() => navigate("/register")}
              className="bg-white text-black px-8 py-3 text-lg"
            >
              Join Now
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CallToAction;