import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle successful registration redirects
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        navigate("/");
      }
    });

    // Override the default signup handler to add our error handling
    const signUpForm = document.querySelector('form');
    if (signUpForm) {
      signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signUpForm as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (error) {
            if (error.status === 422) {
              toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "This email is already registered. Please try logging in instead.",
              });
            } else {
              toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message,
              });
            }
            return;
          }
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "An unexpected error occurred. Please try again.",
          });
          return;
        }
      });
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-emerald-500 text-center mb-8">
          Join Pace Tribe
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