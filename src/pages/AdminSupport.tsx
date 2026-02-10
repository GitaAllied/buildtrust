import { useState, useEffect } from "react";
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
  X,
  Menu,
  Ticket,
  Settings,
  Pen,
  FileStack,
  Loader,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Tag, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openAdminSidebar, openSignoutModal } from "@/redux/action";

const AdminSupport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // UI State
  const dispatch = useDispatch();
  const isOpen = useSelector((state: any) => state.sidebar.adminSidebar);
  const signOutModal = useSelector((state: any) => state.signout);
  const [activeSection, setActiveSection] = useState("tickets");

  // Data States
  const [tickets, setTickets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [supportSettings, setSupportSettings] = useState<any>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Loading States
  const [loading, setLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Mock data for when API is not connected
  const mockTickets = [
    {
      id: 1,
      subject: "Payment Processing Issue",
      description: "Unable to process payment for project completion",
      user_id: 1,
      user_name: "Ade Johnson",
      category_id: 1,
      category_name: "Billing",
      priority: "high",
      status: "open",
      created_at: "2025-02-09 10:30:00",
      updated_at: "2025-02-09 10:30:00",
    },
    {
      id: 2,
      subject: "Account Verification Delay",
      description: "My account verification is taking longer than expected",
      user_id: 2,
      user_name: "Chioma Okafor",
      category_id: 2,
      category_name: "Account",
      priority: "medium",
      status: "in_progress",
      created_at: "2025-02-08 14:20:00",
      updated_at: "2025-02-09 08:15:00",
    },
    {
      id: 3,
      subject: "Project Timeline Concern",
      description: "Worried about project deadline - need to reschedule",
      user_id: 3,
      user_name: "Ibrahim Ahmed",
      category_id: 3,
      category_name: "Projects",
      priority: "medium",
      status: "open",
      created_at: "2025-02-07 09:45:00",
      updated_at: "2025-02-07 09:45:00",
    },
    {
      id: 4,
      subject: "Contract Review Question",
      description: "Need clarification on contract terms",
      user_id: 4,
      user_name: "Grace Oluwaseun",
      category_id: 4,
      category_name: "Contracts",
      priority: "low",
      status: "resolved",
      created_at: "2025-02-05 11:20:00",
      updated_at: "2025-02-06 16:30:00",
    },
  ];

  const mockCategories = [
    {
      id: 1,
      name: "Billing",
      description: "Payment and billing related issues",
      color: "#EF4444",
    },
    {
      id: 2,
      name: "Account",
      description: "Account and profile related issues",
      color: "#3B82F6",
    },
    {
      id: 3,
      name: "Projects",
      description: "Project and timeline related issues",
      color: "#10B981",
    },
    {
      id: 4,
      name: "Contracts",
      description: "Contract and agreement related issues",
      color: "#F59E0B",
    },
    {
      id: 5,
      name: "Technical",
      description: "Technical and platform issues",
      color: "#8B5CF6",
    },
  ];

  // Dialog States
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Form States
  const [formData, setFormData] = useState({
    user_id: user?.id || 0,
    subject: "",
    description: "",
    category_id: "",
    priority: "medium",
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadTickets();
    loadCategories();
    loadSettings();
  }, []);

  // Load tickets with filters
  const loadTickets = async () => {
    try {
      setTicketsLoading(true);
      const response = await apiClient.getTickets({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined,
        search: searchTerm || undefined,
      });
      setTickets(response.tickets || []);
    } catch (error: any) {
      console.error("Error loading tickets:", error);
      console.warn("Using mock data due to API connection issue");
      // Use mock data when API fails
      setTickets(mockTickets);
      toast({
        title: "Demo Mode",
        description: "Showing demo data - API connection unavailable",
        variant: "default",
      });
    } finally {
      setTicketsLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await apiClient.getCategories();
      setCategories(response || []);
    } catch (error: any) {
      console.error("Error loading categories:", error);
      console.warn("Using mock data due to API connection issue");
      // Use mock data when API fails
      setCategories(mockCategories);
      toast({
        title: "Demo Mode",
        description: "Showing demo data - API connection unavailable",
        variant: "default",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Load settings
  const loadSettings = async () => {
    try {
      const response = await apiClient.getSupportSettings();
      setSupportSettings(response);
    } catch (error: any) {
      console.error("Error loading settings:", error);
    }
  };

  // Reload when filters change
  useEffect(() => {
    loadTickets();
  }, [selectedCategory, selectedStatus, selectedPriority, searchTerm]);

  const supportSections = [
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "create", label: "Create Tickets", icon: Pen },
    { id: "manage", label: "Manage Categories", icon: FileStack },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Ticket Status Badge
  const getStatusBadge = (status: string) => {
    const variants = {
      open: "destructive",
      in_progress: "default",
      resolved: "secondary",
      closed: "outline",
    } as const;
    const displayStatus = status.replace("_", " ").toUpperCase();
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {displayStatus}
      </Badge>
    );
  };

  // Priority Badge
  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: "bg-red-100 text-red-800",
      high: "bg-red-100 text-red-800",
      medium: "bg-orange-100 text-orange-800",
      low: "bg-green-100 text-green-800",
    };
    return (
      <Badge
        className={
          colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {priority.toUpperCase()}
      </Badge>
    );
  };

  // Create Ticket Handler
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.description || !formData.category_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.createTicket({
        user_id: user?.id || formData.user_id,
        subject: formData.subject,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        priority: formData.priority,
      });

      toast({
        title: "Success",
        description: "Ticket created successfully",
      });

      setFormData({
        user_id: user?.id || 0,
        subject: "",
        description: "",
        category_id: "",
        priority: "medium",
      });

      loadTickets();
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create ticket",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create Category Handler
  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiClient.createCategory({
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color,
      });

      toast({
        title: "Success",
        description: "Category created successfully",
      });

      setNewCategory({ name: "", description: "", color: "#3B82F6" });
      setIsCreateDialogOpen(false);
      loadCategories();
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create category",
        variant: "destructive",
      });
    }
  };

  // Update Category Handler
  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiClient.updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description,
        color: editingCategory.color,
        is_active: editingCategory.is_active,
      });

      toast({
        title: "Success",
        description: "Category updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update category",
        variant: "destructive",
      });
    }
  };

  // Toggle Category Status
  const handleToggleCategoryStatus = async (categoryId: number) => {
    try {
      await apiClient.toggleCategoryStatus(categoryId);
      toast({
        title: "Success",
        description: "Category status toggled",
      });
      loadCategories();
    } catch (error: any) {
      console.error("Error toggling category:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to toggle category",
        variant: "destructive",
      });
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    if (
      category.ticket_count > 0 &&
      !confirm(
        `This category has ${category.ticket_count} associated tickets. Are you sure you want to delete it?`,
      )
    ) {
      return;
    }

    try {
      await apiClient.deleteCategory(categoryId);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      loadCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Update Ticket Status
  const handleUpdateTicketStatus = async (ticketId: number, status: string) => {
    try {
      await apiClient.updateTicketStatus(ticketId, status);
      toast({
        title: "Success",
        description: "Ticket status updated",
      });
      loadTickets();
    } catch (error: any) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update ticket",
        variant: "destructive",
      });
    }
  };

  // Update Ticket Priority
  const handleUpdateTicketPriority = async (
    ticketId: number,
    priority: string,
  ) => {
    try {
      await apiClient.updateTicketPriority(ticketId, priority);
      toast({
        title: "Success",
        description: "Ticket priority updated",
      });
      loadTickets();
    } catch (error: any) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update ticket",
        variant: "destructive",
      });
    }
  };

  // Delete Ticket
  const handleDeleteTicket = async (ticketId: number) => {
    if (!confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    try {
      await apiClient.deleteTicket(ticketId);
      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      });
      loadTickets();
    } catch (error: any) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete ticket",
        variant: "destructive",
      });
    }
  };

  // Settings Handlers
  const handleSaveGeneralSettings = async () => {
    try {
      const settings = supportSettings.general_settings || {};
      await apiClient.updateSupportGeneralSettings(settings);
      toast({
        title: "Success",
        description: "General settings saved",
      });
      loadSettings();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveTicketSettings = async () => {
    try {
      const settings = supportSettings.ticket_settings || {};
      await apiClient.updateSupportTicketSettings(settings);
      toast({
        title: "Success",
        description: "Ticket settings saved",
      });
      loadSettings();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveSLASettings = async () => {
    try {
      const settings = supportSettings.sla_settings || {};
      await apiClient.updateSupportSLASettings(settings);
      toast({
        title: "Success",
        description: "SLA settings saved",
      });
      loadSettings();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      const settings = supportSettings.notification_settings || {};
      await apiClient.updateSupportNotificationSettings(settings);
      toast({
        title: "Success",
        description: "Notification settings saved",
      });
      loadSettings();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      const settings = supportSettings.security_settings || {};
      await apiClient.updateSupportSecuritySettings(settings);
      toast({
        title: "Success",
        description: "Security settings saved",
      });
      loadSettings();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveAdvancedSettings = async () => {
    try {
      const settings = supportSettings.advanced_settings || {};
      await apiClient.updateSupportAdvancedSettings(settings);
      toast({
        title: "Success",
        description: "Advanced settings saved",
      });
      loadSettings();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="Logo" />
          </Link>
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
      <AdminSidebar active={"support"} />

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
                  Manage support tickets and system settings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 min-h-screen bg-gray-50 flex flex-col">
          {/* Navigation Tabs */}
          <div className="bg-[#226F75]/10 w-[95%] m-auto rounded-lg overflow-x-auto scrollbar-custom my-5">
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
                    <span className="text-nowrap">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 w-full p-6">
            {/* TICKETS SECTION */}
            {activeSection === "tickets" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:flex-1"
                  />
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedPriority}
                    onValueChange={setSelectedPriority}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tickets List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Support Tickets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ticketsLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader className="h-6 w-6 animate-spin" />
                      </div>
                    ) : tickets.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No tickets found
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {tickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between flex-wrap gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-gray-900 truncate">
                                    #{ticket.id} - {ticket.subject}
                                  </h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {ticket.user_name || "Unknown"} (
                                  {ticket.email || "N/A"})
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {getStatusBadge(ticket.status)}
                                  {getPriorityBadge(ticket.priority)}
                                  <Badge variant="outline">
                                    {ticket.category_name || "Uncategorized"}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      ticket.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Select
                                  value={ticket.status}
                                  onValueChange={(value) =>
                                    handleUpdateTicketStatus(ticket.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="resolved">
                                      Resolved
                                    </SelectItem>
                                    <SelectItem value="closed">
                                      Closed
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={ticket.priority}
                                  onValueChange={(value) =>
                                    handleUpdateTicketPriority(ticket.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">
                                      Urgent
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
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
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteTicket(ticket.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* CREATE TICKET SECTION */}
            {activeSection === "create" && (
              <div className="max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Support Ticket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateTicket} className="space-y-6">
                      <div>
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

                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category_id}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              category_id: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.id.toString()}
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
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
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
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
                          placeholder="Detailed description of the issue"
                          rows={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="bg-[#253E44] hover:bg-[#253E44]/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Ticket"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* MANAGE CATEGORIES SECTION */}
            {activeSection === "manage" && (
              <div>
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#253E44] hover:bg-[#253E44]/90 mb-6">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                      <DialogDescription>
                        Add a new support ticket category
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
                          placeholder="e.g., Payment, Technical"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newCategory.description}
                          onChange={(e) =>
                            setNewCategory((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Category description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <div className="flex gap-2 items-center">
                          <input
                            id="color"
                            type="color"
                            value={newCategory.color}
                            onChange={(e) =>
                              setNewCategory((prev) => ({
                                ...prev,
                                color: e.target.value,
                              }))
                            }
                            className="h-10 w-20"
                          />
                          <span className="text-sm text-gray-600">
                            {newCategory.color}
                          </span>
                        </div>
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
                        className="bg-[#253E44]"
                        onClick={handleCreateCategory}
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriesLoading ? (
                    <div className="flex justify-center items-center col-span-full py-8">
                      <Loader className="h-6 w-6 animate-spin" />
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center col-span-full py-8">
                      <Tag className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No categories found
                      </h3>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <Card key={category.id}>
                        <CardContent className="pt-6">
                          <div className="mb-4">
                            <div
                              className="h-2 w-full rounded-full mb-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <h3 className="font-semibold text-gray-900">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {category.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-gray-500">
                              {category.ticket_count || 0} tickets
                            </span>
                            <Switch
                              checked={category.is_active}
                              onCheckedChange={() =>
                                handleToggleCategoryStatus(category.id)
                              }
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setEditingCategory(category);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Edit Category Dialog */}
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogContent className="w-full max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Category Name *</Label>
                          <Input
                            id="edit-name"
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={editingCategory.description}
                            onChange={(e) =>
                              setEditingCategory((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-color">Color</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              id="edit-color"
                              type="color"
                              value={editingCategory.color}
                              onChange={(e) =>
                                setEditingCategory((prev) => ({
                                  ...prev,
                                  color: e.target.value,
                                }))
                              }
                              className="h-10 w-20"
                            />
                            <span className="text-sm text-gray-600">
                              {editingCategory.color}
                            </span>
                          </div>
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
                        className="bg-[#253E44]"
                        onClick={handleUpdateCategory}
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* SETTINGS SECTION */}
            {activeSection === "settings" && (
              <div className="space-y-6 pb-6">
                {!supportSettings ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* General Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <MessageSquare className="h-5 w-5" />
                          <span>General Settings</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="email">Support Email</Label>
                          <Input
                            id="email"
                            value={
                              supportSettings.general_settings?.supportEmail ||
                              ""
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                general_settings: {
                                  ...prev.general_settings,
                                  supportEmail: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Support Phone</Label>
                          <Input
                            id="phone"
                            value={
                              supportSettings.general_settings?.supportPhone ||
                              ""
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                general_settings: {
                                  ...prev.general_settings,
                                  supportPhone: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="hours">Business Hours</Label>
                          <Input
                            id="hours"
                            value={
                              supportSettings.general_settings?.businessHours ||
                              ""
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                general_settings: {
                                  ...prev.general_settings,
                                  businessHours: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="auto-response">
                            Enable Auto Response
                          </Label>
                          <Switch
                            checked={
                              supportSettings.general_settings
                                ?.autoResponseEnabled || false
                            }
                            onCheckedChange={(checked) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                general_settings: {
                                  ...prev.general_settings,
                                  autoResponseEnabled: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="auto-message">
                            Auto Response Message
                          </Label>
                          <Textarea
                            id="auto-message"
                            value={
                              supportSettings.general_settings
                                ?.autoResponseMessage || ""
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                general_settings: {
                                  ...prev.general_settings,
                                  autoResponseMessage: e.target.value,
                                },
                              }))
                            }
                            rows={3}
                          />
                        </div>
                        <Button
                          className="bg-[#253E44]"
                          onClick={handleSaveGeneralSettings}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save General Settings
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Ticket Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Ticket Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Label htmlFor="auto-assign">
                            Auto Assign Tickets
                          </Label>
                          <Switch
                            checked={
                              supportSettings.ticket_settings
                                ?.autoAssignTickets || false
                            }
                            onCheckedChange={(checked) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                ticket_settings: {
                                  ...prev.ticket_settings,
                                  autoAssignTickets: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="max-tickets">
                            Max Tickets Per Agent
                          </Label>
                          <Input
                            id="max-tickets"
                            type="number"
                            value={
                              supportSettings.ticket_settings
                                ?.maxTicketsPerAgent || 10
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                ticket_settings: {
                                  ...prev.ticket_settings,
                                  maxTicketsPerAgent: parseInt(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="escalation">
                            Ticket Escalation Hours
                          </Label>
                          <Input
                            id="escalation"
                            type="number"
                            value={
                              supportSettings.ticket_settings
                                ?.ticketEscalationHours || 48
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                ticket_settings: {
                                  ...prev.ticket_settings,
                                  ticketEscalationHours: parseInt(
                                    e.target.value,
                                  ),
                                },
                              }))
                            }
                          />
                        </div>
                        <Button
                          className="bg-[#253E44]"
                          onClick={handleSaveTicketSettings}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Ticket Settings
                        </Button>
                      </CardContent>
                    </Card>

                    {/* SLA Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          SLA Settings (Response Times in Hours)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="urgent">Urgent</Label>
                          <Input
                            id="urgent"
                            type="number"
                            value={
                              supportSettings.sla_settings
                                ?.urgentResponseTime || 1
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                sla_settings: {
                                  ...prev.sla_settings,
                                  urgentResponseTime: parseInt(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="high">High</Label>
                          <Input
                            id="high"
                            type="number"
                            value={
                              supportSettings.sla_settings?.highResponseTime ||
                              4
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                sla_settings: {
                                  ...prev.sla_settings,
                                  highResponseTime: parseInt(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="medium">Medium</Label>
                          <Input
                            id="medium"
                            type="number"
                            value={
                              supportSettings.sla_settings
                                ?.mediumResponseTime || 24
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                sla_settings: {
                                  ...prev.sla_settings,
                                  mediumResponseTime: parseInt(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="low">Low</Label>
                          <Input
                            id="low"
                            type="number"
                            value={
                              supportSettings.sla_settings?.lowResponseTime ||
                              72
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                sla_settings: {
                                  ...prev.sla_settings,
                                  lowResponseTime: parseInt(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                        <Button
                          className="bg-[#253E44]"
                          onClick={handleSaveSLASettings}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save SLA Settings
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Label htmlFor="email-notify">
                            Email Notifications
                          </Label>
                          <Switch
                            checked={
                              supportSettings.notification_settings
                                ?.emailNotifications || false
                            }
                            onCheckedChange={(checked) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                notification_settings: {
                                  ...prev.notification_settings,
                                  emailNotifications: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="slack-notify">
                            Slack Notifications
                          </Label>
                          <Switch
                            checked={
                              supportSettings.notification_settings
                                ?.slackNotifications || false
                            }
                            onCheckedChange={(checked) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                notification_settings: {
                                  ...prev.notification_settings,
                                  slackNotifications: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <Button
                          className="bg-[#253E44]"
                          onClick={handleSaveNotificationSettings}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Notification Settings
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Label htmlFor="require-auth">
                            Require Authentication
                          </Label>
                          <Switch
                            checked={
                              supportSettings.security_settings
                                ?.requireAuthentication || false
                            }
                            onCheckedChange={(checked) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                security_settings: {
                                  ...prev.security_settings,
                                  requireAuthentication: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="allow-uploads">
                            Allow File Uploads
                          </Label>
                          <Switch
                            checked={
                              supportSettings.security_settings
                                ?.allowFileUploads || false
                            }
                            onCheckedChange={(checked) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                security_settings: {
                                  ...prev.security_settings,
                                  allowFileUploads: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="max-file">Max File Size (MB)</Label>
                          <Input
                            id="max-file"
                            type="number"
                            value={
                              supportSettings.security_settings?.maxFileSize ||
                              10
                            }
                            onChange={(e) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                security_settings: {
                                  ...prev.security_settings,
                                  maxFileSize: parseInt(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                        <Button
                          className="bg-[#253E44]"
                          onClick={handleSaveSecuritySettings}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Security Settings
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Advanced Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Advanced Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Label htmlFor="enable-kb">
                            Enable Knowledge Base
                          </Label>
                          <Switch
                            checked={
                              supportSettings.advanced_settings
                                ?.enableKnowledgeBase || false
                            }
                            onCheckedChange={(checked) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                advanced_settings: {
                                  ...prev.advanced_settings,
                                  enableKnowledgeBase: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="enable-templates">
                            Enable Ticket Templates
                          </Label>
                          <Switch
                            checked={
                              supportSettings.advanced_settings
                                ?.enableTicketTemplates || false
                            }
                            onCheckedChange={(checked) =>
                              setSupportSettings((prev) => ({
                                ...prev,
                                advanced_settings: {
                                  ...prev.advanced_settings,
                                  enableTicketTemplates: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <Button
                          className="bg-[#253E44]"
                          onClick={handleSaveAdvancedSettings}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Advanced Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
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

export default AdminSupport;
