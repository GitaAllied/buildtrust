import { useState, useRef, useEffect } from "react";
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
  Users,
  UserCheck,
  X,
  Menu
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
 
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import AdminSidebar from "@/components/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openAdminSidebar, openSignoutModal } from "@/redux/action";

interface Message {
  id: number;
  senderId: number;
  sender_id?: number;
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
  is_read?: number | boolean;
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
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id || 0;
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const dispatch = useDispatch()
  const isOpen = useSelector((state:any) => state.sidebar.adminSidebar)
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const isUserScrollingRef = useRef(false);
  const [selectedStatus, setSelectedStatus] = useState<{ userOnline?: boolean; lastSeen?: string; typing?: boolean; typingUserId?: number } | null>(null);
  const signOutModal = useSelector((state:any) => state.signout) 


  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Mock conversations for when API is not connected
  const mockConversations: Conversation[] = [
    {
      id: 1,
      userId: 1,
      userName: "Ade Johnson",
      userRole: "client",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
      lastMessage: "Great! The project is progressing well. When can we expect the next update?",
      lastMessageTime: "2025-02-09 10:30",
      userOnline: true,
      lastSeen: new Date().toISOString(),
      unreadCount: 0,
      status: "active",
    },
    {
      id: 2,
      userId: 2,
      userName: "Chioma Okafor",
      userRole: "developer",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
      lastMessage: "The foundation work is complete. Sending progress photos shortly.",
      lastMessageTime: "2025-02-09 08:15",
      userOnline: true,
      lastSeen: new Date().toISOString(),
      unreadCount: 1,
      status: "active",
    },
    {
      id: 3,
      userId: 3,
      userName: "Ibrahim Ahmed",
      userRole: "client",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop",
      lastMessage: "Need to discuss budget adjustments for the project",
      lastMessageTime: "2025-02-08 16:45",
      userOnline: false,
      lastSeen: "2025-02-08 16:45:00",
      unreadCount: 3,
      status: "active",
    },
    {
      id: 4,
      userId: 4,
      userName: "Grace Oluwaseun",
      userRole: "developer",
      userAvatar: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=40&h=40&fit=crop",
      lastMessage: "Can we push the deadline by two weeks?",
      lastMessageTime: "2025-02-07 13:20",
      userOnline: false,
      lastSeen: "2025-02-07 15:30:00",
      unreadCount: 0,
      status: "active",
    },
    {
      id: 5,
      userId: 5,
      userName: "David Chen",
      userRole: "client",
      userAvatar: "https://images.unsplash.com/photo-1519085360771-9852ef158dba?w=40&h=40&fit=crop",
      lastMessage: "Thank you for the excellent work on the project!",
      lastMessageTime: "2025-02-05 11:10",
      userOnline: false,
      lastSeen: "2025-02-05 14:22:00",
      unreadCount: 0,
      status: "active",
    },
  ];

  // No static mock messages — messages come from backend or localStorage

  // Load users from API and map to conversations using DATABASE messages, with polling for online status
  useEffect(() => {
    let mounted = true;
    let interval: any;
    const loadUsers = async () => {
      // Skip polling while user is manually scrolling through messages
      if (isUserScrollingRef.current) return;
      setUsersLoading(true);
      setUsersError(null);
      try {
        // First get all conversations from the database
        let backendConversations: any[] = [];
        try {
          backendConversations = await apiClient.getConversations();
          if (!Array.isArray(backendConversations)) {
            backendConversations = [];
          }
        } catch (e) {
          // Could not fetch conversations - continue with fallback
        }

        // Create a map of user ID to last message info
        const lastMessageMap: Record<number, { lastMessage: string; lastMessageTime: string }> = {};
        backendConversations.forEach((conv: any) => {
          const otherId = conv.other_id || conv.participant2_id || conv.participant1_id;
          if (otherId && conv.last_message_at) {
            let lastMessage = conv.last_message_content || conv.last_message;
            // If backend doesn't provide, try to get from messages array (local fallback)
            if (!lastMessage && Array.isArray(conv.messages) && conv.messages.length > 0) {
              lastMessage = conv.messages[conv.messages.length - 1].content;
            }
            lastMessageMap[otherId] = {
              lastMessage: lastMessage || '',
              lastMessageTime: conv.last_message_at,
            };
          }
        });

        const resp = await apiClient.getUsers();
        const users = Array.isArray(resp) ? resp : resp.users || [];

        // Only include clients or developers that have completed setup
        const filteredUsers = users.filter((u: any) => {
          const roleOk = u.role === 'developer' || u.role === 'client';
          const setupCompleted = u.setup_completed === true || u.setup_completed === 1 || u.setup_completed === '1';
          return roleOk && setupCompleted;
        });

        const convs = filteredUsers.map((u: any) => {
          const lastInfo = lastMessageMap[u.id];
          let lastMessage = 'No messages yet';
          let lastMessageTime = new Date().toISOString();
          
          if (lastInfo) {
            lastMessage = lastInfo.lastMessage;
            lastMessageTime = lastInfo.lastMessageTime;
          }

          // Robust online detection: check multiple possible fields and fallbacks
          const now = Date.now();
          const truthy = (v: any) => v === true || v === 1 || v === '1' || v === 'true' || v === 'on';
          const lastSeenField = u.last_seen || u.lastSeen || u.last_login || u.lastLogin || u.last_activity || u.lastActivity;
          let isOnline = false;

          // If this record matches the currently authenticated user, prefer true
          if (currentUser && u.id === currentUser.id) {
            isOnline = true;
          }

          // explicit boolean/string flags that indicate online
          if (!isOnline) {
            if (truthy(u.session_active) || truthy(u.sessionActive) || truthy(u.is_online) || truthy(u.isOnline) || truthy(u.online) || truthy(u.online_status)) {
              isOnline = true;
            }
          }

          // last seen / last login timestamps (consider online if within 5 minutes)
          if (!isOnline && lastSeenField) {
            const ts = Date.parse(lastSeenField);
            if (!isNaN(ts)) {
              isOnline = (now - ts) < 5 * 60 * 1000;
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
            lastSeen: lastSeenField,
            unreadCount: 0,
            status: 'active',
          } as Conversation;
        });

        if (mounted) {
          setConversations(convs);
          // keep header status in sync if a conversation is selected
          if (selectedConversation) {
            const updated = convs.find(c => c.userId === selectedConversation.userId);
            if (updated) {
              setSelectedStatus({ userOnline: updated.userOnline, lastSeen: updated.lastSeen });
            }
          }
        }
      } catch (err: any) {
        setUsersError(err?.message || 'Failed to load users');
        console.warn('Using mock data due to API connection issue');
        // Fallback to mock conversations if API fails
        if (mounted) {
          setConversations(mockConversations);
        }
      } finally {
        if (mounted) setUsersLoading(false);
      }
    };

    loadUsers();
    interval = setInterval(loadUsers, 30000); // Poll every 30s
    return () => { mounted = false; clearInterval(interval); };
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

    // fallback: no mock messages available
    return [];
  };

  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);

  // update messages view when a conversation is selected
  const currentMessages = selectedConversation ? conversationMessages : [];

  // Keep selectedConversation's online/lastSeen info in sync with polled conversations
  useEffect(() => {
    if (!selectedConversation) return;
    const updated = conversations.find((c) => c.userId === selectedConversation.userId);
    if (!updated) return;
    const shouldUpdate = (
      updated.userOnline !== selectedConversation.userOnline ||
      updated.lastSeen !== selectedConversation.lastSeen ||
      updated.lastMessage !== selectedConversation.lastMessage ||
      updated.lastMessageTime !== selectedConversation.lastMessageTime
    );
    if (shouldUpdate) {
      setSelectedConversation((s) => (s ? { ...s,
        userOnline: updated.userOnline,
        lastSeen: updated.lastSeen,
        lastMessage: updated.lastMessage,
        lastMessageTime: updated.lastMessageTime,
      } : s));
    }
  }, [conversations, selectedConversation]);

  // Poll typing status for the selected conversation (so admin sees when user is typing)
  useEffect(() => {
    let interval: any = null;
    let mounted = true;
    const pollTyping = async () => {
      if (!selectedConversation) return;

      // Determine a valid conversation id to poll. Prefer explicit conversation_id
      let convId = selectedConversation.conversation_id;
      if (!convId) {
        const found = conversations.find(c => c.userId === selectedConversation.userId && (c.conversation_id || c.id));
        if (found) {
          convId = found.conversation_id || found.id;
          // safely set it on selectedConversation so subsequent polls won't repeat the search
          setSelectedConversation((s) => (s ? { ...s, conversation_id: convId } : s));
        }
      }
      if (!convId) return; // nothing to poll until backend has a conversation id
      try {
        const res: any = await apiClient.getTyping(convId);
        if (!mounted) return;
        setSelectedStatus((s) => ({ ...(s || {}), typing: !!res?.typing, typingUserId: res?.userId }));
      } catch (e: any) {
        // If route not found (404) or other error, stop polling until conversation_id is available
        if (e?.status === 404) {
          // do nothing; avoid noisy retries until conversation_id exists
          return;
        }
        // swallow other errors silently to avoid console spam
      }
    };

    if (selectedConversation) {
      pollTyping();
      interval = setInterval(pollTyping, 700);
    }

    return () => { mounted = false; if (interval) clearInterval(interval); };
  }, [selectedConversation, conversations]);

  // Auto-scroll behavior: attach scroll listener to detect manual scrolling
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;
    let t: any = null;
    const onScroll = () => {
      isUserScrollingRef.current = true;
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1500);
    };
    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (t) clearTimeout(t);
    };
  }, [selectedConversation?.userId]);

  // Auto-scroll to bottom only when new messages arrive and user is not manually scrolling
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;
    if (isUserScrollingRef.current) return;
    // If user is already near bottom, keep them at bottom on new messages
    const nearBottom = (el.scrollHeight - el.scrollTop - el.clientHeight) < 100;
    if (nearBottom || !isUserScrollingRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [conversationMessages.length]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('You are not authenticated. Please log in again.');
      navigate('/login');
      return;
    }

    const msg: Message = {
      id: Date.now(), // simple unique id
      senderId: currentUserId, // use actual current user id
      senderName: currentUser?.name || 'Admin',
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
      // Try to send to backend first
      try {
        // Always send recipientId and conversation_id (if available) to backend
        const resp: any = await apiClient.sendMessage(
          selectedConversation.userId, 
          msg.content, 
          selectedConversation.conversation_id || undefined
        );
        
        // Update local state with backend message data
        const backendMsg: Message = {
          id: resp.id || msg.id,
          senderId: resp.sender_id || currentUserId,
          senderName: resp.sender_name || msg.senderName,
          senderRole: msg.senderRole,
          recipientId: selectedConversation.userId,
          recipientName: selectedConversation.userName,
          recipientRole: selectedConversation.userRole,
          subject: msg.subject,
          content: msg.content,
          timestamp: resp.created_at || msg.timestamp,
          isRead: resp.is_read === 1 ? true : false,
          priority: 'medium',
        };
        
        setConversationMessages((prev) => [...prev, backendMsg]);
        
        // Update conversation in list
        setConversations((prevConvs) =>
          prevConvs.map((conv) =>
            conv.userId === selectedConversation.userId
              ? {
                  ...conv,
                  lastMessage: msg.content,
                  lastMessageTime: msg.timestamp,
                  conversation_id: resp.conversation_id || selectedConversation.conversation_id,
                }
              : conv
          )
        );

        // Update selectedConversation with conversation_id from backend
        if (resp && resp.conversation_id) {
          setSelectedConversation((s) => s ? { ...s, conversation_id: resp.conversation_id } : s);
        }
        
        setNewMessage("");
      } catch (e) {
        console.error('Message sending error:', e);
        alert('Message sending failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
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
            const newMsgs = Array.isArray(msgs) ? msgs : [];
            // Only update state if messages actually changed to avoid extra renders
            setConversationMessages((prev) => {
              try {
                const prevStr = JSON.stringify(prev || []);
                const nextStr = JSON.stringify(newMsgs || []);
                if (prevStr === nextStr) return prev;
              } catch {
                // If stringify fails, fall back to setting
              }
              return newMsgs;
            });

            // attach conversation id for future sends, but only if different
            setSelectedConversation((s) => {
              if (!s) return s;
              if (s.conversation_id && s.conversation_id === conv.conversation_id) return s;
              return { ...s, conversation_id: conv.conversation_id };
            });

            try {
              // explicitly mark as read on backend (ensures read receipts update)
              await apiClient.markConversationRead(conv.conversation_id);
            } catch (e) {
              // Mark as read failed - continue silently
            }
            return;
          }
        }
      } catch (e) {
        // ignore and fallback to localStorage
      }

      // fallback to local storage / mock messages
      const msgs = loadConversationMessages(selectedConversation.userId);
      if (mounted) setConversationMessages(msgs);

      // refresh the user's online status immediately for the header
      try {
        const resp = await apiClient.getUsers();
        const users = Array.isArray(resp) ? resp : resp.users || [];
        const u = users.find((x: any) => x.id === selectedConversation.userId);
        if (u) {
          const lastSeenField = u.last_seen || u.lastSeen || u.last_login || u.lastLogin || u.last_activity || u.lastActivity;
          const now = Date.now();
          const truthy = (v: any) => v === true || v === 1 || v === '1' || v === 'true' || v === 'on';
          let isOnline = false;
          if (currentUser && u.id === currentUser.id) isOnline = true;
          if (!isOnline && (truthy(u.session_active) || truthy(u.sessionActive) || truthy(u.is_online) || truthy(u.isOnline) || truthy(u.online))) isOnline = true;
          if (!isOnline && lastSeenField) {
            const ts = Date.parse(lastSeenField);
            if (!isNaN(ts)) isOnline = (now - ts) < 5 * 60 * 1000;
          }
          setSelectedStatus({ userOnline: isOnline, lastSeen: lastSeenField });
        }
      } catch (e) {
        // ignore
      }
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
    // Only show ticks for messages sent by current user (the admin)
    if (message.senderId !== currentUserId && message.sender_id !== currentUserId) return null;

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
          onClick={() => dispatch(openAdminSidebar(!isOpen))}
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
      <AdminSidebar active={"messages"} />
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
                        onClick={() => {
                              if (!selectedConversation || selectedConversation.id !== conversation.id) {
                                setSelectedConversation(conversation);
                                setSelectedStatus({ userOnline: conversation.userOnline, lastSeen: conversation.lastSeen });
                              }
                            }}
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
                            {/* Online status dot: green if online, gray if offline */}
                            <span
                              title={conversation.userOnline ? `Online (userOnline=${conversation.userOnline})` : `Offline (userOnline=${conversation.userOnline})`}
                              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${conversation.userOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                              style={{ boxShadow: conversation.userOnline ? '0 0 4px 2px #22c55e' : undefined }}
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
                        {(() => {
                          const headerOnline = selectedStatus?.userOnline ?? selectedConversation.userOnline;
                          return (
                            <span
                              title={headerOnline ? 'Online' : 'Offline'}
                              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${headerOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                              style={{ boxShadow: headerOnline ? '0 0 4px 2px #22c55e' : undefined }}
                            />
                          );
                        })()}
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
                        {(() => {
                          const headerTyping = selectedStatus?.typing;
                          const typingUserId = selectedStatus?.typingUserId;
                          const headerOnline = selectedStatus?.userOnline ?? selectedConversation.userOnline;
                          const headerLastSeen = selectedStatus?.lastSeen ?? selectedConversation.lastSeen;
                          // Show the other participant's name when they are typing
                          if (headerTyping && typingUserId && typingUserId === selectedConversation.userId) {
                            return <p className="text-xs text-gray-400 mt-1">{selectedConversation.userName} is typing...</p>;
                          }
                          if (headerOnline) return <p className="text-xs text-gray-400 mt-1">Online</p>;
                          if (headerLastSeen) return <p className="text-xs text-gray-400 mt-1">Last seen {formatLastSeen(headerLastSeen)}</p>;
                          return null;
                        })()}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages area: scrollable, input fixed at bottom */}
                    <div className="flex-1 relative">
                      <div
                        className="absolute inset-0 overflow-y-auto p-4 space-y-4"
                        style={{ bottom: 64, paddingBottom: 96 }}
                        ref={messageListRef}
                      >
                        {currentMessages.map((message, idx, arr) => {
                          const tsStr = message.timestamp || message.created_at || message.createdAt;
                          const ts = tsStr ? Date.parse(tsStr) : NaN;
                          const isOld = !isNaN(ts) && (Date.now() - ts) > 24 * 60 * 60 * 1000;
                          const prev = idx > 0 ? arr[idx - 1] : null;
                          const prevTsStr = prev ? (prev.timestamp || prev.created_at || prev.createdAt) : null;
                          const prevTs = prevTsStr ? Date.parse(prevTsStr) : NaN;
                          const prevIsOld = !isNaN(prevTs) && (Date.now() - prevTs) > 24 * 60 * 60 * 1000;

                          const showDivider = isOld && !prevIsOld;

                          // Support both senderId and sender_id for backend compatibility
                          const isCurrentUser = message.senderId === currentUserId || message.sender_id === currentUserId;
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
                                  isCurrentUser ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    isCurrentUser ? 'bg-[#253E44] text-white' : 'bg-gray-200 text-gray-900'
                                  }`}
                                  style={{ marginBottom: '16px' }}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <div className="flex items-center justify-end mt-1 space-x-2">
                                    {isCurrentUser ? (
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
                      {/* Message Input fixed at bottom */}
                      <div className="absolute left-0 right-0 bottom-0 border-t p-4 bg-white">
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
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() =>dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default AdminMessages;
