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
import { useEffect } from "react";
import { apiClient } from "@/lib/api";
import {
  FaBook,
  FaDoorOpen,
  FaGear,
  FaHandshake,
  FaMessage,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

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
  created_at?: string;
  createdAt?: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  status?: string;
  delivered?: boolean;
}

interface Conversation {
  id: number;
  conversation_id?: number; // Database conversation ID (once created)
  userId: number;
  userName: string;
  userRole: "client" | "developer";
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  userOnline?: boolean;
  lastSeen?: string; // Last time user was online
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
      { id: "projects", label: "Projects", icon: <FaHandshake /> },
      { id: "contracts", label: "Contracts", icon: <FaBook /> },
      { id: "developers", label: "Developers", icon: <FaUser /> },
      { id: "messages", label: "Messages", icon: <FaMessage />, active: true },
      { id: "reports", label: "Reports", icon: <FaBook /> },
      { id: "settings", label: "Settings", icon: <FaGear /> },
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
      case "projects":
        navigate("/admin/projects");
        break;
      case "contracts":
        navigate("/admin/contracts");
        break;
      case "developers":
        navigate("/admin/developers");
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

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

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

  // Load users from API and map to conversations
  useEffect(() => {
    let mounted = true;
    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const resp = await apiClient.getUsers();
        const users = Array.isArray(resp) ? resp : resp.users || [];

        // Only include clients or developers that have completed setup
        const filteredUsers = users.filter((u: any) => {
          const roleOk = u.role === 'developer' || u.role === 'client';
          const setupCompleted = u.setup_completed === true || u.setup_completed === 1 || u.setup_completed === '1';
          return roleOk && setupCompleted;
        });

        const convs = filteredUsers.map((u: any) => {
          const savedKey = `admin_messages_${u.id}`;
          const saved = localStorage.getItem(savedKey);
          let lastMessage = 'No messages yet';
          let lastMessageTime = new Date().toISOString();
          if (saved) {
            try {
              const arr = JSON.parse(saved) as Message[];
              if (arr.length > 0) {
                const last = arr[arr.length - 1];
                lastMessage = last.content;
                lastMessageTime = last.timestamp;
              }
            } catch {}
          }

          // determine online status: prefer explicit `is_online`, fallback to recent `last_seen`
          let isOnline = false;
          if (typeof u.is_online !== 'undefined') {
            isOnline = u.is_online === true || u.is_online === 1 || u.is_online === '1';
          } else if (u.last_seen) {
            const ts = Date.parse(u.last_seen);
            if (!isNaN(ts)) {
              isOnline = (Date.now() - ts) < 5 * 60 * 1000; // online if seen within 5 minutes
            }
          }

          return {
            id: u.id,
            userId: u.id,
            userName: u.name || u.email || `User ${u.id}`,
            userRole: u.role === 'developer' ? 'developer' : 'client',
            userAvatar: u.avatar || `/api/placeholder/40/40`,
            lastMessage,
            lastMessageTime,
            userOnline: isOnline,
            lastSeen: u.last_seen,
            unreadCount: 0,
            status: 'active',
          } as Conversation;
        });

        if (mounted) setConversations(convs);
      } catch (err: any) {
        setUsersError(err?.message || 'Failed to load users');
        // Fallback to an example conversation if API fails
        if (mounted && conversations.length === 0) {
          setConversations([
            {
              id: 101,
              userId: 101,
              userName: 'John Smith',
              userRole: 'client',
              userAvatar: '/api/placeholder/40/40',
              lastMessage: 'Hi admin, I need help with my project requirements...',
              lastMessageTime: '2024-01-09 14:30',
              unreadCount: 2,
              status: 'active',
            },
          ]);
        }
      } finally {
        if (mounted) setUsersLoading(false);
      }
    };

    loadUsers();
    return () => { mounted = false; };
  }, []);

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.userName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" || conversation.userRole === filterRole;
    const matchesStatus =
      filterStatus === "all" || conversation.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    // Sort by latest messages first (descending order)
    const timeA = Date.parse(a.lastMessageTime || '0');
    const timeB = Date.parse(b.lastMessageTime || '0');
    return timeB - timeA;
  });

  const loadConversationMessages = (userId: number) => {
    const key = `admin_messages_${userId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as Message[];
      } catch {
        return [];
      }
    }

    // fallback: filter internal mock messages
    return messages.filter(
      (msg) => (msg.senderId === userId && msg.recipientId === 0) || (msg.senderId === 0 && msg.recipientId === userId)
    );
  };

  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);

  // update messages view when a conversation is selected
  const currentMessages = selectedConversation ? conversationMessages : [];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const msg: Message = {
      id: Date.now(), // simple unique id
      senderId: 0, // admin
      senderName: 'Admin',
      senderRole: 'admin',
      recipientId: selectedConversation.userId,
      recipientName: selectedConversation.userName,
      recipientRole: selectedConversation.userRole,
      subject: 'Message from admin',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'medium',
    };

    try {
      // Optimistic UI update and local persistence
      const key = `admin_messages_${selectedConversation.userId}`;
      const existing = loadConversationMessages(selectedConversation.userId) || [];
      const updated = [...existing, msg];
      localStorage.setItem(key, JSON.stringify(updated));
      setConversationMessages(updated);
      setNewMessage("");

      // Update the conversation's lastMessage and lastMessageTime in the conversations list
      setConversations((prevConvs) =>
        prevConvs.map((conv) =>
          conv.userId === selectedConversation.userId
            ? {
                ...conv,
                lastMessage: msg.content,
                lastMessageTime: msg.timestamp,
              }
            : conv
        )
      );

      // Update selectedConversation as well
      setSelectedConversation((s) =>
        s
          ? {
              ...s,
              lastMessage: msg.content,
              lastMessageTime: msg.timestamp,
            }
          : s
      );

      // Try to send to backend and reconcile conversation id
      try {
        const resp: any = await apiClient.sendMessage(selectedConversation.userId, msg.content, selectedConversation.conversation_id);
        // if backend returned a message and conversation id, reconcile
        if (resp && resp.conversation_id) {
          // set conversation id on selectedConversation
          setSelectedConversation((s) => s ? { ...s, conversation_id: resp.conversation_id } : s);
          // also update in the conversations list
          setConversations((prevConvs) =>
            prevConvs.map((conv) =>
              conv.userId === selectedConversation.userId
                ? { ...conv, conversation_id: resp.conversation_id }
                : conv
            )
          );
        }
      } catch (e) {
        console.error('Failed to send message to backend:', e);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // When selecting a conversation, load its messages
  useEffect(() => {
    let mounted = true;
    const loadMsgs = async () => {
      if (!selectedConversation) {
        setConversationMessages([]);
        return;
      }

      // first try backend: find conversation id then fetch messages
      try {
        const convList: any = await apiClient.getConversations();
        let conv = null;
        if (Array.isArray(convList)) {
          conv = convList.find((c: any) => {
            // some backends return participant ids, others return other_id
            return c.other_id === selectedConversation.userId || c.participant1_id === selectedConversation.userId || c.participant2_id === selectedConversation.userId;
          });
        }

        if (conv && conv.conversation_id) {
          const msgs = await apiClient.getConversationMessages(conv.conversation_id);
          if (mounted) {
            setConversationMessages(Array.isArray(msgs) ? msgs : []);
            // attach conversation id for future sends
            setSelectedConversation((s) => s ? { ...s, conversation_id: conv.conversation_id } : s);
            try {
              // explicitly mark as read on backend (ensures read receipts update)
              await apiClient.markConversationRead(conv.conversation_id);
            } catch (e) {
              console.debug('markConversationRead failed (ignored):', e);
            }
            return;
          }
        }
      } catch (e) {
        // ignore and fallback to localStorage
        console.debug('Could not load backend conversation:', e);
      }

      // fallback to local storage / mock messages
      const msgs = loadConversationMessages(selectedConversation.userId);
      if (mounted) setConversationMessages(msgs);
    };

    loadMsgs();
    return () => { mounted = false; };
  }, [selectedConversation]);

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

  const formatMessageTime = (message: any) => {
    const ts = message.timestamp || message.created_at || message.createdAt;
    if (!ts) return 'Recently';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) {
        // fallback to splitting when it's a string like '2024-01-09 14:30'
        const parts = String(ts).split(' ');
        return parts.length > 1 ? parts[1] : String(ts);
      }
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(ts);
    }
  };

  const formatTimeOnly = (message: any) => {
    const ts = message.timestamp || message.created_at || message.createdAt;
    if (!ts) return '';
    try {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      const parts = String(ts).split(' ');
      return parts.length > 1 ? parts[1] : String(ts);
    } catch {
      return String(ts);
    }
  };

  const formatLastSeen = (lastSeen: string | undefined) => {
    if (!lastSeen) return 'Never seen';
    try {
      const ts = Date.parse(lastSeen);
      if (isNaN(ts)) return lastSeen;
      
      const d = new Date(ts);
      const now = Date.now();
      const diff = now - d.getTime();
      
      // Less than 1 minute
      if (diff < 60 * 1000) return 'Just now';
      // Less than 1 hour
      if (diff < 60 * 60 * 1000) {
        const mins = Math.floor(diff / (60 * 1000));
        return `${mins}m ago`;
      }
      // Less than 1 day
      if (diff < 24 * 60 * 60 * 1000) {
        const hrs = Math.floor(diff / (60 * 60 * 1000));
        return `${hrs}h ago`;
      }
      // Less than 1 week
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${days}d ago`;
      }
      // Default: show date
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return lastSeen;
    }
  };

  const renderTicks = (message: any) => {
    // Only show ticks for messages sent by admin (senderId === 0)
    if (message.senderId !== 0) return null;

    // Determine status: prefer explicit `status`, then `isRead`/`delivered`
    // support both snake_case (from backend) and camelCase
    const isRead = message.is_read === 1 || message.is_read === true || message.isRead === true;
    const isDelivered = message.delivered === true || message.delivered === 1;
    const status = message.status || (isRead ? 'read' : isDelivered ? 'delivered' : 'sent');

    if (status === 'read') {
      return (
        <span className="text-blue-500 text-xs flex items-center" style={{ gap: '-2px' }}>
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"></path></svg>
          <svg className="h-3 w-3 -ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"></path></svg>
        </span>
      );
    }

    if (status === 'delivered') {
      return (
        <span className="text-gray-400 text-xs flex items-center">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"></path></svg>
          <svg className="h-3 w-3 -ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"></path></svg>
        </span>
      );
    }

    // sent (single tick)
    return (
      <span className="text-gray-400 text-xs flex items-center">
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M21 7L9 19l-5-5 1.5-1.5L9 16l10.5-10.5z"></path></svg>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
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
        <div className="p-4 sm:p-6 border-b border-white/20 hidden md:block">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full"
          >
            <Link to={'/'}><img src={Logo} alt="" className="w-[55%]" /></Link>
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
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
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
                            ? "bg-[#226F75]/10 border-[#226F75]/20"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
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
                            <span
                              title={conversation.userOnline ? 'Online' : 'Offline'}
                              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${conversation.userOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.userName}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatMessageTime({ timestamp: conversation.lastMessageTime })}
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
                      <div className="relative">
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
                        <span
                          title={selectedConversation.userOnline ? 'Online' : 'Offline'}
                          className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${selectedConversation.userOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                      </div>
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
                        {selectedConversation.userOnline ? (
                          <p className="text-xs text-gray-400 mt-1">Online</p>
                        ) : selectedConversation.lastSeen ? (
                          <p className="text-xs text-gray-400 mt-1">
                            Last seen {formatLastSeen(selectedConversation.lastSeen)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {currentMessages.map((message, idx) => {
                        const tsStr = message.timestamp || message.created_at || message.createdAt;
                        const ts = tsStr ? Date.parse(tsStr) : NaN;
                        const isOld = !isNaN(ts) && (Date.now() - ts) > 24 * 60 * 60 * 1000;
                        const prev = idx > 0 ? currentMessages[idx - 1] : null;
                        const prevTsStr = prev ? (prev.timestamp || prev.created_at || prev.createdAt) : null;
                        const prevTs = prevTsStr ? Date.parse(prevTsStr) : NaN;
                        const prevIsOld = !isNaN(prevTs) && (Date.now() - prevTs) > 24 * 60 * 60 * 1000;

                        const showDivider = isOld && !prevIsOld;

                        return (
                          <div key={`m-${message.id}-${idx}`}>
                            {showDivider && (
                              <div className="py-2">
                                <div className="flex items-center justify-center">
                                  <span className="text-xs text-gray-400">Older messages</span>
                                </div>
                                <div className="my-2 border-t" />
                              </div>
                            )}

                            <div
                              className={`flex ${
                                message.senderId === 0 ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.senderId === 0 ? 'bg-[#253E44] text-white' : 'bg-gray-200 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <div className="flex items-center justify-end mt-1 space-x-2">
                                  {message.senderId === 0 ? (
                                    <>
                                      {renderTicks(message)}
                                      <span className="text-xs opacity-75">{formatTimeOnly(message)}</span>
                                    </>
                                  ) : (
                                    <span className="text-xs opacity-75">{formatTimeOnly(message)}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                          className="bg-[#253E44]/90 hover:bg-[#253E44]"
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
