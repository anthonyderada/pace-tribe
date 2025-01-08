import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-emerald-500 text-center mb-8">
          Welcome to Pace Tribe
        </h1>
        <div className="bg-zinc-900/90 p-8 rounded-lg border border-zinc-800">
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
            providers={["google"]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;