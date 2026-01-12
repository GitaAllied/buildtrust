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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">BT</span>
          </div>
          <span className="font-bold text-sm">BuildTrust</span>
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
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">BT</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">BuildTrust</h2>
              <p className="text-sm text-gray-500">Africa</p>
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
                  ? "bg-green-50 text-green-700 font-medium"
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
                  <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" />
                  <AvatarFallback>EA</AvatarFallback>
                </Avatar>
                <div className="flex-1 md:flex-none">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900">Welcome back, Engr. Adewale</h1>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-xs md:text-sm text-gray-500">Trust Score:</span>
                    <Progress value={92} className="w-12 md:w-20 h-2" />
                    <span className="text-xs md:text-sm font-medium text-green-600">92%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 gap-2 flex-wrap">
                <Badge className="bg-green-600 text-xs">Verified</Badge>
                <Badge variant="outline" className="text-xs">
                  <Award className="w-2 h-2 mr-1" />
                  Top Developer
                </Badge>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/settings')}
                  className="text-xs"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Incoming Project Requests */}
              <div>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h2 className="text-base md:text-lg font-semibold">Incoming Project Requests</h2>
                  <Badge className="bg-blue-600 text-xs">
                    {projectRequests.length} New
                  </Badge>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {projectRequests.map((request) => (
                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-sm md:text-base">{request.project}</h3>
                              <Badge variant="outline" className="text-xs">
                                {request.received}
                              </Badge>
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 mb-1">Client: {request.client}</p>
                            <p className="text-xs md:text-sm text-gray-600 mb-1">Location: {request.location}</p>
                            <p className="text-xs md:text-sm text-gray-600 mb-2">Timeline: {request.timeline}</p>
                            <p className="text-base md:text-lg font-semibold text-green-600">{request.budget}</p>
                          </div>
                          <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate('/project-requests')}
                              className="text-xs"
                            >
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-xs"
                              onClick={() => navigate('/client-dashboard')}
                            >
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 text-xs">
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
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Ongoing Projects Overview</h2>
                <div className="grid gap-3 md:gap-4">
                  {ongoingProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm md:text-base mb-1">{project.title}</h3>
                            <p className="text-xs md:text-sm text-gray-600 mb-2">Client: {project.client}</p>
                            
                            <div className="mb-3">
                              <div className="flex justify-between text-xs md:text-sm mb-1">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-500 flex-wrap">
                              <span>Deadline: {project.deadline}</span>
                              <span>Last update: {project.lastUpdate}</span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 w-full md:w-auto">
                            <Badge 
                              variant={project.status === "On Track" ? "default" : "destructive"}
                              className={project.status === "On Track" ? "bg-green-600" : ""}
                            >
                              {project.status}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate('/upload-update')}
                              className="text-xs"
                            >
                              Update Progress
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => navigate('/messages')}
                              className="text-xs"
                            >
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Message Client
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
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm md:text-base text-blue-800">
                    <Camera className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                    Quick Progress Update
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="project" className="text-xs md:text-sm">Select Project</Label>
                      <Input id="project" placeholder="Choose project..." className="text-xs" />
                    </div>
                    <div>
                      <Label htmlFor="milestone" className="text-xs md:text-sm">Milestone</Label>
                      <Input id="milestone" placeholder="e.g., Foundation complete" className="text-xs" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-xs md:text-sm">Progress Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Describe the completed work..."
                      value={uploadProgress}
                      onChange={(e) => setUploadProgress(e.target.value)}
                      className="text-xs min-h-20"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Upload className="mr-1 h-3 w-3" />
                      Upload Photos
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-xs"
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
            <div className="space-y-4 md:space-y-6">
              {/* Escrow & Payments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm md:text-base">
                    <DollarSign className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                    Escrow & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs md:text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Family Duplex</span>
                      <Badge className="bg-green-600 text-xs">2 of 6 paid</Badge>
                    </div>
                    <Progress value={33} className="h-2" />
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                          Foundation
                        </span>
                        <span className="text-green-600">₦2.8M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                          Block Work
                        </span>
                        <span className="text-green-600">₦1.5M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 text-orange-500 mr-1" />
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
                <CardHeader>
                  <CardTitle className="flex items-center text-sm md:text-base">
                    <Star className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 md:h-4 md:w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mb-1">"{review.review}"</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{review.client}</span>
                        <span>{review.project}</span>
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
                <CardHeader>
                  <CardTitle className="flex items-center text-sm md:text-base">
                    <TrendingUp className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs md:text-sm">
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
