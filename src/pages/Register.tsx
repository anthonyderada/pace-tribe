import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log("Registration attempt", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-light">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">Join Pace Tribe</h2>
          <p className="mt-2 text-text-secondary">Create your account to get started</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary">
                Full name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full bg-accent-primary hover:bg-accent-dark">
              Create account
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-accent-primary hover:text-accent-dark">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;