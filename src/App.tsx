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
import ProjectDetails from "./pages/ProjectDetails";
import Settings from "./pages/Settings";
import Contracts from "./pages/Contracts";
import ContractDetails from "./pages/ContractDetails";
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

          {/* Protected Routes - require email verification and role-based access */}
          <Route
            path="/client-dashboard"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/developer-dashboard"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="developer">
                  <DeveloperDashboard />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/super-admin-dashboard"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="admin">
                  <AdminUserView />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/users/:userId/edit"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="admin">
                  <AdminUserEdit />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="admin">
                  <AdminReports />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="admin">
                  <AdminSettings />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/support"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="admin">
                  <AdminSupport />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/support/ticket/:ticketId"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="admin">
                  <AdminSupportTicketDetail />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="admin">
                  <AdminMessages />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/messages"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/payments"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/projects"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="client">
                  <Projects />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          {/* TODO: Protect this route after modification - should require client role and email verification */}
          <Route
            path="/project/:id"
            element={<ProjectDetails />}
          />
          <Route
            path="/settings"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/contracts"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute>
                  <Contracts />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          {/* TODO: Protect this route after modification - should require client role and email verification */}
          <Route
            path="/contracts/:id"
            element={<ContractDetails />}
          />
          <Route
            path="/saved-developers"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="client">
                  <SavedDevelopers />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/project-requests"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="developer">
                  <ProjectRequests />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/upload-update"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="developer">
                  <UploadUpdate />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/support"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/active-projects"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute>
                  <ActiveProjects />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/developer-messages"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="developer">
                  <DeveloperMessages />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          <Route
            path="/developer-payments"
            element={
              <EmailVerificationGuard>
                <ProtectedRoute requiredRole="developer">
                  <DeveloperPayments />
                </ProtectedRoute>
              </EmailVerificationGuard>
            }
          />
          {/* // TODO: After modification add protection to this route (require developer + email verification) */}
          <Route path="/developer-liscences" element={<DeveloperLiscences />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
