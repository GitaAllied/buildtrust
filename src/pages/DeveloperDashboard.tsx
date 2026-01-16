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
  Menu
} from "lucide-react";

const DeveloperDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", active: true },
    { id: "requests", label: "Project Requests" },
    { id: "projects", label: "Active Projects" },
    { id: "upload", label: "Upload Update" },
    { id: "messages", label: "Messages" },
    { id: "payments", label: "Payments" },
    { id: "profile", label: "Licenses & Profile" },
    { id: "support", label: "Support" }
  ];

  const projectRequests = [
    {
      id: 1,
      client: "Divine Okechukwu",
      project: "Modern Duplex",
      location: "Lekki, Lagos",
      budget: "₦8.5M - ₦12M",
      timeline: "6 months",
      received: "2 hours ago"
    },
    {
      id: 2,
      client: "Sarah Ibrahim",
      project: "Bungalow Renovation",
      location: "Abuja",
      budget: "₦4M - ₦6M",
      timeline: "3 months",
      received: "1 day ago"
    },
    {
      id: 3,
      client: "Michael Eze",
      project: "Commercial Building",
      location: "Port Harcourt",
      budget: "₦20M - ₦30M",
      timeline: "12 months",
      received: "3 days ago"
    }
  ];

  const ongoingProjects = [
    {
      id: 1,
      client: "Chioma Adeleke",
      title: "Family Duplex",
      progress: 65,
      deadline: "Dec 15, 2024",
      lastUpdate: "3 days ago",
      status: "On Track"
    },
    {
      id: 2,
      client: "James Okonkwo",
      title: "Office Complex",
      progress: 30,
      deadline: "Mar 20, 2025",
      lastUpdate: "1 week ago",
      status: "Needs Update"
    }
  ];

  const recentReviews = [
    {
      id: 1,
      client: "Ada Nwosu",
      rating: 5,
      review: "Exceptional work quality and great communication throughout the project.",
      project: "Modern Villa"
    },
    {
      id: 2,
      client: "Kemi Johnson",
      rating: 5,
      review: "Delivered on time and within budget. Highly recommended!",
      project: "Townhouse"
    }
  ];

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        break;
      case "requests":
        navigate('/project-requests');
        break;
      case "projects":
        navigate('/projects');
        break;
      case "upload":
        navigate('/upload-update');
        break;
      case "messages":
        navigate('/messages');
        break;
      case "payments":
        navigate('/payments');
        break;
      case "profile":
        navigate('/settings');
        break;
      case "support":
        navigate('/support');
        break;
      default:
        navigate('/browse');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-[#226F75] to-[#253E44] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">BT</span>
          </div>
          <span className="font-bold text-xs sm:text-sm truncate text-[#226F75]">BuildTrust</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5 text-[#226F75]" /> : <Menu className="h-5 w-5 text-[#226F75]" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed md:relative top-14 md:top-0 left-0 right-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}>
        <div className="p-4 sm:p-6 border-b border-white/20 hidden md:block">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#226F75] to-[#253E44] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">BT</span>
            </div>
            <div className="text-left min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-[#226F75] truncate">BuildTrust</h2>
              <p className="text-xs sm:text-sm text-gray-500">Africa</p>
            </div>
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
              className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-1 transition-all text-xs sm:text-sm font-medium ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 text-[#226F75] border-l-2 border-[#226F75]"
                  : "text-gray-600 hover:bg-[#226F75]/5 hover:text-[#226F75]"
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
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-14 md:top-0 z-30 shadow-sm">
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto min-w-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 ring-2 ring-[#226F75]/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" />
                  <AvatarFallback className="bg-gradient-to-br from-[#226F75] to-[#253E44] text-white">EA</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg md:text-2xl font-bold text-[#253E44] truncate">Welcome back, {user?.name || "Developer"}</h1>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-xs sm:text-sm text-gray-500">Trust Score:</span>
                    <Progress value={92} className="w-12 sm:w-16 md:w-20 h-2.5 bg-[#226F75]/10" />
                    <span className="text-xs sm:text-sm font-medium text-[#226F75]">92%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap w-full sm:w-auto">
                <Badge className="bg-gradient-to-r from-[#226F75] to-[#253E44] text-white text-xs shadow-md">Verified</Badge>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs gap-1 shadow-md">
                  <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  Top
                </Badge>
                <Button 
                  className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs shadow-md"
                  size="sm"
                  onClick={() => navigate('/settings')}
                >
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              {/* Incoming Project Requests */}
              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#253E44]">Incoming Project Requests</h2>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs shadow-md">
                    {projectRequests.length} New
                  </Badge>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  {projectRequests.map((request) => (
                    <Card key={request.id} className="hover:shadow-xl transition-all duration-300 border border-white/50 bg-white/80 rounded-2xl overflow-hidden group">
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <h3 className="font-bold text-xs sm:text-sm md:text-base text-[#253E44] truncate">{request.project}</h3>
                              <Badge className="bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 text-[#226F75] text-xs font-medium flex-shrink-0">
                                {request.received}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">Client: <span className="font-medium text-[#226F75]">{request.client}</span></p>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">Location: <span className="font-medium text-gray-700">{request.location}</span></p>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3">Timeline: <span className="font-medium text-gray-700">{request.timeline}</span></p>
                            <p className="text-sm sm:text-base md:text-lg font-bold text-[#226F75] bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 inline-block px-3 py-2 rounded-lg">{request.budget}</p>
                          </div>
                          <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[100px]">
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs w-full sm:w-auto shadow-md"
                              onClick={() => navigate('/project-requests')}
                            >
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white text-xs w-full sm:w-auto shadow-md"
                              onClick={() => navigate('/client-dashboard')}
                            >
                              Accept
                            </Button>
                            <Button size="sm" className="text-red-600 hover:bg-red-50 border-red-200 text-xs w-full sm:w-auto" variant="outline">
                              <X className="h-3 w-3" />
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
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#253E44] mb-4 px-1">Ongoing Projects Overview</h2>
                <div className="space-y-4 sm:space-y-5">
                  {ongoingProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border border-white/50 bg-white/80 rounded-2xl overflow-hidden group">
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xs sm:text-sm md:text-base text-[#253E44] mb-2 truncate">{project.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3">Client: <span className="font-medium text-gray-700">{project.client}</span></p>
                            
                            <div className="mb-4">
                              <div className="flex justify-between text-xs sm:text-sm mb-2 text-[#226F75] font-medium">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2.5 bg-[#226F75]/10" />
                            </div>
                            
                            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 flex-wrap">
                              <span>Deadline: {project.deadline}</span>
                              <span>Last update: {project.lastUpdate}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[120px]">
                            <Badge 
                              className={project.status === "On Track" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md" : "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md"}
                            >
                              {project.status}
                            </Badge>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs w-full shadow-md"
                              onClick={() => navigate('/upload-update')}
                            >
                              Update Progress
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-white/50 border border-white/50 hover:bg-[#226F75]/10 text-[#226F75] font-medium text-xs w-full"
                              onClick={() => navigate('/messages')}
                            >
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Upload Progress Card */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
                  <CardTitle className="flex items-center text-xs sm:text-sm md:text-base text-blue-800 gap-2">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Quick Progress Update
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="project" className="text-xs sm:text-sm">Select Project</Label>
                      <Input id="project" placeholder="Choose project..." className="text-xs h-9" />
                    </div>
                    <div>
                      <Label htmlFor="milestone" className="text-xs sm:text-sm">Milestone</Label>
                      <Input id="milestone" placeholder="e.g., Foundation complete" className="text-xs h-9" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-xs sm:text-sm">Progress Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Describe the completed work..."
                      value={uploadProgress}
                      onChange={(e) => setUploadProgress(e.target.value)}
                      className="text-xs min-h-20"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">
                      <Upload className="mr-1 h-3 w-3" />
                      Upload Photos
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-xs w-full sm:w-auto"
                      size="sm"
                      onClick={() => navigate('/upload-update')}
                    >
                      Submit Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Escrow & Payments */}
              <Card>
                <CardHeader className="pb-3 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
                  <CardTitle className="flex items-center text-xs sm:text-sm md:text-base gap-2">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Escrow & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs sm:text-sm px-3 sm:px-4 md:px-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span>Family Duplex</span>
                      <Badge className="bg-green-600 text-xs">2 of 6 paid</Badge>
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
                      onClick={() => navigate('/payments')}
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
                <CardContent className="space-y-3 px-3 sm:px-4 md:px-6 overflow-y-auto max-h-48 sm:max-h-56">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">"{review.review}"</p>
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
                    onClick={() => navigate('/messages')}
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
    </div>
  );
};

export default DeveloperDashboard;
