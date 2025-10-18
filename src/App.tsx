import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Company from "./pages/Company";
import LetterDetail from "./pages/LetterDetail";
import Rules from "./pages/Rules";
import Calendar from "./pages/Calendar";
import Billing from "./pages/Billing";
import Team from "./pages/Team";
import AcceptInvite from "./pages/AcceptInvite";
import Impressum from "./pages/legal/Impressum";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import AVV from "./pages/legal/AVV";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Root redirect to default locale */}
            <Route path="/" element={<Navigate to="/de/" replace />} />
            
            {/* Locale-aware routes */}
            <Route path="/:locale/" element={<Landing />} />
            <Route path="/:locale/auth/signup" element={<Signup />} />
            <Route path="/:locale/auth/login" element={<Login />} />
            <Route path="/:locale/dashboard" element={<Dashboard />} />
            <Route path="/:locale/company" element={<Company />} />
            <Route path="/:locale/letters/:id" element={<LetterDetail />} />
            <Route path="/:locale/rules" element={<Rules />} />
            <Route path="/:locale/calendar" element={<Calendar />} />
            <Route path="/:locale/dashboard/billing" element={<Billing />} />
            <Route path="/:locale/dashboard/team" element={<Team />} />
            <Route path="/:locale/team/accept-invite" element={<AcceptInvite />} />
            
            {/* Legal pages */}
            <Route path="/:locale/legal/privacy" element={<Privacy />} />
            <Route path="/:locale/legal/terms" element={<Terms />} />
            <Route path="/:locale/legal/impressum" element={<Impressum />} />
            <Route path="/:locale/legal/avv" element={<AVV />} />
            
            {/* Placeholder routes */}
            <Route path="/:locale/pricing" element={<div className="min-h-screen flex items-center justify-center">Pricing - Coming Soon</div>} />
            <Route path="/:locale/contact" element={<div className="min-h-screen flex items-center justify-center">Contact - Coming Soon</div>} />
            <Route path="/:locale/blog" element={<div className="min-h-screen flex items-center justify-center">Blog - Coming Soon</div>} />
            <Route path="/:locale/faq" element={<div className="min-h-screen flex items-center justify-center">FAQ - Coming Soon</div>} />
            <Route path="/:locale/support" element={<div className="min-h-screen flex items-center justify-center">Support - Coming Soon</div>} />
            <Route path="/:locale/docs" element={<div className="min-h-screen flex items-center justify-center">Documentation - Coming Soon</div>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
