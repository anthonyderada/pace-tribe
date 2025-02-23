import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Clubs from "@/pages/Clubs";
import ClubDetail from "@/pages/ClubDetail";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Onboarding from "@/pages/Onboarding";
import Members from "@/pages/Members";
import EventDetail from "@/pages/EventDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes without layout */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Main app routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="clubs" element={<Clubs />} />
              <Route path="clubs/:id" element={<ClubDetail />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="members" element={<Members />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="settings" element={<Profile />} /> {/* Temporarily using Profile component for settings */}
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;