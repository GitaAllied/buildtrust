import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import {
  Clock,
  X,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Menu,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import AdminSidebar from "@/components/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openAdminSidebar, openSignoutModal } from "@/redux/action";

const SuperAdminDashboard = () => {
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [systemStats, setSystemStats] = useState([
    {
      label: "Total Users",
      value: "0",
      change: "+0%",
      icon: Users,
    },
    {
      label: "Active Projects",
      value: "1,234",
      change: "+8%",
      icon: TrendingUp,
    },
    {
      label: "Total Revenue",
      value: "₦45.2M",
      change: "+15%",
      icon: DollarSign,
    },
    {
      label: "System Uptime",
      value: "99.9%",
      change: "Stable",
      icon: Shield,
    },
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch()
  const isOpen = useSelector((state:any) => state.sidebar.adminSidebar)
    const signOutModal = useSelector((state:any) => state.signout) 


  // Mock data for when API is not connected
  const mockRecentUsers = [
    {
      id: 1,
      name: "Ade Johnson",
      role: "Client",
      email_verified: true,
      setup_completed: true,
      status: "Active",
      joined: "Feb 9, 2025, 10:30 AM"
    },
    {
      id: 2,
      name: "Chioma Okafor",
      role: "Developer",
      email_verified: true,
      setup_completed: true,
      status: "Active",
      joined: "Feb 9, 2025, 09:15 AM"
    },
    {
      id: 3,
      name: "Ibrahim Ahmed",
      role: "Client",
      email_verified: true,
      setup_completed: false,
      status: "Pending Setup",
      joined: "Feb 8, 2025, 03:45 PM"
    },
    {
      id: 4,
      name: "Grace Oluwaseun",
      role: "Developer",
      email_verified: false,
      setup_completed: false,
      status: "Email Unverified",
      joined: "Feb 8, 2025, 02:20 PM"
    },
    {
      id: 5,
      name: "David Chen",
      role: "Client",
      email_verified: true,
      setup_completed: true,
      status: "Active",
      joined: "Feb 8, 2025, 11:30 AM"
    }
  ];

  // Fetch recent users from backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError(null);
        const response = await apiClient.getUsers();
        const users = Array.isArray(response) ? response : response.users || [];
        
        // Calculate total users and 7-day stats
        const totalUsers = users.length;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const usersLast7Days = users.filter((user: any) => {
          const userCreatedDate = new Date(user.created_at);
          return userCreatedDate >= sevenDaysAgo;
        }).length;
        const userPercentageChange = totalUsers > 0 ? Math.round((usersLast7Days / totalUsers) * 100) : 0;
        
        // Fetch projects data
        const projectsResponse = await apiClient.getAllProjects();
        const projects = Array.isArray(projectsResponse) ? projectsResponse : projectsResponse.projects || [];
        
        // Calculate total in_progress projects and 7-day stats
        const inProgressProjects = projects.filter((p: any) => p.status === 'in_progress');
        const totalProjects = inProgressProjects.length;
        const projectsLast7Days = inProgressProjects.filter((project: any) => {
          const projectCreatedDate = new Date(project.created_at);
          return projectCreatedDate >= sevenDaysAgo;
        }).length;
        const projectPercentageChange = totalProjects > 0 ? Math.round((projectsLast7Days / totalProjects) * 100) : 0;
        
        // Update system stats with real data
        setSystemStats(prev => [
          {
            ...prev[0],
            value: totalUsers.toLocaleString(),
            change: `+${userPercentageChange}%`,
          },
          {
            ...prev[1],
            value: totalProjects.toLocaleString(),
            change: `+${projectPercentageChange}%`,
          },
          ...prev.slice(2)
        ]);
        
        // Get last 5 users (most recent)
        const recent = users.slice(-5).reverse();
        setRecentUsers(recent.map((user: any) => ({
          id: user.id,
          name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
          role: user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User',
          email_verified: user.email_verified === 1 || user.email_verified === true || user.email_verified === '1',
          setup_completed: user.setup_completed === 1 || user.setup_completed === true || user.setup_completed === '1',
          status: 
            !user.email_verified || user.email_verified === 0 ? 'Email Unverified' :
            (user.setup_completed === 1 || user.setup_completed === true || user.setup_completed === '1') ? 'Active' : 'Pending Setup',
          joined: user.created_at
            ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Recently',
        })));
      } catch (error) {
        console.error('Failed to load users:', error);
        console.warn('Using mock data due to API connection issue');
        // Use mock data when API fails
        setRecentUsers(mockRecentUsers);
        setUsersError(null); // Don't show error, just display mock data
        
        // Update system stats with mock data
        setSystemStats(prev => [
          {
            ...prev[0],
            value: "847",
            change: "+12%",
          },
          {
            ...prev[1],
            value: "1,234",
            change: "+8%",
          },
          ...prev.slice(2)
        ]);
        
        toast({ title: 'Demo Mode', description: 'Showing demo data - API connection unavailable', variant: 'default' });
      } finally {
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={'/'}><img src={Logo} alt="" /></Link>
        </div>
        <button
          onClick={() => dispatch(openAdminSidebar(!isOpen))}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-[#226F75]" />
          ) : (
            <Menu className="h-5 w-5 text-[#226F75]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <AdminSidebar active={"dashboard"} />

      {/* Main Content */}
      <div className="flex-1 md:pl-64 w-full">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
            <div className="flex sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto min-w-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 ring-2 ring-[#226F75]/20">
                  <AvatarImage src="https://placehold.net/avatar-4.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-[#226F75] to-[#253E44] text-white">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 md:flex-none">
                  <h1 className="text-base sm:text-lg md:text-2xl font-bold text-[#253E44] truncate">
                    Welcome back, Super Admin
                  </h1>
                </div>
              </div>
            </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* System Stats Overview */}
            <div>
              <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
                System Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 md:gap-4">
                {systemStats.map((stat, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {stat.label}
                          </p>
                          <p className="text-lg md:text-2xl font-bold">
                            {stat.value}
                          </p>
                          <p
                            className={`text-xs md:text-sm ${
                              stat.change.includes("+")
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {stat.change}
                          </p>
                        </div>
                        <stat.icon className="h-6 md:h-8 w-6 md:w-8 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent User Registrations */}
            <div>
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-semibold">
                  Recent User Registrations
                </h2>
                <Badge className="bg-blue-600 text-xs">
                  {recentUsers.length} New
                </Badge>
              </div>
              {usersLoading ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    Loading users...
                  </CardContent>
                </Card>
              ) : usersError ? (
                <Card>
                  <CardContent className="p-6 text-center text-red-500">
                    {usersError}
                  </CardContent>
                </Card>
              ) : recentUsers.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No users found
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {recentUsers.map((user) => (
                    <Card
                      key={user.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-8 md:h-10 w-8 md:w-10 flex-shrink-0">
                              <AvatarFallback className="text-xs bg-gradient-to-br from-[#226F75] to-[#253E44] text-white">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-sm md:text-base">
                                {user.name}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-600">
                                {user.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-wrap justify-between md:justify-start">
                            <Badge
                              variant={
                                user.status === "Verified"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {user.status}
                            </Badge>
                            <span className="text-xs md:text-sm text-gray-500">
                              {user.joined}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm md:text-base">
                    <Clock className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs md:text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>New user registration</span>
                      <span className="text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Project completed</span>
                      <span className="text-gray-500">15 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment processed</span>
                      <span className="text-gray-500">1 hour ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System backup</span>
                      <span className="text-gray-500">2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() =>dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard;
