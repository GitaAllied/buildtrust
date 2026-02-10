import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, MessageCircle, Send } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const TicketDetail = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!ticketId) return;

      try {
        setLoading(true);
        const [ticketData, messagesData] = await Promise.all([
          apiClient.getTicket(parseInt(ticketId)),
          apiClient.getTicketMessages(parseInt(ticketId)),
        ]);

        setTicket(ticketData);
        setMessages(Array.isArray(messagesData) ? messagesData : messagesData?.messages || []);
      } catch (err: any) {
        console.error("Error fetching ticket details:", err);
        toast({
          title: "Error",
          description: "Failed to load ticket details",
          variant: "destructive",
        });
        navigate("/support");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId, navigate, toast]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reply.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    if (!ticketId) return;

    try {
      setSubmitting(true);
      await apiClient.addTicketMessage(parseInt(ticketId), {
        sender_id: user?.id,
        content: reply.trim(),
        is_internal: false,
      });

      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      setReply("");

      // Refresh messages
      const updatedMessages = await apiClient.getTicketMessages(parseInt(ticketId));
      setMessages(Array.isArray(updatedMessages) ? updatedMessages : updatedMessages?.messages || []);
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      Open: { bg: "bg-yellow-100", text: "text-yellow-700" },
      "In Progress": { bg: "bg-blue-100", text: "text-blue-700" },
      Resolved: { bg: "bg-green-100", text: "text-green-700" },
      Closed: { bg: "bg-gray-100", text: "text-gray-700" },
    };
    return colors[status] || colors["Open"];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#226F75] mx-auto mb-2" />
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ticket not found</p>
          <Button onClick={() => navigate("/support")}>Back to Support</Button>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(ticket.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/support")}
          className="flex items-center gap-2 text-[#226F75] hover:text-[#253E44] mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Support
        </button>

        {/* Ticket Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle>{ticket.subject || "Untitled Ticket"}</CardTitle>
                  <span className={`px-3 py-1 ${statusColor.bg} ${statusColor.text} text-xs font-semibold rounded-full`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Ticket #{ticket.id}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Category</p>
                <p className="font-medium text-gray-900">{ticket.category_name || "General"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Priority</p>
                <p className="font-medium text-gray-900">{ticket.priority || "Normal"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">{ticket.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Messages Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Conversation ({messages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg ${
                      msg.sender_id === user?.id
                        ? "bg-[#226F75]/10 ml-4 border-l-4 border-[#226F75]"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm text-gray-900">
                        {msg.sender_name || "Support Team"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{msg.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No messages yet</p>
                </div>
              )}
            </div>

            {/* Reply Form */}
            {ticket.status !== "Closed" && (
              <form onSubmit={handleSubmitReply} className="border-t pt-4 space-y-4">
                <div>
                  <Label htmlFor="reply">Add Reply</Label>
                  <Textarea
                    id="reply"
                    placeholder="Type your message here..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={4}
                    disabled={submitting}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#253E44] hover:bg-[#253E44]/90 flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </form>
            )}

            {ticket.status === "Closed" && (
              <div className="border-t pt-4 text-center text-gray-500">
                <p className="text-sm">This ticket is closed and no longer accepting replies</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketDetail;
