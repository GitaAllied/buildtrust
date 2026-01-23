import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, Search, Shield, Users, UserCheck, Clock, ArrowLeft } from "lucide-react";

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
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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
      status: "active"
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
      status: "active"
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
      status: "active"
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
      status: "active"
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      senderId: 101,
      senderName: "John Smith",
      senderRole: "client",
      senderAvatar: "/api/placeholder/40/40",
      recipientId: 0,
      recipientName: "Admin",
      recipientRole: "admin",
      subject: "Project Requirements Help",
      content: "Hi admin, I need help with my project requirements. The form seems confusing and I'm not sure what information I should provide.",
      timestamp: "2024-01-09 14:30",
      isRead: false,
      priority: "medium"
    },
    {
      id: 2,
      senderId: 0,
      senderName: "Admin",
      senderRole: "admin",
      recipientId: 101,
      recipientName: "John Smith",
      recipientRole: "client",
      subject: "Re: Project Requirements Help",
      content: "Hello John! I'd be happy to help you with your project requirements. Could you please tell me which specific part is confusing? The project form is designed to collect essential information about your needs.",
      timestamp: "2024-01-09 14:25",
      isRead: true,
      priority: "medium"
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
      content: "The budget section and timeline requirements are what I'm struggling with. Can you provide some examples?",
      timestamp: "2024-01-09 14:20",
      isRead: false,
      priority: "medium"
    }
  ];

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || conversation.userRole === filterRole;
    const matchesStatus = filterStatus === "all" || conversation.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const currentMessages = selectedConversation
    ? messages.filter(msg =>
        (msg.senderId === selectedConversation.userId && msg.recipientId === 0) ||
        (msg.senderId === 0 && msg.recipientId === selectedConversation.userId)
      )
    : [];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      console.log("Sending message:", {
        recipientId: selectedConversation.userId,
        content: newMessage,
        timestamp: new Date().toISOString()
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      setNewMessage("");
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "client":
        return <Users className="h-3 md:h-4 w-3 md:w-4 text-blue-600" />;
      case "developer":
        return <UserCheck className="h-3 md:h-4 w-3 md:w-4 text-green-600" />;
      default:
        return null;
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-14 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/super-admin-dashboard')}
                className="flex items-center space-x-2 text-xs md:text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="hidden sm:block text-gray-300">|</div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">Admin Messages</h1>
                <p className="text-xs md:text-sm text-gray-500">Communicate with clients and developers</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Shield className="h-5 w-5 text-red-600" />
              <span className="text-xs md:text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <MessageSquare className="h-4 md:h-5 w-4 md:w-5" />
                  <span>Conversations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Filters */}
                <div className="p-3 md:p-4 border-b">
                  <div className="space-y-2 md:space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-xs md:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger className="text-xs md:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="client">Clients</SelectItem>
                          <SelectItem value="developer">Developers</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="text-xs md:text-sm">
                          <SelectValue />
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
                      className={`p-3 md:p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors text-xs md:text-sm ${
                        selectedConversation?.id === conversation.id ? 'bg-[#226F75]/5 border-[#226F75]/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-2 md:space-x-3">
                        <Avatar className="h-8 md:h-10 w-8 md:w-10 flex-shrink-0">
                          <AvatarImage src={conversation.userAvatar} alt={conversation.userName} />
                          <AvatarFallback>
                            {conversation.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-medium text-gray-900 truncate text-xs md:text-sm">
                              {conversation.userName}
                            </p>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {conversation.lastMessageTime.split(' ')[1]}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {getRoleIcon(conversation.userRole)}
                            <span className="text-xs text-gray-500 capitalize">
                              {conversation.userRole}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 truncate mt-1">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredConversations.length === 0 && (
                  <div className="p-6 md:p-8 text-center">
                    <MessageSquare className="mx-auto h-10 md:h-12 w-10 md:w-12 text-gray-400" />
                    <h3 className="mt-2 text-xs md:text-sm font-medium text-gray-900">No conversations found</h3>
                    <p className="mt-1 text-xs md:text-sm text-gray-500">
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
              <Card className="h-96 md:h-auto md:flex md:flex-col">
                <CardHeader className="border-b pb-3 md:pb-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Avatar className="h-8 md:h-10 w-8 md:w-10">
                      <AvatarImage src={selectedConversation.userAvatar} alt={selectedConversation.userName} />
                      <AvatarFallback>
                        {selectedConversation.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm md:text-lg font-medium text-gray-900">
                        {selectedConversation.userName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(selectedConversation.userRole)}
                        <span className="text-xs md:text-sm text-gray-500 capitalize">
                          {selectedConversation.userRole}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm ${
                          message.senderId === 0
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="font-medium text-xs">
                              {message.senderId === 0 ? 'You' : message.senderName}
                            </span>
                            <span className={`text-xs ${getPriorityColor(message.priority)}`}>
                              {message.priority}
                            </span>
                          </div>
                          <p>{message.content}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {message.timestamp.split(' ')[1]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-3 md:p-4">
                    <div className="flex flex-col space-y-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="text-xs md:text-sm"
                        rows={2}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-red-600 hover:bg-red-700 text-xs md:text-sm w-full md:w-auto"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-96 md:h-auto flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-10 md:h-12 w-10 md:w-12 text-gray-400" />
                  <h3 className="mt-2 text-xs md:text-sm font-medium text-gray-900">Select a conversation</h3>
                  <p className="mt-1 text-xs md:text-sm text-gray-500">
                    Choose a conversation from the list to start messaging.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
