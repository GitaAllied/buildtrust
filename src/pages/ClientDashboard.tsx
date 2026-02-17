import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Clock,
  Camera,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import ClientSidebar from "@/components/ClientSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openClientSidebar, openSignoutModal } from "@/redux/action";

const PROJECT_PLACEHOLDER = "https://placehold.net/main.svg";

const ClientDashboard = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const dispatch = useDispatch();
  const isOpen = useSelector((state:any) => state.sidebar.clientSidebar)
  const signOutModal = useSelector((state: any) => state.signout);

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
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Mock data for testing when API is not connected
  const mockProjects = [
    {
      id: 1,
      title: "Modern Duplex Development",
      location: "Lekki Phase 1, Lagos",
      progress: 65,
      developer: "Engr. Adewale Construction",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Commercial Plaza Project",
      location: "Victoria Island, Lagos",
      progress: 42,
      developer: "Prime Build Ltd",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Residential Estate Expansion",
      location: "Ikoyi, Lagos",
      progress: 28,
      developer: "Covenant Builders Nigeria",
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",
      status: "Pending",
    },
    {
      id: 4,
      title: "Office Complex Construction",
      location: "Banana Island, Lagos",
      progress: 85,
      developer: "BuildRight Enterprises",
      image:
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop",
      status: "In Progress",
    },
  ];

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
          .filter((p: any) => p.status === "active" || p.status === "open")
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            location: p.location || "TBD",
            progress: p.progress ?? 0, // From milestone calculation
            developer: p.developer_name || "Assigned Developer",
            image: p.media?.url || PROJECT_PLACEHOLDER,
            status: p.status === "open" ? "Pending" : "In Progress",
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
        console.warn("Using mock data due to API connection issue");

        // Use mock data when API fails
        setActiveProjects(mockProjects);
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
          totalInvestment: "₦45.2M",
          completedProjects: 5,
          activeProjectsCount: mockProjects.length,
          avgRating: 4.7,
        });

        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Fetch real notifications based on user DB activity
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      
      try {
        setNotificationsLoading(true);
        const response = await apiClient.getNotifications(user.id);
        
        if (response && response.notifications) {
          // Map the notifications to match the expected format
          const mappedNotifications = response.notifications.map((notif: any, index: number) => ({
            ...notif,
            id: notif.id || `notif-${index}`,
            unread: notif.unread !== false, // default to unread
          }));
          
          setNotifications(mappedNotifications);
          console.log('📬 NOTIFICATIONS FETCHED:', mappedNotifications.length, 'notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to empty notifications if API fails
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 5 minutes
    const notificationInterval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(notificationInterval);
  }, [user?.id]);

  // Protect route: only allow authenticated users with role 'client'
  useEffect(() => {
    if (loading) return; // wait until auth state resolved

    // if (!user) {
    //   navigate('/', {
    //     state: {
    //       message: 'Please log in to access the client dashboard',
    //       messageType: 'info',
    //     },
    //   });
    //   return;
    // }

    // if (user.role !== 'client') {
    //   navigate('/', {
    //     state: {
    //       message:
    //         'The client dashboard is available to client accounts only. Please sign in with a client account or contact support for assistance.',
    //       messageType: 'info',
    //     },
    //   });
    // }
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
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
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

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="Build Trust Africa Logo" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openClientSidebar(!isOpen))}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {isOpen ? (
            <X
              className="h-5 w-5 text-[#226F75]"
            />
          ) : (
            <Menu
              className="h-5 w-5 text-[#226F75]"
            />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <ClientSidebar active={"dashboard"} />

      {/* Main Content */}
      <div className="flex-1 md:pl-64 w-full">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-[70%] md:w-full">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 ring-2 ring-[#226F75]/20">
                <AvatarImage src="https://placehold.net/avatar-4.svg" />
                <AvatarFallback className="bg-gradient-to-br from-[#226F75] to-[#253E44] text-white">
                  DN
                </AvatarFallback>
              </Avatar>
              <div className=" w-[70%]">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-[#253E44] truncate">
                  Welcome, {user?.name || "Client"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Managing {activeProjects.length} active project
                  {activeProjects.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 flex-nowrap">
              <Popover
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 hover:bg-[#226F75]/10"
                  >
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-[#226F75]" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs p-0 flex items-center justify-center">
                      {notifications.filter((n) => n.unread).length}
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-screen h-screen sm:w-80 sm:h-auto p-0 mt-2"
                  side="bottom"
                  align="end"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-[#253E44]">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-screen md:max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            // Mark as read and close dropdown
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.id === notification.id
                                  ? { ...n, unread: false }
                                  : n,
                              ),
                            );
                            setNotificationsOpen(false);
                            // Navigate based on notification type
                            if (notification.title === "New Message") {
                              navigate("/messages");
                            } else if (
                              notification.title === "Payment Reminder"
                            ) {
                              navigate("/payments");
                            } else {
                              navigate("/projects");
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-[#253E44] truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      className="w-full text-xs text-[#226F75] hover:bg-[#226F75]/10"
                    >
                      Mark All As Read
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                onClick={() => navigate("/browse")}
                className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hidden md:block"
              >
                <p className="">Browse Developers</p>
              </Button>
              <Button
                    variant="ghost"
                    size="icon"
                    onClick={()=> navigate("/browse")}
                    className="relative flex-shrink-0 md:hidden"
                  >
                    <Search className=" text-[#226F75]" />
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
                      <h3 className="font-semibold text-sm text-[#253E44]">
                        No active projects found
                      </h3>
                      <p className="text-xs text-gray-600 mt-2">
                        You don't have any active projects right now. Browse
                        developers to request a build or create a new project.
                      </p>
                      <div className="mt-4">
                        <Button
                          onClick={() => navigate("/browse")}
                          className="bg-gradient-to-r from-[#226F75] to-[#253E44] text-white"
                        >
                          Browse Developers
                        </Button>
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
                            src={
                              project.image.length === 0
                                ? PROJECT_PLACEHOLDER
                                : project.image
                            }
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
                                <Badge className="bg-[#226F75]/10 hover:bg-[#226F75]/30 text-[#253E44] text-xs font-medium p-2 px-4">
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
      <SignoutModal
        isOpen={signOutModal}
        onClose={() => dispatch(openSignoutModal(false))}
      />
    </div>
  );
};

export default ClientDashboard;
