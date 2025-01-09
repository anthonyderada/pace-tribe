import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setError(""); // Clear any errors on successful signup
        navigate("/");
      }
      if (event === "USER_SIGNED_UP") {
        const { error: signUpError } = await supabase.auth.getSession();
        if (signUpError) {
          const errorMessage = getErrorMessage(signUpError);
          setError(errorMessage);
          toast({
            variant: "destructive",
            title: "Registration Error",
            description: errorMessage,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'user_already_exists':
          return "This email is already registered. Please try logging in instead.";
        case 'invalid_credentials':
          return "Invalid email or password format. Please check your credentials.";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-emerald-500 text-center mb-8">
          Join Pace Tribe
        </h1>
        <div className="bg-zinc-900/90 p-8 rounded-lg border border-zinc-800">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10B981',
                    brandAccent: '#059669',
                    inputBackground: 'rgb(39 39 42)',
                    inputText: 'white',
                    inputPlaceholder: 'rgb(161 161 170)',
                  },
                },
              },
              className: {
                container: 'supabase-container',
                button: 'supabase-button',
                input: 'supabase-input',
              },
            }}
            theme="dark"
            providers={[]}
            redirectTo={window.location.origin}
            view="sign_up"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;