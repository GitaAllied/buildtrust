
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import AdminSettingsGeneral from "./pages/AdminSettingsGeneral";
import AdminSettingsSecurity from "./pages/AdminSettingsSecurity";
import AdminSettingsPassword from "./pages/AdminSettingsPassword";
import AdminSettingsEmail from "./pages/AdminSettingsEmail";
import AdminSettingsPayment from "./pages/AdminSettingsPayment";
import AdminSettingsNotifications from "./pages/AdminSettingsNotifications";
import AdminSupport from "./pages/AdminSupport";
import AdminMessages from "./pages/AdminMessages";
import AdminSupportTicketDetail from "./pages/AdminSupportTicketDetail";
import AdminSupportCreate from "./pages/AdminSupportCreate";
import AdminSupportCategories from "./pages/AdminSupportCategories";
import AdminSupportSettings from "./pages/AdminSupportSettings";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/browse" element={<BrowseDevelopers />} />
            <Route path="/developer/:id" element={<DeveloperProfile />} />
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/developer-dashboard" 
              element={
                <ProtectedRoute requiredRole="developer">
                  <DeveloperDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:userId" element={<AdminUserView />} />
            <Route path="/admin/users/:userId/edit" element={<AdminUserEdit />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/settings/general" element={<AdminSettingsGeneral />} />
            <Route path="/admin/settings/security" element={<AdminSettingsSecurity />} />
            <Route path="/admin/settings/password" element={<AdminSettingsPassword />} />
            <Route path="/admin/settings/email" element={<AdminSettingsEmail />} />
            <Route path="/admin/settings/payment" element={<AdminSettingsPayment />} />
            <Route path="/admin/settings/notifications" element={<AdminSettingsNotifications />} />
            <Route path="/admin/support" element={<AdminSupport />} />
            <Route path="/admin/support/ticket/:ticketId" element={<AdminSupportTicketDetail />} />
            <Route path="/admin/support/create" element={<AdminSupportCreate />} />
            <Route path="/admin/support/categories" element={<AdminSupportCategories />} />
            <Route path="/admin/support/settings" element={<AdminSupportSettings />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
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
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
