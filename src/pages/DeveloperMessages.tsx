import { useState, useRef, useEffect } from "react";
// Format time as HH:MM AM/PM
function formatTimeOnly(msg: any) {
  const ts = msg.timestamp || msg.created_at || msg.time;
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
}
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  X,
  Menu,
  Send
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import DeveloperSidebar from "@/components/DeveloperSidebar";
import { useDispatch, useSelector } from "react-redux";
import SignoutModal from "@/components/ui/signoutModal";
import { openDeveloperSidebar, openSignoutModal } from "@/redux/action";

const DeveloperMessages = () => {
  const [uploadProgress, setUploadProgress] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch()
  const isOpen = useSelector((state:any) => state.sidebar.developerSidebar)
    const signOutModal = useSelector((state:any) => state.signout) 


  // Only one conversation: developer <-> admin
  const [adminUserId, setAdminUserId] = useState<number | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find admin userId and load conversation/messages
  useEffect(() => {
    const loadAdminAndConversation = async () => {
      setLoading(true);
      try {
        // Find admin user
        const users = await apiClient.getUsers();
        let admin = null;
        if (Array.isArray(users)) {
          admin = users.find((u: any) => u.role === 'admin');
        } else if (users && Array.isArray(users.users)) {
          admin = users.users.find((u: any) => u.role === 'admin');
        }
        if (!admin) throw new Error('Admin user not found');
        setAdminUserId(admin.id);
        // Find conversation with admin
        const convList = await apiClient.getConversations();
        let conv = null;
        if (Array.isArray(convList)) {
          conv = convList.find((c: any) =>
            c.other_id === admin.id || c.participant1_id === admin.id || c.participant2_id === admin.id
          );
        }
        let convId = conv?.conversation_id;
        if (!convId && conv && conv.id) convId = conv.id;
        setConversationId(convId || null);
        if (convId) {
          const msgs = await apiClient.getConversationMessages(convId);
          setMessages(Array.isArray(msgs) ? msgs : []);
        } else {
          setMessages([]);
        }
      } catch (e) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    loadAdminAndConversation();
    // eslint-disable-next-line
  }, []);

  // Send message handler
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !adminUserId) return;
    try {
      // Send to backend (admin userId)
      const resp: any = await apiClient.sendMessage(adminUserId, newMessage, conversationId || undefined);
      // Add to local state
      const backendMsg = {
        id: resp.id || Date.now(),
        senderId: user?.id,
        recipientId: adminUserId,
        content: newMessage,
        timestamp: resp.created_at || new Date().toISOString(),
      };
      setMessages((prev) => [...prev, backendMsg]);
      setNewMessage("");
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      // If conversationId was not set, try to reload it (first message creates conversation)
      if (!conversationId && resp.conversation_id) {
        setConversationId(resp.conversation_id);
      }
    } catch (e: any) {
      alert('Message sending failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
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
          onClick={() => dispatch(openDeveloperSidebar(!isOpen))}
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
      <DeveloperSidebar active={"messages"}/>

      {/* Main Content */}
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Message management directly
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)] flex-col">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarFallback className="text-xs">AD</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-medium text-xs sm:text-sm truncate">
                    Management
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    Admin
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center text-gray-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((msg: any, idx: number) => {
                  // Use senderId to determine alignment
                  const isOwn = msg.senderId === user?.id || msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
                          isOwn ? "bg-[#253E44] text-white" : "bg-white border"
                        }`}
                      >
                        <p>{msg.content || msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? "text-white" : "text-gray-500"
                          }`}
                        >
                          {formatTimeOnly(msg)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-3 sm:p-4">
              <div className="flex gap-2 sm:gap-4">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[36px] sm:min-h-[40px] max-h-32 text-xs sm:text-sm"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                />
                <Button
                  className="bg-[#253E44] hover:bg-[#253E44]/70 h-9 sm:h-10 px-2 sm:px-3"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
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
          onClose={() =>dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default DeveloperMessages;
