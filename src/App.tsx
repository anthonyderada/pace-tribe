import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import ClubMembers from "@/pages/ClubMembers";
import Profile from "@/pages/Profile";
import Onboarding from "@/pages/Onboarding";
import Members from "@/pages/Members";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clubs/:id/members" element={<Members />} />
          <Route path="/clubs/:id" element={<ClubMembers />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;