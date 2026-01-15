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
  LogOut
} from "lucide-react";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", active: true },
    { id: "users", label: "User Management" },
    { id: "messages", label: "Messages" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "System Settings" },
    { id: "support", label: "Support" }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High server load detected",
      time: "5 minutes ago"
    },
    {
      id: 2,
      type: "info",
      message: "New user registrations spike",
      time: "1 hour ago"
    },
    {
      id: 3,
      type: "error",
      message: "Payment gateway timeout",
      time: "2 hours ago"
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: "John Developer",
      role: "Developer",
      status: "Verified",
      joined: "2 days ago"
    },
    {
      id: 2,
      name: "Sarah Client",
      role: "Client",
      status: "Pending",
      joined: "1 day ago"
    },
    {
      id: 3,
      name: "Mike Contractor",
      role: "Developer",
      status: "Verified",
      joined: "3 days ago"
    }
  ];

  const systemStats = [
    {
      label: "Total Users",
      value: "12,847",
      change: "+12%",
      icon: Users
    },
    {
      label: "Active Projects",
      value: "1,234",
      change: "+8%",
      icon: TrendingUp
    },
    {
      label: "Total Revenue",
      value: "₦45.2M",
      change: "+15%",
      icon: DollarSign
    },
    {
      label: "System Uptime",
      value: "99.9%",
      change: "Stable",
      icon: Shield
    }
  ];

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        break;
      case "users":
        navigate('/admin/users');
        break;
      case "messages":
        navigate('/admin/messages');
        break;
      case "reports":
        navigate('/admin/reports');
        break;
      case "settings":
        navigate('/admin/settings');
        break;
      case "support":
        navigate('/admin/support');
        break;
      default:
        navigate('/super-admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">SA</span>
          </div>
          <span className="font-bold text-sm">Super Admin</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-64 bg-white shadow-sm border-r fixed md:relative top-16 md:top-0 left-0 right-0 z-40 md:z-auto`}>
        <div className="p-6 border-b hidden md:block">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SA</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Super Admin</h2>
              <p className="text-sm text-gray-500">BuildTrust</p>
            </div>
          </button>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavigation(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors text-sm md:text-base ${
                activeTab === item.id
                  ? "bg-red-50 text-red-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <Avatar className="h-10 md:h-12 w-10 md:w-12">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div className="flex-1 md:flex-none">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900">Welcome back, Super Admin</h1>
                  
                </div>
              </div>
              <div className="flex items-center space-x-2 gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/settings')}
                  className="text-xs"
                >
                  System Settings
                </Button>
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
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* System Stats Overview */}
              <div>
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">System Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {systemStats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                            <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                            <p className={`text-xs md:text-sm ${stat.change.includes('+') ? 'text-green-600' : 'text-gray-600'}`}>
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
                  <h2 className="text-base md:text-lg font-semibold">Recent User Registrations</h2>
                  <Badge className="bg-blue-600 text-xs">
                    {recentUsers.length} New
                  </Badge>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {recentUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-8 md:h-10 w-8 md:w-10 flex-shrink-0">
                              <AvatarFallback className="text-xs">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-sm md:text-base">{user.name}</h3>
                              <p className="text-xs md:text-sm text-gray-600">{user.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-wrap">
                            <Badge variant={user.status === "Verified" ? "default" : "secondary"} className="text-xs">
                              {user.status}
                            </Badge>
                            <span className="text-xs md:text-sm text-gray-500">{user.joined}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-4 md:space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm md:text-base">
                    <Settings className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full justify-start text-xs"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/users')}
                  >
                    <Users className="mr-2 h-3 w-3" />
                    Manage Users
                  </Button>
                  <Button
                    className="w-full justify-start text-xs"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/reports')}
                  >
                    <TrendingUp className="mr-2 h-3 w-3" />
                    Generate Reports
                  </Button>
                  <Button
                    className="w-full justify-start text-xs"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/settings')}
                  >
                    <Settings className="mr-2 h-3 w-3" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>

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