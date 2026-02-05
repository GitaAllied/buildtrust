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
  X,
  Menu,
  Search,
  Send
} from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaDoorOpen,
  FaDownload,
  FaGear,
  FaMessage,
  FaMoneyBill,
  FaUpload,
  FaUser,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";

const DeveloperMessages = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { signOut } = useAuth();

  const [signOutModal, setSignOutModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(1);
    const [newMessage, setNewMessage] = useState("");  

    const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaUser />
    },
    { id: "requests", label: "Project Requests", icon: <FaDownload /> },
    { id: "projects", label: "Active Projects", icon: <FaBriefcase /> },
    { id: "upload", label: "Upload Update", icon: <FaUpload /> },
    { id: "messages", label: "Messages", icon: <FaMessage />,
      active: true, },
    { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
    { id: "profile", label: "Licenses & Profile", icon: <FaUser /> },
    { id: "support", label: "Support", icon: <FaGear /> },
  ];

  const conversations = [
    {
      id: 1,
      name: "Engr. Adewale",
      lastMessage: "Foundation work completed ahead of schedule!",
      time: "1h ago",
      unread: true,
      project: "Modern Duplex",
    },
    {
      id: 2,
      name: "Prime Build Ltd",
      lastMessage: "Site survey documents ready for review",
      time: "3h ago",
      unread: false,
      project: "Commercial Plaza",
    },
    {
      id: 3,
      name: "Covenant Builders",
      lastMessage: "Thank you for choosing our services",
      time: "2 days ago",
      unread: false,
      project: "Bungalow Renovation",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Engr. Adewale",
      message:
        "Good morning! I'm pleased to inform you that we've completed the foundation work ahead of schedule.",
      time: "2h ago",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      message:
        "That's excellent news! Can you share some photos of the progress?",
      time: "1h ago",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Engr. Adewale",
      message: "Foundation work completed ahead of schedule!",
      time: "1h ago",
      isOwn: false,
    },
  ];

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/developer-dashboard");
        break;
      case "requests":
        navigate("/project-requests");
        break;
      case "projects":
        navigate("/active-projects");
        break;
      case "upload":
        navigate("/upload-update");
        break;
      case "messages":
        navigate("/developer-messages");
        break;
      case "payments":
        navigate("/developer-payments");
        break;
      case "profile":
        navigate("/developer-liscences");
        break;
      case "support":
        navigate("/support");
        break;
        case "logout":
        handleLogout();
        break;
      default:
        navigate("/browse");
    }
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={'/'}><img src={Logo} alt="" /></Link>
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
        <div className=" h-full flex flex-col justify-start md:justify-between">
          <div>
            {/* logo */}
            <div className="p-4 sm:pb-2 sm:p-6 hidden md:block">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
              >
                <Link to={"/"}>
                  <img src={Logo} alt="" className="w-[55%]" />
                </Link>
              </button>
            </div>
            {/* nav links */}
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
          {/* Signout Button */}
          <div className="p-3 sm:p-4">
            <button
              onClick={() => {
                setSignOutModal(true);
              }}
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center text-red-500"
            >
              <FaDoorOpen />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  Messages
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Communicate with your developers
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)] flex-col sm:flex-row">
          {/* Conversations List - Hidden on mobile, shown on sm+ */}
          <div className="hidden sm:flex sm:w-72 md:w-80 bg-white border-r flex-col">
            <div className="p-3 sm:p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 text-xs sm:text-sm h-9"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer text-xs sm:text-sm ${
                    selectedConversation === conv.id
                      ? "bg-[#226F75]/10 border-r-2 border-r-[#226F75]/60"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {conv.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-medium truncate">{conv.name}</p>
                        <p className="text-xs text-gray-500 flex-shrink-0">
                          {conv.time}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400">{conv.project}</p>
                      {conv.unread && (
                        <Badge className="mt-1 bg-green-600 text-xs">New</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarFallback className="text-xs">EA</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-medium text-xs sm:text-sm truncate">
                    Engr. Adewale
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    Modern Duplex Project
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
                      msg.isOwn ? "bg-[#253E44] text-white" : "bg-white border"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.isOwn ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-3 sm:p-4">
              <div className="flex gap-2 sm:gap-4">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[36px] sm:min-h-[40px] max-h-32 text-xs sm:text-sm"
                />
                <Button className="bg-[#253E44] hover:bg-[#253E44]/70 h-9 sm:h-10 px-2 sm:px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() => setSignOutModal(false)}
        />
      )}
    </div>
  );
};

export default DeveloperMessages;
