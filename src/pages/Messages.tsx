import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Search, Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import ClientSidebar from "@/components/ClientSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openClientSidebar, openSignoutModal } from "@/redux/action";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);
  const dispatch = useDispatch();
  const isOpen = useSelector((state: any) => state.sidebar.clientSidebar);
  const signOutModal = useSelector((state: any) => state.signout);

  const { user } = useAuth();

  // load conversations and admin on mount
  useEffect(() => {
    const init = async () => {
      try {
        // find admin user (clients can only message admin)
        const users: any[] = await apiClient.getUsers();
        const admin = users.find((u) => u.role === "admin");
        setAdminUser(admin || null);

        // load conversations
        const convs: any[] = await apiClient.getConversations();

        if (user?.role === "client") {
          // keep only conversation with admin (if exists)
          const convWithAdmin = convs.find(
            (c) =>
              c.other_id === admin?.id ||
              c.participant1_id === admin?.id ||
              c.participant2_id === admin?.id,
          );
          if (convWithAdmin) {
            setConversations([convWithAdmin]);
            setSelectedConversation(
              convWithAdmin.conversation_id || convWithAdmin.id,
            );
            await loadMessages(
              convWithAdmin.conversation_id || convWithAdmin.id,
            );
          } else {
            setConversations([]);
            setSelectedConversation(null);
            setMessages([]);
          }
        } else {
          setConversations(convs);
          if (convs.length > 0) {
            setSelectedConversation(convs[0].conversation_id || convs[0].id);
            await loadMessages(convs[0].conversation_id || convs[0].id);
          }
        }
      } catch (err) {
        console.error("Error initializing messages:", err);
      }
    };

    init();
  }, [user]);

  // cleanup typing indicator when unmount or conversation changes
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current)
        window.clearTimeout(typingTimeoutRef.current);
      if (isTypingRef.current && selectedConversation) {
        try {
          apiClient.setTyping(selectedConversation, false);
        } catch {
          // ignore
        }
      }
    };
  }, [selectedConversation]);

  const loadMessages = async (conversationId: number | string) => {
    try {
      const msgs: any[] = await apiClient.getConversationMessages(
        conversationId as any,
      );
      setMessages(msgs || []);
      // scroll to bottom after a small delay to let DOM render
      setTimeout(() => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }, 50);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="Build Trust Africa Logo" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openClientSidebar(!isOpen))}
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
      <ClientSidebar active={"messages"} />
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
              {conversations.map((conv) => {
                const cid = conv.conversation_id || conv.id;
                return (
                  <div
                    key={cid}
                    onClick={async () => {
                      setSelectedConversation(cid);
                      await loadMessages(cid);
                    }}
                    className={`p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer text-xs sm:text-sm ${
                      selectedConversation === cid
                        ? "bg-[#226F75]/10 border-r-2 border-r-[#226F75]/60"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {(conv.other_name || conv.name || "M")
                            .toString()
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-medium truncate">
                            {conv.other_name || conv.name || "Management"}
                          </p>
                          <p className="text-xs text-gray-500 flex-shrink-0">
                            {conv.last_message_at
                              ? new Date(conv.last_message_at).toLocaleString()
                              : ""}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {conv.preview || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarFallback className="text-xs">M</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-medium text-xs sm:text-sm truncate">
                    {user?.role === "client"
                      ? "Management"
                      : conversations.find(
                          (c) =>
                            (c.conversation_id || c.id) ===
                            selectedConversation,
                        )?.other_name || "Conversation"}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.role === "client"
                      ? "Message the management team"
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
            >
              {messages.map((msg) => {
                const isOwn = msg.sender_id === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${isOwn ? "bg-[#253E44] text-white" : "bg-white border"}`}
                    >
                      <p>{msg.content || msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${isOwn ? "text-white" : "text-gray-500"}`}
                      >
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-3 sm:p-4">
              <div className="flex gap-2 sm:gap-4">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={async (e) => {
                    const v = e.target.value;
                    setNewMessage(v);
                    // typing indicator: notify backend when user starts typing, and mark stopped after delay
                    try {
                      const convId = selectedConversation;
                      if (!convId) return;
                      if (!isTypingRef.current) {
                        isTypingRef.current = true;
                        await apiClient.setTyping(convId, true);
                      }
                      // reset timeout
                      if (typingTimeoutRef.current)
                        window.clearTimeout(typingTimeoutRef.current);
                      typingTimeoutRef.current = window.setTimeout(async () => {
                        isTypingRef.current = false;
                        try {
                          await apiClient.setTyping(convId, false);
                        } catch (err) {
                          // ignore
                        }
                      }, 2500);
                    } catch (err) {
                      // ignore typing errors
                    }
                  }}
                  className="flex-1 min-h-[36px] sm:min-h-[40px] max-h-32 text-xs sm:text-sm"
                />
                <Button
                  onClick={async () => {
                    if (!newMessage.trim()) return;
                    try {
                      const recipientId =
                        user?.role === "client" ? adminUser?.id : undefined;
                      const resp: any = await apiClient.sendMessage(
                        recipientId,
                        newMessage.trim(),
                        selectedConversation || undefined,
                      );
                      // resp should be the posted message
                      if (resp) {
                        setMessages((m) => [...m, resp]);
                        // ensure conversation id is set
                        if (resp.conversation_id)
                          setSelectedConversation(resp.conversation_id);
                        setNewMessage("");
                        try {
                          // mark typing stopped
                          const convId =
                            resp.conversation_id || selectedConversation;
                          if (convId) await apiClient.setTyping(convId, false);
                        } catch (err) {
                          // ignore
                        }
                        // scroll to bottom
                        setTimeout(() => {
                          if (messagesRef.current)
                            messagesRef.current.scrollTop =
                              messagesRef.current.scrollHeight;
                        }, 50);
                      }
                    } catch (err) {
                      console.error("Error sending message:", err);
                    }
                  }}
                  className="bg-[#253E44] hover:bg-[#253E44]/70 h-9 sm:h-10 px-2 sm:px-3"
                >
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
          onClose={() => dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default Messages;
