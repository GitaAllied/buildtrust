import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  MessageSquare,
  X,
  Menu,
  Loader2
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
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "sub_admin",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [signOutModal, setSignOutModal] = useState(false);

  // Mock data for when API is not connected
  const mockUsers = [
    {
      id: 1,
      name: "Ade Johnson",
      email: "ade.johnson@example.com",
      role: "Client",
      status: "Verified",
      joined: "Jan 15, 2025",
      phone: "+234 812 345 6789",
      location: "Lagos, Nigeria",
      rating: 4.8,
      projects: 5,
      is_active: true,
    },
    {
      id: 2,
      name: "Chioma Okafor",
      email: "chioma.okafor@example.com",
      role: "Developer",
      status: "Verified",
      joined: "Dec 20, 2024",
      phone: "+234 801 234 5678",
      location: "Abuja, Nigeria",
      rating: 4.9,
      projects: 8,
      is_active: true,
    },
    {
      id: 3,
      name: "Ibrahim Ahmed",
      email: "ibrahim.ahmed@example.com",
      role: "Client",
      status: "Pending",
      joined: "Feb 8, 2025",
      phone: "+234 803 456 7890",
      location: "Kano, Nigeria",
      rating: null,
      projects: 0,
      is_active: true,
    },
    {
      id: 4,
      name: "Grace Oluwaseun",
      email: "grace.oluwaseun@example.com",
      role: "Developer",
      status: "Pending",
      joined: "Feb 1, 2025",
      phone: "+234 805 789 0123",
      location: "Port Harcourt, Nigeria",
      rating: null,
      projects: 0,
      is_active: true,
    },
    {
      id: 5,
      name: "David Chen",
      email: "david.chen@example.com",
      role: "Client",
      status: "Verified",
      joined: "Nov 10, 2024",
      phone: "+234 807 234 5678",
      location: "Lagos, Nigeria",
      rating: 4.7,
      projects: 3,
      is_active: true,
    },
  ];

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const response = await apiClient.getUsers();
      const usersList = Array.isArray(response) ? response : response.users || [];
      // Map to display format, filter out admin users, and sort in descending order (newest first)
      const mappedUsers = usersList
        .filter((user: any) => user.role !== 'admin') // Exclude admin/sub-admin users
        .map((user: any) => {
          // Determine status based on is_active first, then email/setup verification
          let status = 'Pending';
          if (user.is_active === false || user.is_active === 0) {
            status = 'Suspended';
          } else if (!user.email_verified || user.email_verified === 0) {
            status = 'Pending';
          } else if (user.setup_completed === 1 || user.setup_completed === true) {
            status = 'Verified';
          }
          
          return {
            id: user.id,
            name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
            email: user.email,
            role: user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User',
            status: status,
            joined: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently',
            phone: user.phone || '-',
            location: user.location || '-',
            rating: null,
            projects: 0,
            is_active: user.is_active,
          };
        })
        .sort((a: any, b: any) => b.id - a.id);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      console.warn('Using mock data due to API connection issue');
      // Use mock data when API fails
      setUsers(mockUsers);
      setUsersError(null); // Don't show error, just display mock data
      toast({ title: 'Demo Mode', description: 'Showing demo data - API connection unavailable', variant: 'default' });
    } finally {
      setUsersLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const sidebarItems = [
      { id: "dashboard", label: "Dashboard", icon: <FaUser />, },
      { id: "users", label: "User Management", icon: <FaUsers />, active: true },
      { id: "projects", label: "Projects", icon: <FaHandshake /> },
      { id: "contracts", label: "Contracts", icon: <FaBook /> },
      { id: "developers", label: "Developers", icon: <FaUser /> },
      { id: "messages", label: "Messages", icon: <FaMessage /> },
      { id: "reports", label: "Reports", icon: <FaBook /> },
      { id: "settings", label: "Settings", icon: <FaGear /> },
      { id: "support", label: "Support", icon: <FaHandshake /> },
    ];
    const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/super-admin-dashboard")
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "projects":
        navigate("/admin/projects");
        break;
      case "contracts":
        navigate("/admin/contracts");
        break;
      case "developers":
        navigate("/admin/developers");
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

  const handleAddUser = async () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.confirmPassword) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    // Password validation
    if (newUser.password.length < 8) {
      toast({ title: 'Error', description: 'Password must be at least 8 characters long', variant: 'destructive' });
      return;
    }

    // Password match validation
    if (newUser.password !== newUser.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      // Call API to create sub-admin user
      const response = await apiClient.createUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
        phone: newUser.phone || null,
        location: newUser.location || null,
      });

      // Reset form and close modal
      setNewUser({
        name: "",
        email: "",
        role: "sub_admin",
        phone: "",
        location: "",
        password: "",
        confirmPassword: "",
      });
      setIsAddUserModalOpen(false);

      // Show success message
      toast({ title: 'Success', description: 'User created successfully!' });

      // Reload users list
      loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({ title: 'Error', description: (error as any)?.message || 'Failed to create user', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserAction = async (action: string, userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    switch (action) {
      case "view":
        navigate(`/admin/users/${userId}`);
        break;
      case "edit":
        navigate(`/admin/users/${userId}/edit`);
        break;
      case "message":
        navigate("/admin/messages");
        break;
      case "suspend":
        if (confirm(`Are you sure you want to suspend ${user.name}?`)) {
          try {
            await apiClient.updateUser(userId, { is_active: false });
            toast({ title: 'Success', description: `${user.name} has been suspended` });
            loadUsers();
          } catch (error) {
            toast({ title: 'Error', description: 'Failed to suspend user', variant: 'destructive' });
          }
        }
        break;
      case "activate":
        if (confirm(`Are you sure you want to activate ${user.name}?`)) {
          try {
            await apiClient.updateUser(userId, { is_active: true });
            toast({ title: 'Success', description: `${user.name} has been activated` });
            loadUsers();
          } catch (error) {
            toast({ title: 'Error', description: 'Failed to activate user', variant: 'destructive' });
          }
        }
        break;
      case "delete":
        if (
          confirm(
            `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`
          )
        ) {
          try {
            await apiClient.deleteUser(userId);
            toast({ title: 'Success', description: `${user.name} has been deleted` });
            loadUsers();
          } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
          }
        }
        break;
      default:
        break;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" || user.role.toLowerCase() === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "Suspended":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Verified: "default",
      Pending: "secondary",
      Suspended: "destructive",
    } as const;
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={'/'}><img src={Logo} alt="" /></Link>
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
        <div className=" h-full flex flex-col justify-start md:justify-between">
          <div>
            {/* logo */}
            <div className="p-4 pb-0 sm:pb-0 sm:p-6 hidden md:block">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
              >
                <Link to={"/"}>
                  <img src={Logo} alt="" className="w-[55%]" />
                </Link>
              </button>
            </div>
            {/* nav links */}
            <nav className="p-3 pb-0 sm:p-4 sm:pb-0 space-y-1">
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
          {/* Signout Button */}
          <div className="p-3 sm:p-4 pb-0 sm:pb-0">
            <button
              onClick={() => {
                setSignOutModal(true);
              }}
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center text-red-500"
            >
              <FaDoorOpen />
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="block">
                  <h1 className="md:text-2xl font-bold text-gray-900">
                    User Management
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage all platform users
                  </p>
                </div>
              </div>
              <Dialog
                open={isAddUserModalOpen}
                onOpenChange={setIsAddUserModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-[#253E44] hover:bg-[#253E44]/70">
                    <Plus className=" h-4 w-4" />
                    Add New Sub Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-w-[90vw]">
                  <DialogHeader>
                    <DialogTitle className="text-base md:text-lg">
                      Add New Sub Admin
                    </DialogTitle>
                    <DialogDescription className="text-xs md:text-sm">
                      Create a new sub-admin account with administrative privileges.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                      <Label htmlFor="name" className="text-xs sm:text-right">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="sm:col-span-3 text-xs md:text-sm"
                        placeholder="Full name"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                      <Label htmlFor="email" className="text-xs sm:text-right">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="sm:col-span-3 text-xs md:text-sm"
                        placeholder="subadmin@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                      <Label htmlFor="password" className="text-xs sm:text-right">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="sm:col-span-3 text-xs md:text-sm"
                        placeholder="Enter password (min 8 characters)"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                      <Label htmlFor="confirmPassword" className="text-xs sm:text-right">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="sm:col-span-3 text-xs md:text-sm"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddUserModalOpen(false)}
                      size="sm"
                      className="text-xs md:text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddUser}
                      disabled={isSubmitting}
                      className="bg-[#253E44] hover:bg-[#253E44]/90 text-xs md:text-sm"
                      size="sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Sub Admin'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {usersLoading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-400" />
                  <p className="mt-4 text-gray-600">Loading users...</p>
                </CardContent>
              </Card>
            ) : usersError ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-red-600 font-medium">{usersError}</p>
                  <Button onClick={loadUsers} className="mt-4" variant="outline">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No users found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center space-x-3">
                      <Avatar className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarFallback className="text-xs md:text-base">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-xs sm:text-base text-gray-900">
                            {user.name}
                          </h3>
                          {getStatusIcon(user.status)}
                        </div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {user.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-xs md:text-sm flex-wrap">
                          <span className="text-xs text-gray-500">
                            Role: {user.role}
                          </span>
                          <span className="text-xs text-gray-500">
                            Joined: {user.joined}
                          </span>
                          {user.projects > 0 && (
                            <span className="text-xs text-gray-500">
                              Projects: {user.projects}
                            </span>
                          )}
                          {user.rating && (
                            <span className="text-xs text-gray-500">
                              Rating: {user.rating}/5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(user.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleUserAction("view", user.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction("message", user.id)}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction("edit", user.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          {user.status === "Suspended" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUserAction("activate", user.id)
                              }
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUserAction("suspend", user.id)
                              }
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleUserAction("delete", user.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() => setSignOutModal(false)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
