
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, Search, ArrowLeft } from "lucide-react";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  const conversations = [
    {
      id: 1,
      name: "Engr. Adewale",
      lastMessage: "Foundation work completed ahead of schedule!",
      time: "1h ago",
      unread: true,
      project: "Modern Duplex"
    },
    {
      id: 2,
      name: "Prime Build Ltd",
      lastMessage: "Site survey documents ready for review",
      time: "3h ago",
      unread: false,
      project: "Commercial Plaza"
    },
    {
      id: 3,
      name: "Covenant Builders",
      lastMessage: "Thank you for choosing our services",
      time: "2 days ago",
      unread: false,
      project: "Bungalow Renovation"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Engr. Adewale",
      message: "Good morning! I'm pleased to inform you that we've completed the foundation work ahead of schedule.",
      time: "2h ago",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      message: "That's excellent news! Can you share some photos of the progress?",
      time: "1h ago",
      isOwn: true
    },
    {
      id: 3,
      sender: "Engr. Adewale",
      message: "Foundation work completed ahead of schedule!",
      time: "1h ago",
      isOwn: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">Messages</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Communicate with your developers</p>
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
              <Input placeholder="Search..." className="pl-10 text-xs sm:text-sm h-9" />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer text-xs sm:text-sm ${
                  selectedConversation === conv.id ? 'bg-green-50 border-r-2 border-r-green-600' : ''
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                    <AvatarFallback className="text-xs">{conv.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-medium truncate">{conv.name}</p>
                      <p className="text-xs text-gray-500 flex-shrink-0">{conv.time}</p>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
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
                <h3 className="font-medium text-xs sm:text-sm truncate">Engr. Adewale</h3>
                <p className="text-xs text-gray-500 truncate">Modern Duplex Project</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs sm:max-w-md px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
                  msg.isOwn 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white border'
                }`}>
                  <p>{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.isOwn ? 'text-green-100' : 'text-gray-500'
                  }`}>
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
              <Button className="bg-green-600 hover:bg-green-700 h-9 sm:h-10 px-2 sm:px-3">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
