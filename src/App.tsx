
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BrowseDevelopers from "./pages/BrowseDevelopers";
import DeveloperProfile from "./pages/DeveloperProfile";
import ClientDashboard from "./pages/ClientDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import Messages from "./pages/Messages";
import Payments from "./pages/Payments";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Contracts from "./pages/Contracts";
import SavedDevelopers from "./pages/SavedDevelopers";
import ProjectRequests from "./pages/ProjectRequests";
import UploadUpdate from "./pages/UploadUpdate";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/browse" element={<BrowseDevelopers />} />
            <Route path="/developer/:id" element={<DeveloperProfile />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/saved-developers" element={<SavedDevelopers />} />
            <Route path="/project-requests" element={<ProjectRequests />} />
            <Route path="/upload-update" element={<UploadUpdate />} />
            <Route path="/support" element={<Support />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
