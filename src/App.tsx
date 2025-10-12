import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Company from "./pages/Company";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root redirect to default locale */}
          <Route path="/" element={<Navigate to="/de/" replace />} />
          
          {/* Locale-aware routes */}
          <Route path="/:locale/" element={<Landing />} />
          <Route path="/:locale/auth/signup" element={<Signup />} />
          <Route path="/:locale/auth/login" element={<Login />} />
          <Route path="/:locale/dashboard" element={<Dashboard />} />
          <Route path="/:locale/company" element={<Company />} />
          
          {/* Placeholder routes for footer links */}
          <Route path="/:locale/pricing" element={<div className="min-h-screen flex items-center justify-center">Pricing - Coming Soon</div>} />
          <Route path="/:locale/contact" element={<div className="min-h-screen flex items-center justify-center">Contact - Coming Soon</div>} />
          <Route path="/:locale/blog" element={<div className="min-h-screen flex items-center justify-center">Blog - Coming Soon</div>} />
          <Route path="/:locale/faq" element={<div className="min-h-screen flex items-center justify-center">FAQ - Coming Soon</div>} />
          <Route path="/:locale/support" element={<div className="min-h-screen flex items-center justify-center">Support - Coming Soon</div>} />
          <Route path="/:locale/docs" element={<div className="min-h-screen flex items-center justify-center">Documentation - Coming Soon</div>} />
          <Route path="/:locale/legal/privacy" element={<div className="min-h-screen flex items-center justify-center">Privacy Policy - Coming Soon</div>} />
          <Route path="/:locale/legal/terms" element={<div className="min-h-screen flex items-center justify-center">Terms of Service - Coming Soon</div>} />
          <Route path="/:locale/legal/impressum" element={<div className="min-h-screen flex items-center justify-center">Impressum - Coming Soon</div>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
