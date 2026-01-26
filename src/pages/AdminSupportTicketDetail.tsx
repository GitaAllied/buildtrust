import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, User, Mail, Phone, Clock, AlertTriangle, CheckCircle, Send, Paperclip, Eye, Shield } from "lucide-react";

interface Message {
  id: number;
  sender: "admin" | "user";
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

const AdminSupportTicketDetail = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [ticketStatus, setTicketStatus] = useState("In Progress");
  const [ticketPriority, setTicketPriority] = useState("Medium");

  // Mock ticket data
  const ticket = {
    id: parseInt(ticketId || "1"),
    user: "John Developer",
    userId: 101,
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    subject: "Payment not received for completed project",
    category: "Payment",
    status: "In Progress",
    priority: "High",
    created: "2024-01-08 10:30",
    lastUpdate: "2024-01-09 09:15",
    description: "I completed a project for client XYZ on January 5th, but I haven't received payment yet. The project was marked as completed and approved. Please help me resolve this payment issue.",
    userRole: "Developer",
    projectId: "PROJ-2024-001",
    amount: "$2,500.00"
  };

  const messages: Message[] = [
    {
      id: 1,
      sender: "user",
      senderName: "John Developer",
      content: ticket.description,
      timestamp: "2024-01-08 10:30",
      attachments: ["project_completion_proof.pdf", "invoice_001.pdf"]
    },
    {
      id: 2,
      sender: "admin",
      senderName: "Support Admin",
      content: "Thank you for reaching out, John. I've reviewed your project completion and can see that it was indeed marked as completed on January 5th. Let me check the payment processing status with our finance team.",
      timestamp: "2024-01-08 11:45"
    },
    {
      id: 3,
      sender: "user",
      senderName: "John Developer",
      content: "Thank you for looking into this. I've attached the project deliverables and invoice for your reference. The client confirmed completion but payment hasn't been processed yet.",
      timestamp: "2024-01-08 14:20"
    },
    {
      id: 4,
      sender: "admin",
      senderName: "Support Admin",
      content: "I've contacted our finance team and they confirmed there's a delay in the payment processing system. The payment should be processed within the next 24 hours. I'll keep you updated on the status.",
      timestamp: "2024-01-09 09:15"
    }
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // In a real app, this would make an API call
      console.log("Sending message:", {
        ticketId: ticket.id,
        content: newMessage,
        timestamp: new Date().toISOString()
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Reset message input
      setNewMessage("");

      // In a real app, you would update the messages list here
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      // In a real app, this would make an API call
      console.log("Updating ticket status:", { ticketId: ticket.id, status: newStatus });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setTicketStatus(newStatus);
      alert(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      // In a real app, this would make an API call
      console.log("Updating ticket priority:", { ticketId: ticket.id, priority: newPriority });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setTicketPriority(newPriority);
      alert(`Ticket priority updated to ${newPriority}`);
    } catch (error) {
      console.error("Error updating priority:", error);
      alert("Failed to update priority. Please try again.");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "Open": "destructive",
      "In Progress": "default",
      "Resolved": "secondary",
      "Closed": "outline"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      "Low": "secondary",
      "Medium": "default",
      "High": "destructive",
      "Urgent": "destructive"
    } as const;
    return <Badge variant={variants[priority as keyof typeof variants] || "outline"}>{priority}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/support')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support Ticket #{ticket.id}</h1>
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
                      <span className="text-sm">{ticket.user}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{ticket.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{ticket.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Ticket Status</Label>
                  <div className="mt-2">
                    <Select value={ticketStatus} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Priority</Label>
                  <div className="mt-2">
                    <Select value={ticketPriority} onValueChange={handlePriorityChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <div className="mt-2">
                    <Badge variant="outline">{ticket.category}</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Timestamps</Label>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Created: {ticket.created}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Updated: {ticket.lastUpdate}</span>
                    </div>
                  </div>
                </div>

                {ticket.projectId && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Related Project</Label>
                    <div className="mt-2">
                      <Badge variant="secondary">{ticket.projectId}</Badge>
                      {ticket.amount && <span className="ml-2 text-sm text-gray-600">{ticket.amount}</span>}
                    </div>
                  </div>
                )}
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
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "admin" ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "admin"
                          ? 'bg-[#253E44]/90 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.sender === "admin" ? 'You' : message.senderName}
                          </span>
                          <span className="text-xs opacity-75">
                            {message.timestamp.split(' ')[1]}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Paperclip className="h-3 w-3 opacity-75" />
                                <span className="text-xs underline cursor-pointer hover:opacity-80">
                                  {attachment}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-[#253E44] hover:bg-[#253E44]/70"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportTicketDetail;