import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, ArrowRight, CheckCircle, Clock, Camera, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2">
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
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
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
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                  <AvatarFallback className="bg-gradient-to-br from-[#226F75] to-[#253E44] text-white">DN</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg md:text-2xl font-bold text-[#253E44] truncate">Welcome, Divine</h1>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">Managing 2 active projects</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
                <Button variant="ghost" size="icon" className="relative flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 hover:bg-[#226F75]/10">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-[#226F75]" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs p-0 flex items-center justify-center">
                    3
                  </Badge>
                </Button>
                <Button 
                  onClick={() => navigate('/browse')}
                  className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Browse Developers
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              {/* Active Projects */}
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#253E44] mb-4 px-1">Active Projects</h2>
                <div className="grid gap-4 sm:gap-5">
                  {activeProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border border-white/50 bg-white/80 rounded-2xl overflow-hidden group">
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full sm:w-32 md:w-40 h-32 sm:h-28 md:h-32 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm sm:text-base text-[#253E44] line-clamp-2">{project.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2">{project.location}</p>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-1">Developer: {project.developer}</p>
                            
                            <div className="mb-4">
                              <div className="flex justify-between text-xs sm:text-sm mb-2 text-[#226F75] font-medium">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2.5 bg-[#226F75]/10" />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <Badge className="bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 text-[#226F75] text-xs font-medium">{project.status}</Badge>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs w-full sm:w-auto shadow-md"
                                onClick={() => navigate('/projects')}
                              >
                                View Project <ArrowRight className="ml-1 h-3 w-3" />
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
                      <p className="font-medium text-xs sm:text-sm text-gray-900">Approve payment for roofing</p>
                      <p className="text-xl sm:text-2xl font-bold text-[#226F75] mt-1">₦3,200,000</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">Modern Duplex in Lekki</p>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-xs sm:text-sm w-full sm:w-auto flex-shrink-0 shadow-md"
                      onClick={() => navigate('/payments')}
                    >
                      <CheckCircle className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                      Approve Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Updates */}
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#253E44] mb-4 px-1">Recent Updates</h2>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                  {recentUpdates.map((update) => (
                    <Card 
                      key={update.id} 
                      className="flex-shrink-0 w-40 sm:w-48 md:w-56 hover:shadow-xl transition-all border border-white/50 bg-white/80 rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => navigate('/projects')}
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
                        <p className="font-semibold text-xs sm:text-sm text-[#253E44] line-clamp-1">{update.project}</p>
                        <p className="text-xs text-gray-500 mt-1">{update.timestamp}</p>
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
                      onClick={() => navigate('/messages')}
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 ring-1 ring-[#226F75]/20">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-[#226F75] to-[#253E44] text-white">{message.developer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-semibold text-xs sm:text-sm text-[#253E44] truncate">{message.developer}</p>
                            <p className="text-xs text-gray-500 flex-shrink-0">{message.time}</p>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{message.lastMessage}</p>
                          {message.unread && (
                            <Badge className="mt-1.5 bg-gradient-to-r from-[#226F75] to-[#253E44] text-white text-xs">New</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-2 sm:p-3 md:p-4 border-t border-white/50 bg-gradient-to-r from-[#226F75]/5 to-[#253E44]/5">
                    <Button 
                      className="w-full text-xs sm:text-sm bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white shadow-sm"
                      onClick={() => navigate('/messages')}
                    >
                      Open All Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border border-white/50 bg-white/80 rounded-2xl shadow-md">
                <CardHeader className="pb-3 sm:pb-4 border-b border-white/50 bg-gradient-to-r from-[#226F75]/5 to-[#253E44]/5">
                  <CardTitle className="text-sm sm:text-base text-[#226F75] font-bold">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 pt-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Total Investment</span>
                    <span className="font-bold text-[#226F75] truncate">₦25.4M</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm border-t border-white/50 pt-3">
                    <span className="text-gray-600">Projects Completed</span>
                    <span className="font-bold text-[#253E44]">3</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm border-t border-white/50 pt-3">
                    <span className="text-gray-600">Active Projects</span>
                    <span className="font-bold text-[#253E44]">2</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm border-t border-white/50 pt-3">
                    <span className="text-gray-600">Avg. Rating Given</span>
                    <span className="font-bold text-[#226F75]">4.8/5</span>
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
