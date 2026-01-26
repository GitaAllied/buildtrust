import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Star,
  Upload,
  MessageSquare,
  Clock,
  CheckCircle,
  X,
  Camera,
  TrendingUp,
  Award,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Shield,
  AlertTriangle,
  Menu,
  LogOut,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBook,
  FaDoorOpen,
  FaGear,
  FaHandshake,
  FaMessage,
  FaUser,
  FaUsers,
} from "react-icons/fa6";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser />, active: true },
    { id: "users", label: "User Management", icon: <FaUsers /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "reports", label: "Reports", icon: <FaBook /> },
    { id: "settings", label: "System Settings", icon: <FaGear /> },
    { id: "support", label: "Support", icon: <FaHandshake /> },
    { id: "logout", label: "Sign Out", action: "logout", icon: <FaDoorOpen /> },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High server load detected",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "info",
      message: "New user registrations spike",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "error",
      message: "Payment gateway timeout",
      time: "2 hours ago",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "John Developer",
      role: "Developer",
      status: "Verified",
      joined: "2 days ago",
    },
    {
      id: 2,
      name: "Sarah Client",
      role: "Client",
      status: "Pending",
      joined: "1 day ago",
    },
    {
      id: 3,
      name: "Mike Contractor",
      role: "Developer",
      status: "Verified",
      joined: "3 days ago",
    },
  ];

  const systemStats = [
    {
      label: "Total Users",
      value: "12,847",
      change: "+12%",
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
  ];

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/super-admin-dashboard")
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "messages":
        navigate("/admin/messages");
        break;
      case "reports":
        navigate("/admin/reports");
        break;
      case "settings":
        navigate("/admin/settings");
        break;
      case "support":
        navigate("/admin/support");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        navigate("/super-admin-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <img src={Logo} alt="" />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-[#226F75]" />
          ) : (
            <Menu className="h-5 w-5 text-[#226F75]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed top-14 md:top-0 left-0 right-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}
      >
        <div className="p-4 sm:p-6 border-b border-white/20 hidden md:block">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full"
          >
            <img src={Logo} alt="" className="w-[55%]" />
          </button>
        </div>
        <nav className="p-3 sm:p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavigation(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-1 transition-all text-xs sm:text-sm font-medium flex gap-2 items-center ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 text-[#226F75] border-[#226F75]"
                  : "text-gray-600 hover:bg-[#226F75]/5 hover:text-[#226F75]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64 w-full">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
            <div className="flex sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto min-w-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 ring-2 ring-[#226F75]/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
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
              <div className="hidden md:flex items-center space-x-2 gap-2 flex-wrap">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs flex items-center gap-1"
                >
                  <LogOut className="h-3 w-3" />
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
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
                            <AvatarFallback className="text-xs">
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
    </div>
  );
};

export default SuperAdminDashboard;
