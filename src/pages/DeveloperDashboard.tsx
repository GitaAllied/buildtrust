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
  DollarSign
} from "lucide-react";

const DeveloperDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6 border-b">
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
              onClick={() => handleNavigation(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
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
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" />
              <AvatarFallback>EA</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Engr. Adewale</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Trust Score:</span>
                <Progress value={92} className="w-20 h-2" />
                <span className="text-sm font-medium text-green-600">92%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-600">Verified</Badge>
            <Badge variant="outline">
              <Award className="w-3 h-3 mr-1" />
              Top Developer
            </Badge>
            <Button 
              variant="outline"
              onClick={() => navigate('/settings')}
            >
              View Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incoming Project Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Incoming Project Requests</h2>
                <Badge className="bg-blue-600">
                  {projectRequests.length} New
                </Badge>
              </div>
              <div className="space-y-4">
                {projectRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{request.project}</h3>
                            <Badge variant="outline" className="text-xs">
                              {request.received}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Client: {request.client}</p>
                          <p className="text-sm text-gray-600 mb-1">Location: {request.location}</p>
                          <p className="text-sm text-gray-600 mb-3">Timeline: {request.timeline}</p>
                          <p className="text-lg font-semibold text-green-600">{request.budget}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate('/project-requests')}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => navigate('/client-dashboard')}
                          >
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <X className="h-4 w-4" />
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
              <h2 className="text-lg font-semibold mb-4">Ongoing Projects Overview</h2>
              <div className="grid gap-4">
                {ongoingProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{project.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">Client: {project.client}</p>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Deadline: {project.deadline}</span>
                            <span>Last update: {project.lastUpdate}</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
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
                          >
                            Update Progress
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigate('/messages')}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
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
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Camera className="mr-2 h-5 w-5" />
                  Quick Progress Update
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project">Select Project</Label>
                    <Input id="project" placeholder="Choose project..." />
                  </div>
                  <div>
                    <Label htmlFor="milestone">Milestone</Label>
                    <Input id="milestone" placeholder="e.g., Foundation complete" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Progress Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Describe the completed work..."
                    value={uploadProgress}
                    onChange={(e) => setUploadProgress(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photos
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => navigate('/upload-update')}
                  >
                    Submit Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Escrow & Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Escrow & Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Family Duplex</span>
                    <Badge className="bg-green-600">2 of 6 paid</Badge>
                  </div>
                  <Progress value={33} className="h-2" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        Foundation
                      </span>
                      <span className="text-green-600">₦2.8M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        Block Work
                      </span>
                      <span className="text-green-600">₦1.5M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-500 mr-1" />
                        Roofing
                      </span>
                      <span className="text-gray-500">₦3.2M</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
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
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">"{review.review}"</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{review.client}</span>
                      <span>{review.project}</span>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/messages')}
                >
                  Request Testimonial
                </Button>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
  );
};

export default DeveloperDashboard;
