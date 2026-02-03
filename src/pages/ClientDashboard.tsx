import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Clock,
  Camera,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaDoorOpen,
  FaFileContract,
  FaGear,
  FaMessage,
  FaMoneyBill,
  FaUser,
  FaUserGear,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const PROJECT_PLACEHOLDER = 'https://placehold.net/main.svg';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  // Dynamic state for user data
  const [activeProjects, setActiveProjects] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalInvestment: "₦0",
    completedProjects: 0,
    activeProjectsCount: 0,
    avgRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch current user data to ensure it's fresh
        const currentUser = await apiClient.getCurrentUser();

        // Fetch real client projects from the database
        const projectsResponse = await apiClient.getClientProjects();
        const projectsData = projectsResponse.projects || [];

        // Transform projects to match dashboard format
        const activeProjects = projectsData
          .filter((p: any) => p.status === 'active' || p.status === 'open')
            .map((p: any) => ({
            id: p.id,
            title: p.title,
            location: p.location || 'TBD',
            progress: p.progress ?? 0, // From milestone calculation
            developer: p.developer_name || 'Assigned Developer',
              image: p.media?.url || PROJECT_PLACEHOLDER,
            status: p.status === 'open' ? 'Pending' : 'In Progress',
          }));

        setActiveProjects(activeProjects);

        setRecentUpdates([
          {
            id: 1,
            project: "Modern Duplex",
            type: "photo",
            timestamp: "2 hours ago",
            image:
              "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&h=150&fit=crop",
          },
          {
            id: 2,
            project: "Commercial Plaza",
            type: "video",
            timestamp: "1 day ago",
            image:
              "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=150&h=150&fit=crop",
          },
          {
            id: 3,
            project: "Modern Duplex",
            type: "photo",
            timestamp: "3 days ago",
            image:
              "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150&h=150&fit=crop",
          },
        ]);

        setMessages([
          {
            id: 1,
            developer: "Engr. Adewale",
            lastMessage: "Foundation work completed ahead of schedule!",
            time: "1h ago",
            unread: true,
          },
          {
            id: 2,
            developer: "Prime Build Ltd",
            lastMessage: "Site survey documents ready for review",
            time: "3h ago",
            unread: false,
          },
          {
            id: 3,
            developer: "Covenant Builders",
            lastMessage: "Thank you for choosing our services",
            time: "2 days ago",
            unread: false,
          },
        ]);

        setStats({
          totalInvestment: "₦25.4M",
          completedProjects: 3,
          activeProjectsCount: activeProjects.length,
          avgRating: 4.8,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Protect route: only allow authenticated users with role 'client'
  useEffect(() => {
    if (loading) return; // wait until auth state resolved

    if (!user) {
      navigate('/', {
        state: {
          message: 'Please log in to access the client dashboard',
          messageType: 'info',
        },
      });
      return;
    }

    if (user.role !== 'client') {
      navigate('/', {
        state: {
          message:
            'The client dashboard is available to client accounts only. Please sign in with a client account or contact support for assistance.',
          messageType: 'info',
        },
      });
    }
  }, [user, loading, navigate]);

  // Show a spinner/placeholder while auth is being refreshed
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#226F75]/10">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-[#226F75] mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="mt-3 text-sm text-gray-600">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/client-dashboard");
        break;
      case "projects":
        navigate("/projects");
        break;
      case "payments":
        navigate("/payments");
        break;
      case "messages":
        navigate("/messages");
        break;
      case "contracts":
        navigate("/contracts");
        break;
      case "saved":
        navigate("/saved-developers");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        navigate("/browse");
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser />, active: true },
    { id: "projects", label: "Projects", icon: <FaBriefcase /> },
    { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "contracts", label: "Contracts", icon: <FaFileContract /> },
    { id: "saved", label: "Saved Developers", icon: <FaUserGear /> },
    { id: "settings", label: "Settings", icon: <FaGear /> },
    { id: "logout", label: "Sign Out", action: "logout", icon: <FaDoorOpen /> },
  ];

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <Link to={'/'}><img src={Logo} alt="Build Trust Africa Logo" /></Link>
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
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
          >
            <Link to={'/'}><img src={Logo} alt="" className="w-[55%]" /></Link>
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
              className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center ${
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
          <div className="flex flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto min-w-0">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 ring-2 ring-[#226F75]/20 hidden md:flex">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                <AvatarFallback className="bg-gradient-to-br from-[#226F75] to-[#253E44] text-white">
                  DN
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-[#253E44] truncate">
                  Welcome, {user?.name || "Client"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Managing {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
              <Button
                variant="ghost"
                size="icon"
                className="relative flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 hover:bg-[#226F75]/10"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-[#226F75]" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
              <Button
                onClick={() => navigate("/browse")}
                className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
              >
                Browse Developers
              </Button>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 bg-[#226F75]/3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              {/* Active Projects */}
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#253E44] mb-4 px-1">
                  Active Projects
                </h2>
                {activeProjects.length === 0 && !isLoading ? (
                  <Card className="bg-white/90 rounded-2xl border border-black/5">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-sm text-[#253E44]">No active projects found</h3>
                      <p className="text-xs text-gray-600 mt-2">You don't have any active projects right now. Browse developers to request a build or create a new project.</p>
                      <div className="mt-4">
                        <Button onClick={() => navigate('/browse')} className="bg-gradient-to-r from-[#226F75] to-[#253E44] text-white">Browse Developers</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 sm:gap-5">
                    {activeProjects.map((project) => (
                      <Card
                        key={project.id}
                        className="hover:shadow-xl transition-all duration-300 border border-black/10 bg-white/80 rounded-2xl overflow-hidden group"
                      >
                        <CardContent className="p-4 sm:p-2 md:p-3 flex flex-col md:flex-row gap-5">
                          <img
                            src={project.image.length === 0 ? PROJECT_PLACEHOLDER : project.image}
                            alt={project.title}
                            onError={(e: any) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = PROJECT_PLACEHOLDER;
                            }}
                            className="w-full sm:w-32 md:w-40 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-sm sm:text-base text-[#253E44] line-clamp-2">
                                {project.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 mb-2">
                                {project.location}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-1">
                                Developer: {project.developer}
                              </p>

                              <div className="mb-4">
                                <div className="flex justify-between text-xs sm:text-sm mb-2 text-[#226F75] font-medium">
                                  <span>Progress</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <Progress
                                  value={project.progress}
                                  className="h-2.5 bg-[#226F75]/10"
                                />
                              </div>

                              <div className="flex flex-row items-start sm:items-center justify-between gap-2">
                                <Badge className="bg-[#226F75]/10 text-[#253E44] text-xs font-medium p-2 px-4">
                                  {project.status}
                                </Badge>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs sm:w-auto shadow-md px-5"
                                  onClick={() => navigate("/projects")}
                                >
                                  View Project{" "}
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Milestone */}
              <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 sm:pb-4 border-b border-orange-100/50">
                  <CardTitle className="flex items-center text-sm sm:text-base text-orange-700 gap-2 font-bold">
                    <div className="p-2 bg-orange-200/50 rounded-lg">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    </div>
                    <span>Upcoming Milestone Action</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-gray-900">
                        Approve payment for roofing
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-[#226F75] mt-1">
                        ₦3,200,000
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                        Modern Duplex in Lekki
                      </p>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs sm:text-sm w-full sm:w-auto flex-shrink-0 shadow-md"
                      onClick={() => navigate("/payments")}
                    >
                      <CheckCircle className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                      Approve Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Updates */}
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#253E44] mb-4 px-1">
                  Recent Updates
                </h2>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                  {recentUpdates.map((update) => (
                    <Card
                      key={update.id}
                      className="flex-shrink-0 w-40 sm:w-48 md:w-56 hover:shadow-xl transition-all border border-white/50 bg-white/80 rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => navigate("/projects")}
                    >
                      <CardContent className="p-3">
                        <div className="relative mb-3 overflow-hidden rounded-lg">
                          <img
                            src={update.image}
                            alt="Update"
                            className="w-full h-24 sm:h-28 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-[#226F75] to-[#253E44] text-white text-xs gap-1 shadow-md">
                            <Camera className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            {update.type}
                          </Badge>
                        </div>
                        <p className="font-semibold text-xs sm:text-sm text-[#253E44] line-clamp-1">
                          {update.project}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {update.timestamp}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Messages Preview */}
              <Card className="border border-white/50 bg-white/80 rounded-2xl shadow-md overflow-hidden">
                <CardHeader className="pb-3 sm:pb-4 border-b border-white/50 bg-gradient-to-r from-[#226F75]/5 to-[#253E44]/5">
                  <CardTitle className="flex items-center text-sm sm:text-base gap-2 text-[#226F75] font-bold">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 max-h-80 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="p-2 sm:p-3 md:p-4 border-b border-white/50 last:border-b-0 hover:bg-[#226F75]/5 cursor-pointer text-xs sm:text-sm transition-colors"
                      onClick={() => navigate("/messages")}
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 ring-1 ring-[#226F75]/20">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-[#226F75] to-[#253E44] text-white">
                            {message.developer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-semibold text-xs sm:text-sm text-[#253E44] truncate">
                              {message.developer}
                            </p>
                            <p className="text-xs text-gray-500 flex-shrink-0">
                              {message.time}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                            {message.lastMessage}
                          </p>
                          {message.unread && (
                            <Badge className="mt-1.5 bg-gradient-to-r from-[#226F75] to-[#253E44] text-white text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-2 sm:p-3 md:p-4 border-t border-white/50 bg-gradient-to-r from-[#226F75]/5 to-[#253E44]/5">
                    <Button
                      className="w-full text-xs sm:text-sm bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white shadow-sm"
                      onClick={() => navigate("/messages")}
                    >
                      Open All Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border border-white/50 bg-white/80 rounded-2xl shadow-md">
                <CardHeader className="pb-3 sm:pb-4 border-b border-white/50 bg-gradient-to-r from-[#226F75]/5 to-[#253E44]/5">
                  <CardTitle className="text-sm sm:text-base text-[#226F75] font-bold">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 pt-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Total Investment</span>
                    <span className="font-bold text-[#226F75] truncate">
                      {stats.totalInvestment}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm border-t border-white/50 pt-3">
                    <span className="text-gray-600">Projects Completed</span>
                    <span className="font-bold text-[#253E44]">
                      {stats.completedProjects}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm border-t border-white/50 pt-3">
                    <span className="text-gray-600">Active Projects</span>
                    <span className="font-bold text-[#253E44]">
                      {stats.activeProjectsCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm border-t border-white/50 pt-3">
                    <span className="text-gray-600">Avg. Rating Given</span>
                    <span className="font-bold text-[#226F75]">
                      {stats.avgRating}/5
                    </span>
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

export default ClientDashboard;
