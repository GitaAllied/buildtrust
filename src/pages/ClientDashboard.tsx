import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, ArrowRight, CheckCircle, Clock, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", active: true },
    { id: "projects", label: "Projects" },
    { id: "payments", label: "Payments" },
    { id: "messages", label: "Messages" },
    { id: "contracts", label: "Contracts" },
    { id: "saved", label: "Saved Developers" },
    { id: "settings", label: "Settings" }
  ];

  const activeProjects = [
    {
      id: 1,
      title: "Modern Duplex in Lekki",
      location: "Lekki, Lagos",
      progress: 45,
      developer: "Engr. Adewale Structures",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop",
      status: "Foundation Complete"
    },
    {
      id: 2,
      title: "Commercial Plaza",
      location: "Victoria Island, Lagos",
      progress: 20,
      developer: "Prime Build Ltd",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop",
      status: "Site Preparation"
    }
  ];

  const recentUpdates = [
    {
      id: 1,
      project: "Modern Duplex",
      type: "photo",
      timestamp: "2 hours ago",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      project: "Commercial Plaza",
      type: "video",
      timestamp: "1 day ago",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=150&h=150&fit=crop"
    },
    {
      id: 3,
      project: "Modern Duplex",
      type: "photo",
      timestamp: "3 days ago",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150&h=150&fit=crop"
    }
  ];

  const messages = [
    {
      id: 1,
      developer: "Engr. Adewale",
      lastMessage: "Foundation work completed ahead of schedule!",
      time: "1h ago",
      unread: true
    },
    {
      id: 2,
      developer: "Prime Build Ltd",
      lastMessage: "Site survey documents ready for review",
      time: "3h ago",
      unread: false
    },
    {
      id: 3,
      developer: "Covenant Builders",
      lastMessage: "Thank you for choosing our services",
      time: "2 days ago",
      unread: false
    }
  ];

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        break;
      case "projects":
        navigate('/projects');
        break;
      case "payments":
        navigate('/payments');
        break;
      case "messages":
        navigate('/messages');
        break;
      case "contracts":
        navigate('/contracts');
        break;
      case "saved":
        navigate('/saved-developers');
        break;
      case "settings":
        navigate('/settings');
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
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
              <AvatarFallback>DN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, Divine</h1>
              <p className="text-gray-500">Managing 2 active projects</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/browse')}
            >
              Browse Developers
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Projects */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Active Projects</h2>
              <div className="grid gap-4">
                {activeProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{project.location}</p>
                          <p className="text-sm text-gray-600 mb-3">Developer: {project.developer}</p>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{project.status}</Badge>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => navigate('/projects')}
                            >
                              View Project <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Milestone */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <Clock className="mr-2 h-5 w-5" />
                  Upcoming Milestone Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Approve payment for roofing</p>
                    <p className="text-2xl font-bold text-green-600">₦3,200,000</p>
                    <p className="text-sm text-gray-500">Modern Duplex in Lekki</p>
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => navigate('/payments')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Updates</h2>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {recentUpdates.map((update) => (
                  <Card 
                    key={update.id} 
                    className="flex-shrink-0 w-48 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate('/projects')}
                  >
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={update.image}
                          alt="Update"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-600">
                          <Camera className="h-3 w-3 mr-1" />
                          {update.type}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{update.project}</p>
                      <p className="text-xs text-gray-500">{update.timestamp}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Messages Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate('/messages')}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{message.developer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{message.developer}</p>
                          <p className="text-xs text-gray-500">{message.time}</p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                        {message.unread && (
                          <Badge className="mt-1 bg-green-600 text-xs">New</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/messages')}
                  >
                    Open All Messages
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Investment</span>
                  <span className="font-semibold">₦25.4M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects Completed</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-semibold">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Rating Given</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
