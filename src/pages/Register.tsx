import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SocialLogin } from "@/components/auth/SocialLogin";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-black px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/3ebe28ba-92cf-406c-9111-8d73785be588.png"
            alt="Logo"
            className="h-16 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white mb-2">
            Create Your Account
          </h2>
          <p className="text-emerald-400">Join our community today</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10">
          <RegisterForm />
          <SocialLogin />

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="text-emerald-400 hover:text-emerald-300 p-0"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;