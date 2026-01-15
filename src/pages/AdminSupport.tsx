import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { MessageSquare, User, Mail, Phone, Shield, AlertTriangle } from "lucide-react";

const AdminSupport = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const supportTickets = [
    {
      id: 1,
      user: "John Developer",
      email: "john@example.com",
      subject: "Payment not received",
      category: "Payment",
      status: "Open",
      priority: "High",
      created: "2024-01-08 10:30",
      lastUpdate: "2024-01-08 14:20"
    },
    {
      id: 2,
      user: "Sarah Client",
      email: "sarah@example.com",
      subject: "Unable to upload project files",
      category: "Technical",
      status: "In Progress",
      priority: "Medium",
      created: "2024-01-07 16:45",
      lastUpdate: "2024-01-08 09:15"
    },
    {
      id: 3,
      user: "Mike Contractor",
      email: "mike@example.com",
      subject: "Account verification issue",
      category: "Account",
      status: "Resolved",
      priority: "Low",
      created: "2024-01-06 11:20",
      lastUpdate: "2024-01-07 13:30"
    },
    {
      id: 4,
      user: "Admin User",
      email: "admin@example.com",
      subject: "System performance report",
      category: "System",
      status: "Open",
      priority: "High",
      created: "2024-01-08 08:00",
      lastUpdate: "2024-01-08 08:00"
    }
  ];

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesCategory = selectedCategory === "all" || ticket.category.toLowerCase() === selectedCategory;
    const matchesStatus = selectedStatus === "all" || ticket.status.toLowerCase().replace(" ", "") === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      "Open": "destructive",
      "In Progress": "default",
      "Resolved": "secondary"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      "High": "bg-red-100 text-red-800",
      "Medium": "bg-orange-100 text-orange-800",
      "Low": "bg-green-100 text-green-800"
    };
    return <Badge className={colors[priority as keyof typeof colors] || ""}>{priority}</Badge>;
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
                onClick={() => navigate('/super-admin-dashboard')}
                className="flex items-center space-x-2"
              >
                <Shield className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
                <p className="text-sm text-gray-500">Manage support tickets and system alerts</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Support Tickets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Support Tickets
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {ticket.user}
                            </span>
                            <span className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {ticket.email}
                            </span>
                            <span>Category: {ticket.category}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Created: {ticket.created}</span>
                            <span>Last update: {ticket.lastUpdate}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                          {getStatusBadge(ticket.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/support/ticket/${ticket.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Support Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Open Tickets</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="font-semibold">2.3 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolution Rate</span>
                  <span className="font-semibold">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Alerts</span>
                  <span className="font-semibold text-red-600">2</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/admin/support/create')}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Create Ticket
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/admin/support/categories')}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Manage Categories
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/admin/support/settings')}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Ticket #123 resolved</span>
                    <span className="text-gray-500">5 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New ticket from John</span>
                    <span className="text-gray-500">12 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alert acknowledged</span>
                    <span className="text-gray-500">1 hour ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System backup completed</span>
                    <span className="text-gray-500">2 hours ago</span>
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

export default AdminSupport;