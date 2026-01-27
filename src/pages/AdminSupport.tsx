import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  User,
  Mail,
  Phone,
  Shield,
  AlertTriangle,
  X,
  Send,
  Menu,
  Ticket,
  Settings,
  Pen,
  FileStack,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
import {
  FaBook,
  FaDoorOpen,
  FaGear,
  FaHandshake,
  FaMessage,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Clock, Save } from "lucide-react";
import { Link } from "react-router-dom";

const AdminSupport = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("support");
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
    { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
    { id: "users", label: "User Management", icon: <FaUsers /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "reports", label: "Reports", icon: <FaBook /> },
    { id: "settings", label: "Settings", icon: <FaGear /> },
    { id: "support", label: "Support", icon: <FaHandshake />, active: true },
    { id: "logout", label: "Sign Out", action: "logout", icon: <FaDoorOpen /> },
  ];
  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/super-admin-dashboard");
        break;
      case "users":
        navigate("/admin/users");
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

  const [activeSection, setActiveSection] = useState("tickets");

  const supportSections = [
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "create", label: "Create Tickets", icon: Pen },
    { id: "manage", label: "Manage Categories", icon: FileStack },
    { id: "settings", label: "Settings", icon: Settings },
  ];

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
      lastUpdate: "2024-01-08 14:20",
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
      lastUpdate: "2024-01-08 09:15",
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
      lastUpdate: "2024-01-07 13:30",
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
      lastUpdate: "2024-01-08 08:00",
    },
  ];

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesCategory =
      selectedCategory === "all" ||
      ticket.category.toLowerCase() === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" ||
      ticket.status.toLowerCase().replace(" ", "") === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      Open: "destructive",
      "In Progress": "default",
      Resolved: "secondary",
    } as const;
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-orange-100 text-orange-800",
      Low: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={colors[priority as keyof typeof colors] || ""}>
        {priority}
      </Badge>
    );
  };

  // CREATE
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    subject: "",
    category: "",
    priority: "Medium",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user data for selection
  const users = [
    {
      id: 101,
      name: "John Developer",
      email: "john@example.com",
      role: "Developer",
    },
    {
      id: 102,
      name: "Sarah Client",
      email: "sarah@example.com",
      role: "Client",
    },
    {
      id: 103,
      name: "Mike Contractor",
      email: "mike@example.com",
      role: "Developer",
    },
    { id: 104, name: "Emily Chen", email: "emily@example.com", role: "Client" },
  ];

  const categories = [
    "Account",
    "Payment",
    "Technical",
    "Project",
    "Verification",
    "General",
    "Other",
  ];

  const handleUserSelect = (userId: string) => {
    const user = users.find((u) => u.id.toString() === userId);
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userId,
        userName: user.name,
        userEmail: user.email,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.userId ||
      !formData.subject ||
      !formData.category ||
      !formData.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would make an API call
      console.log("Creating support ticket:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      setFormData({
        userId: "",
        userName: "",
        userEmail: "",
        subject: "",
        category: "",
        priority: "Medium",
        description: "",
      });

      alert("Support ticket created successfully!");
      navigate("/admin/support");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // CATEGORIES
  interface SupportCategory {
    id: number;
    name: string;
    description: string;
    ticketCount: number;
    isActive: boolean;
    createdAt: string;
    color: string;
  }

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<SupportCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  // Mock categories data
  const [categories2, setCategories2] = useState<SupportCategory[]>([
    {
      id: 1,
      name: "Account",
      description: "Account registration, login, and profile issues",
      ticketCount: 45,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#3B82F6",
    },
    {
      id: 2,
      name: "Payment",
      description: "Payment processing, refunds, and billing issues",
      ticketCount: 32,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#10B981",
    },
    {
      id: 3,
      name: "Technical",
      description: "Technical issues, bugs, and platform errors",
      ticketCount: 67,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#F59E0B",
    },
    {
      id: 4,
      name: "Project",
      description: "Project management, milestones, and deliverables",
      ticketCount: 28,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#8B5CF6",
    },
    {
      id: 5,
      name: "Verification",
      description: "Identity verification and document approval",
      ticketCount: 15,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#EF4444",
    },
    {
      id: 6,
      name: "General",
      description: "General inquiries and miscellaneous issues",
      ticketCount: 23,
      isActive: false,
      createdAt: "2024-01-01",
      color: "#6B7280",
    },
  ]);

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      // In a real app, this would make an API call
      const category: SupportCategory = {
        id: Math.max(...categories2.map((c) => c.id)) + 1,
        name: newCategory.name,
        description: newCategory.description,
        ticketCount: 0,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
        color: newCategory.color,
      };

      setCategories2((prev) => [...prev, category]);
      setNewCategory({ name: "", description: "", color: "#3B82F6" });
      setIsCreateDialogOpen(false);

      alert("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      // In a real app, this would make an API call
      setCategories2((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...editingCategory } : cat,
        ),
      );

      setIsEditDialogOpen(false);
      setEditingCategory(null);

      alert("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const category = categories2.find((c) => c.id === categoryId);
    if (!category) return;

    if (category.ticketCount > 0) {
      alert(
        `Cannot delete category "${category.name}" because it has ${category.ticketCount} associated tickets. Please reassign or close all tickets first.`,
      );
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      // In a real app, this would make an API call
      setCategories2((prev) => prev.filter((cat) => cat.id !== categoryId));
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleToggleStatus = async (categoryId: number) => {
    try {
      // In a real app, this would make an API call
      setCategories2((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat,
        ),
      );
    } catch (error) {
      console.error("Error updating category status:", error);
      alert("Failed to update category status. Please try again.");
    }
  };

  const openEditDialog = (category: SupportCategory) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  // SETTINGS
  const [settings, setSettings] = useState({
    // General Settings
    supportEmail: "support@buildtrust.com",
    supportPhone: "+1 (555) 123-4567",
    businessHours: "Mon-Fri 9AM-6PM EST",
    autoResponseEnabled: true,
    autoResponseMessage:
      "Thank you for contacting BuildTrust support. We have received your message and will respond within 24 hours.",

    // Ticket Settings
    autoAssignTickets: true,
    maxTicketsPerAgent: 10,
    ticketEscalationHours: 48,
    requireTicketApproval: false,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    slackNotifications: true,
    webhookUrl: "",

    // SLA Settings
    urgentResponseTime: 1, // hours
    highResponseTime: 4, // hours
    mediumResponseTime: 24, // hours
    lowResponseTime: 72, // hours

    // Security Settings
    requireAuthentication: true,
    allowFileUploads: true,
    maxFileSize: 10, // MB
    allowedFileTypes: ".pdf,.doc,.docx,.jpg,.png",

    // Advanced Settings
    enableChatbot: false,
    enableKnowledgeBase: true,
    enableTicketTemplates: true,
    enableAnalytics: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      // In a real app, this would make an API call
      console.log("Saving support settings:", settings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="" />
          </Link>
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
              <div className="block">
                <h1 className="md:text-2xl font-bold text-gray-900">
                  Support Center
                </h1>
                <p className="text-sm text-gray-500">
                  Manage support tickets and system alerts
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 min-h-screen bg-gray-50 flex flex-col">
          <div className="flex flex-col">
            {/* Sidebar */}
            <div className=" bg-[#226F75]/10 w-[95%] m-auto rounded-lg overflow-x-scroll scrollbar-custom my-5">
              <nav className="p-2 text-sm flex justify-around items-center gap-2">
                {supportSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 justify-center px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? "bg-[#226F75]/10 text-[#253E44] font-medium"
                          : "text-gray-600 hover:bg-[#226F75]/20"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className=" text-nowrap">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            {/* Content */}
            <div className="flex-1 w-full p-6">
              {/* TICKET */}
              {activeSection === "tickets" && (
                <div className="min-h-screen bg-gray-50">
                  <div className=" mx-auto pb-6">
                    {/* Support Tickets */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between flex-col md:flex-row gap-4">
                          <CardTitle className="flex items-center">
                            <MessageSquare className="mr-2 h-5 w-5" />
                            Support Tickets
                          </CardTitle>
                          <div className="flex items-center space-x-3 w-full md:w-fit">
                            <Select
                              value={selectedCategory}
                              onValueChange={setSelectedCategory}
                            >
                              <SelectTrigger className="w-full sm:w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="payment">Payment</SelectItem>
                                <SelectItem value="technical">
                                  Technical
                                </SelectItem>
                                <SelectItem value="account">Account</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={selectedStatus}
                              onValueChange={setSelectedStatus}
                            >
                              <SelectTrigger className="w-full sm:w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="inprogress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="resolved">
                                  Resolved
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {filteredTickets.map((ticket) => (
                            <div
                              key={ticket.id}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between md:justify-start space-x-2 mb-2">
                                    <h4 className="font-medium text-gray-900">
                                      {ticket.subject}
                                    </h4>
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
                                    <span>
                                      Last update: {ticket.lastUpdate}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-start space-x-2 mt-3 sm:mt-0">
                                  {getStatusBadge(ticket.status)}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      navigate(
                                        `/admin/support/ticket/${ticket.id}`,
                                      )
                                    }
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
              )}
              {/* CREATE TICKET */}
              {activeSection === "create" && (
                <div className="min-h-screen bg-gray-50">
                  <div className=" mx-auto pb-6">
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
                              <Select
                                value={formData.userId}
                                onValueChange={handleUserSelect}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a user" />
                                </SelectTrigger>
                                <SelectContent>
                                  {users.map((user) => (
                                    <SelectItem
                                      key={user.id}
                                      value={user.id.toString()}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>
                                          {user.name} ({user.role})
                                        </span>
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
                              <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    category: value,
                                  }))
                                }
                              >
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
                              <Select
                                value={formData.priority}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    priority: value,
                                  }))
                                }
                              >
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
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  subject: e.target.value,
                                }))
                              }
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
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
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
                                <span className="text-sm font-medium text-red-800">
                                  Urgent Priority
                                </span>
                              </div>
                              <p className="text-sm text-red-700 mt-1">
                                This ticket will be flagged as urgent and will
                                receive immediate attention from the support
                                team.
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex justify-end space-x-4 pt-6 border-t">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => navigate("/admin/support")}
                              disabled={isSubmitting}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-[#253E44] hover:bg-[#253E44]/70"
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
              )}
              {/* MANAGE CATEGORIES */}
              {activeSection === "manage" && (
                <div className="min-h-screen bg-gray-50">
                  {/* Header */}
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <Dialog
                      open={isCreateDialogOpen}
                      onOpenChange={setIsCreateDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-[#253E44] hover:bg-[#253E44]/90 fixed bottom-6 right-6 z-50">
                          <Plus className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Add Category</span>
                          <span className="sm:hidden">Add</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-md">
                        <DialogHeader>
                          <DialogTitle>Create New Category</DialogTitle>
                          <DialogDescription>
                            Add a new support ticket category to organize
                            tickets better.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Category Name *</Label>
                            <Input
                              id="name"
                              value={newCategory.name}
                              onChange={(e) =>
                                setNewCategory((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="Enter category name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                              id="description"
                              value={newCategory.description}
                              onChange={(e) =>
                                setNewCategory((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Brief description of the category"
                            />
                          </div>
                          <div>
                            <Label htmlFor="color">Color</Label>
                            <Input
                              id="color"
                              type="color"
                              value={newCategory.color}
                              onChange={(e) =>
                                setNewCategory((prev) => ({
                                  ...prev,
                                  color: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCreateCategory}
                            className="bg-[#253E44] hover:bg-[#253E44]/90"
                          >
                            Create Category
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="mx-auto pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {categories2.map((category) => (
                        <Card
                          key={category.id}
                          className={`relative ${!category.isActive ? "opacity-60" : ""}`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                <CardTitle className="text-lg">
                                  {category.name}
                                </CardTitle>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(category)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteCategory(category.id)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                              {category.description}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                              <Badge
                                variant={
                                  category.isActive ? "default" : "secondary"
                                }
                              >
                                {category.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {category.ticketCount} tickets
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-xs text-gray-500">
                                Created: {category.createdAt}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(category.id)}
                                className="self-start sm:self-auto w-full sm:w-auto"
                              >
                                {category.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Edit Category Dialog */}
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogContent className="w-full max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                          <DialogDescription>
                            Update the category details and settings.
                          </DialogDescription>
                        </DialogHeader>
                        {editingCategory && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name">Category Name *</Label>
                              <Input
                                id="edit-name"
                                value={editingCategory.name}
                                onChange={(e) =>
                                  setEditingCategory((prev) =>
                                    prev
                                      ? { ...prev, name: e.target.value }
                                      : null,
                                  )
                                }
                                placeholder="Enter category name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-description">
                                Description
                              </Label>
                              <Input
                                id="edit-description"
                                value={editingCategory.description}
                                onChange={(e) =>
                                  setEditingCategory((prev) =>
                                    prev
                                      ? { ...prev, description: e.target.value }
                                      : null,
                                  )
                                }
                                placeholder="Brief description of the category"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-color">Color</Label>
                              <Input
                                id="edit-color"
                                type="color"
                                value={editingCategory.color}
                                onChange={(e) =>
                                  setEditingCategory((prev) =>
                                    prev
                                      ? { ...prev, color: e.target.value }
                                      : null,
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleEditCategory}
                            className="bg-[#253E44] hover:bg-[#253E44]/70"
                          >
                            Update Category
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {categories.length === 0 && (
                      <div className="text-center py-12">
                        <Tag className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No categories found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by creating your first support category.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* SETTINGS */}
              {activeSection === "settings" && (
                <div className="min-h-screen bg-gray-50">
                  <div className="mx-auto pb-6 flex flex-col items-end">
                    <div className="space-y-6 mb-6 w-full">
                      {/* General Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Settings className="h-5 w-5" />
                            <span>General Settings</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="supportEmail">
                                Support Email
                              </Label>
                              <Input
                                id="supportEmail"
                                value={settings.supportEmail}
                                onChange={(e) =>
                                  handleInputChange(
                                    "supportEmail",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="supportPhone">
                                Support Phone
                              </Label>
                              <Input
                                id="supportPhone"
                                value={settings.supportPhone}
                                onChange={(e) =>
                                  handleInputChange(
                                    "supportPhone",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="businessHours">
                              Business Hours
                            </Label>
                            <Input
                              id="businessHours"
                              value={settings.businessHours}
                              onChange={(e) =>
                                handleInputChange(
                                  "businessHours",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="autoResponse">
                                Auto Response
                              </Label>
                              <Switch
                                id="autoResponse"
                                checked={settings.autoResponseEnabled}
                                onCheckedChange={(checked) =>
                                  handleInputChange(
                                    "autoResponseEnabled",
                                    checked,
                                  )
                                }
                              />
                            </div>
                            {settings.autoResponseEnabled && (
                              <Textarea
                                value={settings.autoResponseMessage}
                                onChange={(e) =>
                                  handleInputChange(
                                    "autoResponseMessage",
                                    e.target.value,
                                  )
                                }
                                placeholder="Auto response message"
                                rows={3}
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Ticket Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5" />
                            <span>Ticket Settings</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="autoAssign">
                                  Auto Assign Tickets
                                </Label>
                                <Switch
                                  id="autoAssign"
                                  checked={settings.autoAssignTickets}
                                  onCheckedChange={(checked) =>
                                    handleInputChange(
                                      "autoAssignTickets",
                                      checked,
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="requireApproval">
                                  Require Ticket Approval
                                </Label>
                                <Switch
                                  id="requireApproval"
                                  checked={settings.requireTicketApproval}
                                  onCheckedChange={(checked) =>
                                    handleInputChange(
                                      "requireTicketApproval",
                                      checked,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="maxTickets">
                                Max Tickets per Agent
                              </Label>
                              <Input
                                id="maxTickets"
                                type="number"
                                value={settings.maxTicketsPerAgent}
                                onChange={(e) =>
                                  handleInputChange(
                                    "maxTicketsPerAgent",
                                    parseInt(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="escalationHours">
                                Escalation Hours
                              </Label>
                              <Input
                                id="escalationHours"
                                type="number"
                                value={settings.ticketEscalationHours}
                                onChange={(e) =>
                                  handleInputChange(
                                    "ticketEscalationHours",
                                    parseInt(e.target.value),
                                  )
                                }
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* SLA Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5" />
                            <span>SLA Settings (Response Time in Hours)</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="urgentResponse">
                                Urgent Priority
                              </Label>
                              <Input
                                id="urgentResponse"
                                type="number"
                                value={settings.urgentResponseTime}
                                onChange={(e) =>
                                  handleInputChange(
                                    "urgentResponseTime",
                                    parseInt(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="highResponse">
                                High Priority
                              </Label>
                              <Input
                                id="highResponse"
                                type="number"
                                value={settings.highResponseTime}
                                onChange={(e) =>
                                  handleInputChange(
                                    "highResponseTime",
                                    parseInt(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mediumResponse">
                                Medium Priority
                              </Label>
                              <Input
                                id="mediumResponse"
                                type="number"
                                value={settings.mediumResponseTime}
                                onChange={(e) =>
                                  handleInputChange(
                                    "mediumResponseTime",
                                    parseInt(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lowResponse">Low Priority</Label>
                              <Input
                                id="lowResponse"
                                type="number"
                                value={settings.lowResponseTime}
                                onChange={(e) =>
                                  handleInputChange(
                                    "lowResponseTime",
                                    parseInt(e.target.value),
                                  )
                                }
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Notification Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Bell className="h-5 w-5" />
                            <span>Notification Settings</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="emailNotif">
                                Email Notifications
                              </Label>
                              <Switch
                                id="emailNotif"
                                checked={settings.emailNotifications}
                                onCheckedChange={(checked) =>
                                  handleInputChange(
                                    "emailNotifications",
                                    checked,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="smsNotif">
                                SMS Notifications
                              </Label>
                              <Switch
                                id="smsNotif"
                                checked={settings.smsNotifications}
                                onCheckedChange={(checked) =>
                                  handleInputChange("smsNotifications", checked)
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="slackNotif">
                                Slack Notifications
                              </Label>
                              <Switch
                                id="slackNotif"
                                checked={settings.slackNotifications}
                                onCheckedChange={(checked) =>
                                  handleInputChange(
                                    "slackNotifications",
                                    checked,
                                  )
                                }
                              />
                            </div>
                          </div>

                          {settings.slackNotifications && (
                            <div className="space-y-2">
                              <Label htmlFor="webhookUrl">
                                Slack Webhook URL
                              </Label>
                              <Input
                                id="webhookUrl"
                                value={settings.webhookUrl}
                                onChange={(e) =>
                                  handleInputChange(
                                    "webhookUrl",
                                    e.target.value,
                                  )
                                }
                                placeholder="https://hooks.slack.com/services/..."
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Security Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Security Settings</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="requireAuth">
                                Require Authentication
                              </Label>
                              <Switch
                                id="requireAuth"
                                checked={settings.requireAuthentication}
                                onCheckedChange={(checked) =>
                                  handleInputChange(
                                    "requireAuthentication",
                                    checked,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="allowUploads">
                                Allow File Uploads
                              </Label>
                              <Switch
                                id="allowUploads"
                                checked={settings.allowFileUploads}
                                onCheckedChange={(checked) =>
                                  handleInputChange("allowFileUploads", checked)
                                }
                              />
                            </div>
                          </div>

                          {settings.allowFileUploads && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="maxFileSize">
                                  Max File Size (MB)
                                </Label>
                                <Input
                                  id="maxFileSize"
                                  type="number"
                                  value={settings.maxFileSize}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "maxFileSize",
                                      parseInt(e.target.value),
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="allowedTypes">
                                  Allowed File Types
                                </Label>
                                <Input
                                  id="allowedTypes"
                                  value={settings.allowedFileTypes}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "allowedFileTypes",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=".pdf,.doc,.jpg,..."
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Advanced Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5" />
                            <span>Advanced Settings</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="enableChatbot">
                                Enable Chatbot
                              </Label>
                              <Switch
                                id="enableChatbot"
                                checked={settings.enableChatbot}
                                onCheckedChange={(checked) =>
                                  handleInputChange("enableChatbot", checked)
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="enableKB">
                                Enable Knowledge Base
                              </Label>
                              <Switch
                                id="enableKB"
                                checked={settings.enableKnowledgeBase}
                                onCheckedChange={(checked) =>
                                  handleInputChange(
                                    "enableKnowledgeBase",
                                    checked,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="enableTemplates">
                                Enable Ticket Templates
                              </Label>
                              <Switch
                                id="enableTemplates"
                                checked={settings.enableTicketTemplates}
                                onCheckedChange={(checked) =>
                                  handleInputChange(
                                    "enableTicketTemplates",
                                    checked,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="enableAnalytics">
                                Enable Analytics
                              </Label>
                              <Switch
                                id="enableAnalytics"
                                checked={settings.enableAnalytics}
                                onCheckedChange={(checked) =>
                                  handleInputChange("enableAnalytics", checked)
                                }
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Button
                      onClick={handleSaveSettings}
                      className="bg-[#253E44] hover:bg-[#253E44]/90 w-fit"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
