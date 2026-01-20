import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
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
import ActiveProjects from "./pages/ActiveProjects";
import DeveloperMessages from "./pages/DeveloperMessages";
import DeveloperPayments from "./pages/DeveloperPayments";
import DeveloperLiscences from "./pages/DeveloperLiscences";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <EmailVerificationGuard>
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
            <Route 
              path="/super-admin-dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users/:userId" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUserView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users/:userId/edit" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUserEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings/general" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettingsGeneral />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings/security" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettingsSecurity />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings/password" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettingsPassword />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings/email" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettingsEmail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings/payment" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettingsPayment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings/notifications" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettingsNotifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/support" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSupport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/support/ticket/:ticketId" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSupportTicketDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/support/create" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSupportCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/support/categories" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSupportCategories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/support/settings" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSupportSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/messages" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminMessages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payments" 
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contracts" 
              element={
                <ProtectedRoute>
                  <Contracts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/saved-developers" 
              element={
                <ProtectedRoute requiredRole="client">
                  <SavedDevelopers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/active-projects" 
              element={
                <ProtectedRoute requiredRole="developer">
                  <ActiveProjects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/developer-messages" 
              element={
                <ProtectedRoute requiredRole="developer">
                  <DeveloperMessages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/developer-payments" 
              element={
                <ProtectedRoute requiredRole="developer">
                  <DeveloperPayments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/developer-liscences" 
              element={
                <ProtectedRoute requiredRole="developer">
                  <DeveloperLiscences />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/project-requests" 
              element={
                <ProtectedRoute requiredRole="developer">
                  <ProjectRequests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload-update" 
              element={
                <ProtectedRoute requiredRole="developer">
                  <UploadUpdate />
                </ProtectedRoute>
              } 
            />
<<<<<<< HEAD
            <Route path="/support" element={<Support />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </EmailVerificationGuard>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
