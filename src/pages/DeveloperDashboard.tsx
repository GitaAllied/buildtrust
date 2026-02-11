import { useState, useEffect } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Star,
  Upload,
  MessageSquare,
  Clock,
  CheckCircle,
  X,
  Camera,
  TrendingUp,
  DollarSign,
  Menu,
  Bell,
  Image,
  Video,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import DeveloperSidebar from "@/components/DeveloperSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openDeveloperSidebar, openSignoutModal } from "@/redux/action";
import { FaMoneyBill } from "react-icons/fa6";

const DeveloperDashboard = () => {
  const [uploadProgress, setUploadProgress] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Project Update",
      message: "Foundation work completed on Modern Duplex",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment Reminder",
      message: "Milestone payment due for Commercial Plaza",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 3,
      title: "New Message",
      message: "Engr. Adewale sent you a message",
      time: "3 days ago",
      unread: false,
    },
    {
      id: 4,
      title: "Project Update",
      message: "Foundation work completed on Modern Duplex",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 5,
      title: "Payment Reminder",
      message: "Milestone payment due for Commercial Plaza",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 6,
      title: "New Message",
      message: "Engr. Adewale sent you a message",
      time: "3 days ago",
      unread: false,
    },
  ]);
  const dispatch = useDispatch();
  const isOpen = useSelector((state: any) => state.sidebar.developerSidebar);
  const signOutModal = useSelector((state: any) => state.signout);

  const projectRequests = [
    {
      id: 1,
      client: "Divine Okechukwu",
      project: "Modern Duplex",
      location: "Lekki, Lagos",
      budget: "₦8.5M - ₦12M",
      timeline: "6 months",
      received: "2 hours ago",
    },
    {
      id: 2,
      client: "Sarah Ibrahim",
      project: "Bungalow Renovation",
      location: "Abuja",
      budget: "₦4M - ₦6M",
      timeline: "3 months",
      received: "1 day ago",
    },
    {
      id: 3,
      client: "Michael Eze",
      project: "Commercial Building",
      location: "Port Harcourt",
      budget: "₦20M - ₦30M",
      timeline: "12 months",
      received: "3 days ago",
    },
  ];

  const ongoingProjects = [
    {
      id: 1,
      client: "Chioma Adeleke",
      title: "Family Duplex",
      progress: 65,
      deadline: "Dec 15, 2024",
      lastUpdate: "3 days ago",
      status: "On Track",
    },
    {
      id: 2,
      client: "James Okonkwo",
      title: "Office Complex",
      progress: 30,
      deadline: "Mar 20, 2025",
      lastUpdate: "1 week ago",
      status: "Needs Update",
    },
  ];

  const recentReviews = [
    {
      id: 1,
      client: "Ada Nwosu",
      rating: 5,
      review:
        "Exceptional work quality and great communication throughout the project.",
      project: "Modern Villa",
    },
    {
      id: 2,
      client: "Kemi Johnson",
      rating: 5,
      review: "Delivered on time and within budget. Highly recommended!",
      project: "Townhouse",
    },
  ];

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Add new files to existing ones
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Generate previews
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [
          ...prev,
          {
            url: reader.result as string,
            type: file.type.startsWith("video") ? "video" : "image",
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
  };

  // Protect route: only allow authenticated users with role 'developer'
  useEffect(() => {
    if (loading) return; // wait until auth state resolved

    // if (!user) {
    //   navigate('/', {
    //     state: {
    //       message: 'Please log in to access the developer dashboard',
    //       messageType: 'info',
    //     },
    //   });
    //   return;
    // }

    // if (user.role !== 'developer') {
    //   navigate('/', {
    //     state: {
    //       message:
    //         'The developer dashboard is available to developer accounts only. Please sign in with a developer account or contact support for assistance.',
    //       messageType: 'info',
    //     },
    //   });
    // }
  }, [user, loading, navigate]);

  // Show spinner while auth is being refreshed
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
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openDeveloperSidebar(!isOpen))}
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
      <DeveloperSidebar active={"dashboard"} />

      {/* Main Content */}
      <div className="flex-1 w-full md:pl-64">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto min-w-0">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 ring-2 ring-[#226F75]/20">
                <AvatarImage src="https://placehold.net/avatar-4.svg" />
                <AvatarFallback className="bg-gradient-to-br from-[#226F75] to-[#253E44] text-white">
                  EA
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-[#253E44] truncate">
                  Welcome back, {user?.name || "Developer"}
                </h1>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className="text-xs sm:text-sm text-gray-500">
                    Trust Score:
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#226F75]">
                    92%
                  </span>
                </div>
              </div>
            </div>
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
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-3 sm:space-y-4 md:space-y-6">
              {/* Incoming Project Requests */}
              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#253E44]">
                    Incoming Project Requests
                  </h2>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs shadow-md">
                    {projectRequests.length} New
                  </Badge>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  {projectRequests.map((request) => (
                    <Card
                      key={request.id}
                      className="hover:shadow-xl transition-all duration-300 border border-white/50 bg-white/80 rounded-2xl overflow-hidden group w-full"
                    >
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="flex flex-col justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap justify-between">
                              <h3 className="font-bold text-xs sm:text-sm md:text-base text-[#253E44] truncate">
                                {request.project}
                              </h3>
                              <Badge className="bg-[#226F75]/10 text-[#226F75] text-xs font-medium flex-shrink-0">
                                {request.received}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                              Client:{" "}
                              <span className="font-medium">
                                {request.client}
                              </span>
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                              Location:{" "}
                              <span className="font-medium">
                                {request.location}
                              </span>
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                              Timeline:{" "}
                              <span className="font-medium">
                                {request.timeline}
                              </span>
                            </p>
                            <p className="text-sm sm:text-base md:text-lg font-bold text-[#226F75]">
                              {request.budget}
                            </p>
                          </div>
                          <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full sm:w-auto min-w-[100px]">
                            <Button
                              size="sm"
                              className=" bg-transparent text-[#253E44] hover:bg-[#226F75]/10 border border-gray-100 text-xs w-full sm:w-[33%] shadow-md"
                              onClick={() => navigate("/project-requests")}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-400 text-xs w-full sm:w-[33%] shadow-md"
                              onClick={() => navigate("/active-projects")}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-400 text-xs w-full sm:w-[33%] shadow-md text-white"
                              variant="outline"
                            >
                              {/* <X className="h-3 w-3" /> */}
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Ongoing Projects */}
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#253E44] mb-4 px-1">
                  Ongoing Projects Overview
                </h2>
                <div className="space-y-4 sm:space-y-5">
                  {ongoingProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="hover:shadow-xl transition-all duration-300 border border-white/50 bg-white/80 rounded-2xl overflow-hidden group"
                    >
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex-1 min-w-0">
                            <div className=" flex justify-between">
                              <div>
                                <h3 className="font-bold text-xs sm:text-sm md:text-base text-[#253E44] mb-2 truncate">
                                  {project.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                                  Client:{" "}
                                  <span className="font-medium text-gray-700">
                                    {project.client}
                                  </span>
                                </p>
                              </div>
                              <Badge
                                className={`
                                ${
                                  project.status === "On Track"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                                    : "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md"
                                }
                              w-fit h-fit p-1.5 px-4`}
                              >
                                {project.status}
                              </Badge>
                            </div>

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

                            <div className="flex items-center gap-4 sm:gap-5 text-xs sm:text-sm text-gray-500 flex-wrap">
                              <span>Deadline: {project.deadline}</span>
                              <span>Last update: {project.lastUpdate}</span>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between gap-2 w-full">
                            <div className=" flex flex-col md:flex-row md:justify-between items-center gap-2 w-full">
                              <Button
                                size="sm"
                                className="bg-[#226F75] border border-gray-100 bg-opacity-10 text-[#253E44] w-full md:px-5 md:w-[49%] hover:bg-[#226F75]/30"
                                onClick={() => navigate("/upload-update")}
                              >
                                Update Progress
                              </Button>
                              <Button
                                size="sm"
                                className="bg-[#226F75] border border-gray-100 bg-opacity-10 text-[#253E44] w-full md:w-[49%] md:px-5 hover:bg-[#226F75]/30"
                                onClick={() => navigate("/developer-messages")}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Upload Progress Card */}
              <Card className="border-[#226F75]/20 bg-[#226F75]/5">
                <CardHeader className="pb-3 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
                  <CardTitle className="flex items-center text-xs sm:text-sm md:text-base text-[#253E44] gap-2">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Quick Progress Update
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="project" className="text-xs sm:text-sm">
                        Select Project
                      </Label>
                      <Input
                        id="project"
                        placeholder="Choose project..."
                        className="text-xs h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="milestone" className="text-xs sm:text-sm">
                        Milestone
                      </Label>
                      <Input
                        id="milestone"
                        placeholder="e.g., Foundation complete"
                        className="text-xs h-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-xs sm:text-sm">
                      Progress Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the completed work..."
                      value={uploadProgress}
                      onChange={(e) => setUploadProgress(e.target.value)}
                      className="text-xs min-h-20"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-start sm:items-center gap-2 w-full justify-between">
                    <button
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors w-full md:w-[49%]"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photos/Videos
                    </button>

                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      className="bg-[#226F75] hover:bg-[#226F75]/70 text-xs w-full sm:w-auto md:w-[49%]"
                      size="sm"
                      onClick={() => navigate("/upload-update")}
                    >
                      Submit Update
                    </Button>
                  </div>
                  {files.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {files.length} file{files.length !== 1 ? "s" : ""}{" "}
                        selected
                      </span>
                      <button
                        onClick={clearAll}
                        className="text-sm text-red-600 hover:text-red-700 underline"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                  {files.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Selected Files:
                      </h3>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            {file.type.startsWith("image") ? (
                              <Image className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            ) : (
                              <Video className="h-5 w-5 text-purple-600 flex-shrink-0" />
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>

                            <button
                              onClick={() => removeFile(index)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-2">
              {/* Escrow & Payments */}
              <Card>
                <CardHeader className="pb-3 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
                  <CardTitle className="flex items-center text-xs sm:text-sm md:text-base gap-2">
                    <FaMoneyBill className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Escrow & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs sm:text-sm px-3 sm:px-4 md:px-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span>Family Duplex</span>
                      <Badge className="bg-green-600 text-xs">
                        2 of 6 paid
                      </Badge>
                    </div>
                    <Progress value={33} className="h-2" />

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          Foundation
                        </span>
                        <span className="text-green-600">₦2.8M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          Block Work
                        </span>
                        <span className="text-green-600">₦1.5M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-orange-500 flex-shrink-0" />
                          Roofing
                        </span>
                        <span className="text-gray-500">₦3.2M</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full text-xs"
                      size="sm"
                      onClick={() => navigate("/developer-payments")}
                    >
                      View All Payments
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Ratings & Reviews */}
              <Card>
                <CardHeader className="pb-3 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
                  <CardTitle className="flex items-center text-xs sm:text-sm md:text-base gap-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-3 sm:px-4 md:px-6">
                  {recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">
                        "{review.review}"
                      </p>
                      <div className="flex justify-between text-xs text-gray-500 gap-1">
                        <span>{review.client}</span>
                        <span className="text-right">{review.project}</span>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full text-xs"
                    size="sm"
                    onClick={() => navigate("/developer-messages")}
                  >
                    Request Testimonial
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card>
                <CardHeader className="pb-3 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
                  <CardTitle className="flex items-center text-xs sm:text-sm md:text-base gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs sm:text-sm px-3 sm:px-4 md:px-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects Completed</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold">4.9/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On-time Delivery</span>
                    <span className="font-semibold">96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold">2.3 hrs</span>
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

export default DeveloperDashboard;
