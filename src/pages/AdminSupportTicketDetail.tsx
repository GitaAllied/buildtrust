import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, User, Mail, Phone, Clock, Send, Paperclip, Loader } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const AdminSupportTicketDetail = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  // Data States
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // UI States
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load ticket and messages
  useEffect(() => {
    if (ticketId) {
      loadTicket();
      loadMessages();
    }
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getTicket(parseInt(ticketId || "0"));
      setTicket(response);
    } catch (error: any) {
      console.error("Error loading ticket:", error);
      toast({
        title: "Error",
        description: "Failed to load ticket",
        variant: "destructive",
      });
      navigate("/admin/support");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await apiClient.getTicketMessages(parseInt(ticketId || "0"));
      setMessages(response.messages || []);
    } catch (error: any) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setIsSendingMessage(true);

    try {
      await apiClient.sendTicketMessage(parseInt(ticketId || "0"), {
        sender_id: user?.id || 0,
        content: newMessage,
        is_internal: false,
      });

      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      setNewMessage("");
      loadMessages();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);

    try {
      await apiClient.updateTicketStatus(parseInt(ticketId || "0"), newStatus);

      toast({
        title: "Success",
        description: "Ticket status updated",
      });

      loadTicket();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    setIsUpdating(true);

    try {
      await apiClient.updateTicketPriority(parseInt(ticketId || "0"), newPriority);

      toast({
        title: "Success",
        description: "Ticket priority updated",
      });

      loadTicket();
    } catch (error: any) {
      console.error("Error updating priority:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update priority",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "destructive",
      in_progress: "default",
      resolved: "secondary",
      closed: "outline",
    } as const;
    const displayStatus = status.replace("_", " ").toUpperCase();
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{displayStatus}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: "bg-red-100 text-red-800",
      high: "bg-red-100 text-red-800",
      medium: "bg-orange-100 text-orange-800",
      low: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Ticket not found</p>
            <Button
              className="w-full mt-4 bg-[#253E44]"
              onClick={() => navigate("/admin/support")}
            >
              Back to Support
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/support")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="md:text-2xl font-bold text-gray-900">Support Ticket #{ticket.id}</h1>
              <p className="text-sm text-gray-500">{ticket.subject}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Details Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Ticket Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">User Information</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{ticket.user_name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{ticket.email || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Ticket Status</Label>
                  <div className="mt-2">
                    <Select
                      value={ticket.status}
                      onValueChange={handleStatusChange}
                      disabled={isUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Priority</Label>
                  <div className="mt-2">
                    <Select
                      value={ticket.priority}
                      onValueChange={handlePriorityChange}
                      disabled={isUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <div className="mt-2">
                    <Badge variant="outline">{ticket.category_name || "Uncategorized"}</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Timestamps</Label>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Created: {new Date(ticket.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Updated: {new Date(ticket.updated_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Status Badges</Label>
                  <div className="mt-2 space-y-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Conversation</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? "bg-[#253E44]/90 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium">
                              {message.sender_name || "Unknown"}
                            </span>
                            <span className="text-xs opacity-75">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment: any, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Paperclip className="h-3 w-3 opacity-75" />
                                  <span className="text-xs underline cursor-pointer hover:opacity-80">
                                    {typeof attachment === "string"
                                      ? attachment
                                      : attachment.filename || "File"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      rows={3}
                      disabled={isSendingMessage}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSendingMessage}
                      className="bg-[#253E44] hover:bg-[#253E44]/70"
                    >
                      {isSendingMessage ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ticket Description */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportTicketDetail;
