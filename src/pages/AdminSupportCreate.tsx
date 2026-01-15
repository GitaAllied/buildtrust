import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, User, AlertTriangle, Send, Shield } from "lucide-react";

const AdminSupportCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    subject: "",
    category: "",
    priority: "Medium",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user data for selection
  const users = [
    { id: 101, name: "John Developer", email: "john@example.com", role: "Developer" },
    { id: 102, name: "Sarah Client", email: "sarah@example.com", role: "Client" },
    { id: 103, name: "Mike Contractor", email: "mike@example.com", role: "Developer" },
    { id: 104, name: "Emily Chen", email: "emily@example.com", role: "Client" }
  ];

  const categories = [
    "Account",
    "Payment",
    "Technical",
    "Project",
    "Verification",
    "General",
    "Other"
  ];

  const handleUserSelect = (userId: string) => {
    const user = users.find(u => u.id.toString() === userId);
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId,
        userName: user.name,
        userEmail: user.email
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.subject || !formData.category || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would make an API call
      console.log("Creating support ticket:", formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form
      setFormData({
        userId: "",
        userName: "",
        userEmail: "",
        subject: "",
        category: "",
        priority: "Medium",
        description: ""
      });

      alert("Support ticket created successfully!");
      navigate('/admin/support');
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/support')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Support</span>
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">Create Support Ticket</h1>
                <p className="text-sm text-gray-500">Initiate a new support ticket for a user</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>New Support Ticket</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">Select User *</Label>
                  <Select value={formData.userId} onValueChange={handleUserSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{user.name} ({user.role})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userEmail">User Email</Label>
                  <Input
                    id="userEmail"
                    value={formData.userEmail}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Ticket Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
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

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the issue and any relevant information..."
                  rows={6}
                  required
                />
              </div>

              {/* Priority Notice */}
              {formData.priority === "Urgent" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Urgent Priority</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    This ticket will be flagged as urgent and will receive immediate attention from the support team.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/support')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Create Ticket
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSupportCreate;