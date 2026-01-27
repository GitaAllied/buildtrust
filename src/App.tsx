import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EmailVerificationGuard } from "@/components/EmailVerificationGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BrowseDevelopers from "./pages/BrowseDevelopers";
import DeveloperProfile from "./pages/DeveloperProfile";
import ClientDashboard from "./pages/ClientDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import AdminSupport from "./pages/AdminSupport";
import AdminMessages from "./pages/AdminMessages";
import AdminSupportTicketDetail from "./pages/AdminSupportTicketDetail";
import AdminUserView from "./pages/AdminUserView";
import AdminUserEdit from "./pages/AdminUserEdit";
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
import ActiveProjects from "./pages/ActiveProjects";
import DeveloperMessages from "./pages/DeveloperMessages";
import DeveloperPayments from "./pages/DeveloperPayments";
import DeveloperLiscences from "./pages/DeveloperLiscences";
// TEST
import ClientSetup from "./components/ClientSetup";
import PortfolioSetup from "./components/PortfolioSetup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes - accessible before email verification */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/browse" element={<BrowseDevelopers />} />
          <Route path="/developer/:id" element={<DeveloperProfile />} />

          {/* Protected Routes - require email verification */}
          <Route
            path="/client-dashboard"
            element={
              <EmailVerificationGuard>
                <ClientDashboard />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/developer-dashboard"
            element={
              <EmailVerificationGuard>
                <DeveloperDashboard />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/super-admin-dashboard"
            element={
              <EmailVerificationGuard>
                <SuperAdminDashboard />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <EmailVerificationGuard>
                <AdminUsers />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <EmailVerificationGuard>
                <AdminUserView />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/users/:userId/edit"
            element={
              <EmailVerificationGuard>
                <AdminUserEdit />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <EmailVerificationGuard>
                <AdminReports />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <EmailVerificationGuard>
                <AdminSettings />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/support"
            element={
              <EmailVerificationGuard>
                <AdminSupport />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/support/ticket/:ticketId"
            element={
              <EmailVerificationGuard>
                <AdminSupportTicketDetail />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <EmailVerificationGuard>
                <AdminMessages />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/messages"
            element={
              <EmailVerificationGuard>
                <Messages />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/payments"
            element={
              <EmailVerificationGuard>
                <Payments />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/projects"
            element={
              <EmailVerificationGuard>
                <Projects />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <EmailVerificationGuard>
                <Settings />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/contracts"
            element={
              <EmailVerificationGuard>
                <Contracts />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/saved-developers"
            element={
              <EmailVerificationGuard>
                <SavedDevelopers />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/project-requests"
            element={
              <EmailVerificationGuard>
                <ProjectRequests />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/upload-update"
            element={
              <EmailVerificationGuard>
                <UploadUpdate />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/support"
            element={
              <EmailVerificationGuard>
                <Support />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/active-projects"
            element={
              <EmailVerificationGuard>
                <ActiveProjects />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/developer-messages"
            element={
              <EmailVerificationGuard>
                <DeveloperMessages />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/developer-payments"
            element={
              <EmailVerificationGuard>
                <DeveloperPayments />
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/developer-liscences"
            element={
              <EmailVerificationGuard>
                <DeveloperLiscences />
              </EmailVerificationGuard>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
