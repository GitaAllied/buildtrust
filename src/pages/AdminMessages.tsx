import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Shield,
  Users,
  UserCheck,
  Clock,
  ArrowLeft,
  X,
  Menu
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
import {
  FaBook,
  FaDoorOpen,
  FaGear,
  FaHandshake,
  FaMessage,
  FaUser,
  FaUsers,
} from "react-icons/fa6";

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderRole: "client" | "developer" | "admin";
  senderAvatar?: string;
  recipientId: number;
  recipientName: string;
  recipientRole: "client" | "developer" | "admin";
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
}

interface Conversation {
  id: number;
  userId: number;
  userName: string;
  userRole: "client" | "developer";
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "active" | "archived";
}

const AdminMessages = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("messages");
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const { signOut } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const sidebarItems = [
      { id: "dashboard", label: "Dashboard", icon: <FaUser />},
      { id: "users", label: "User Management", icon: <FaUsers /> },
      { id: "messages", label: "Messages", icon: <FaMessage />, active: true },
      { id: "reports", label: "Reports", icon: <FaBook /> },
      { id: "settings", label: "System Settings", icon: <FaGear /> },
      { id: "support", label: "Support", icon: <FaHandshake /> },
      { id: "logout", label: "Sign Out", action: "logout", icon: <FaDoorOpen /> },
    ];
    const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/super-admin-dashboard")
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "messages":
        navigate("/admin/messages");
        break;
      case "reports":
        navigate("/admin/reports");
        break;
      case "settings":
        navigate("/admin/settings");
        break;
      case "support":
        navigate("/admin/support");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        navigate("/super-admin-dashboard");
    }
  };

  // Mock data - in a real app, this would come from an API
  const conversations: Conversation[] = [
    {
      id: 1,
      userId: 101,
      userName: "John Smith",
      userRole: "client",
      userAvatar: "/api/placeholder/40/40",
      lastMessage: "Hi admin, I need help with my project requirements...",
      lastMessageTime: "2024-01-09 14:30",
      unreadCount: 2,
      status: "active",
    },
    {
      id: 2,
      userId: 102,
      userName: "Sarah Johnson",
      userRole: "developer",
      userAvatar: "/api/placeholder/40/40",
      lastMessage: "I've completed the project milestone. Please review...",
      lastMessageTime: "2024-01-09 12:15",
      unreadCount: 0,
      status: "active",
    },
    {
      id: 3,
      userId: 103,
      userName: "Mike Davis",
      userRole: "client",
      userAvatar: "/api/placeholder/40/40",
      lastMessage: "When will the payment be processed?",
      lastMessageTime: "2024-01-08 16:45",
      unreadCount: 1,
      status: "active",
    },
    {
      id: 4,
      userId: 104,
      userName: "Emily Chen",
      userRole: "developer",
      userAvatar: "/api/placeholder/40/40",
      lastMessage: "Thanks for the feedback on my portfolio!",
      lastMessageTime: "2024-01-08 11:20",
      unreadCount: 0,
      status: "active",
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      senderId: 101,
      senderName: "John Smith",
      senderRole: "client",
      senderAvatar: "/api/placeholder/40/40",
      recipientId: 0, // Admin
      recipientName: "Admin",
      recipientRole: "admin",
      subject: "Project Requirements Help",
      content:
        "Hi admin, I need help with my project requirements. The form seems confusing and I'm not sure what information I should provide.",
      timestamp: "2024-01-09 14:30",
      isRead: false,
      priority: "medium",
    },
    {
      id: 2,
      senderId: 0, // Admin
      senderName: "Admin",
      senderRole: "admin",
      recipientId: 101,
      recipientName: "John Smith",
      recipientRole: "client",
      subject: "Re: Project Requirements Help",
      content:
        "Hello John! I'd be happy to help you with your project requirements. Could you please tell me which specific part is confusing? The project form is designed to collect essential information about your needs.",
      timestamp: "2024-01-09 14:25",
      isRead: true,
      priority: "medium",
    },
    {
      id: 3,
      senderId: 101,
      senderName: "John Smith",
      senderRole: "client",
      recipientId: 0,
      recipientName: "Admin",
      recipientRole: "admin",
      subject: "Re: Project Requirements Help",
      content:
        "The budget section and timeline requirements are what I'm struggling with. Can you provide some examples?",
      timestamp: "2024-01-09 14:20",
      isRead: false,
      priority: "medium",
    },
  ];

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.userName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" || conversation.userRole === filterRole;
    const matchesStatus =
      filterStatus === "all" || conversation.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const currentMessages = selectedConversation
    ? messages.filter(
        (msg) =>
          (msg.senderId === selectedConversation.userId &&
            msg.recipientId === 0) ||
          (msg.senderId === 0 &&
            msg.recipientId === selectedConversation.userId)
      )
    : [];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      // In a real app, this would make an API call
      console.log("Sending message:", {
        recipientId: selectedConversation.userId,
        content: newMessage,
        timestamp: new Date().toISOString(),
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Reset message input
      setNewMessage("");

      // In a real app, you would update the messages list here
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "client":
        return <Users className="h-4 w-4 text-blue-600" />;
      case "developer":
        return <UserCheck className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      client: "default",
      developer: "secondary",
    } as const;
    return (
      <Badge variant={variants[role as keyof typeof variants] || "outline"}>
        {role}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <img src={Logo} alt="" />
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
        } md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed md:relative top-14 md:top-0 left-0 right-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}
      >
        <div className="p-4 sm:p-6 border-b border-white/20 hidden md:block">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full"
          >
            <img src={Logo} alt="" className="w-[55%]" />
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
              className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-1 transition-all text-xs sm:text-sm font-medium flex gap-2 items-center ${
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
      <div className="w-full flex-1 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="md:text-2xl font-bold text-gray-900">
                    Admin Messages
                  </h1>
                  <p className="text-sm text-gray-500">
                    Communicate with clients and developers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Conversations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Filters */}
                  <div className="p-4 border-b">
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search conversations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Select
                          value={filterRole}
                          onValueChange={setFilterRole}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Filter by role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="client">Clients</SelectItem>
                            <SelectItem value="developer">
                              Developers
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={filterStatus}
                          onValueChange={setFilterStatus}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Conversations */}
                  <div className="max-h-96 overflow-y-auto">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={conversation.userAvatar}
                              alt={conversation.userName}
                            />
                            <AvatarFallback>
                              {conversation.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.userName}
                              </p>
                              <span className="text-xs text-gray-500">
                                {conversation.lastMessageTime.split(" ")[1]}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {getRoleIcon(conversation.userRole)}
                              <span className="text-xs text-gray-500 capitalize">
                                {conversation.userRole}
                              </span>
                              {conversation.unreadCount > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredConversations.length === 0 && (
                    <div className="p-8 text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No conversations found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Message Thread */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <Card className="h-full flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={selectedConversation.userAvatar}
                          alt={selectedConversation.userName}
                        />
                        <AvatarFallback>
                          {selectedConversation.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedConversation.userName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(selectedConversation.userRole)}
                          <span className="text-sm text-gray-500 capitalize">
                            {selectedConversation.userRole}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {currentMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === 0
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === 0
                                ? "bg-red-600 text-white"
                                : "bg-gray-200 text-gray-900"
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium">
                                {message.senderId === 0
                                  ? "You"
                                  : message.senderName}
                              </span>
                              <span
                                className={`text-xs ${getPriorityColor(
                                  message.priority
                                )}`}
                              >
                                {message.priority}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {message.timestamp.split(" ")[1]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="border-t p-4">
                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1"
                          rows={3}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Select a conversation
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose a conversation from the list to start messaging.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
