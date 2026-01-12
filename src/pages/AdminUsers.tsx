import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Users, Search, Filter, MoreHorizontal, Shield, CheckCircle, XCircle, Clock, Plus, Edit, UserCheck, UserX, Trash2, Eye, MessageSquare } from "lucide-react";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "client",
    phone: "",
    location: ""
  });
  const navigate = useNavigate();

  const users = [
    {
      id: 1,
      name: "John Developer",
      email: "john@example.com",
      role: "Developer",
      status: "Verified",
      joined: "2024-01-15",
      projects: 12,
      rating: 4.8
    },
    {
      id: 2,
      name: "Sarah Client",
      email: "sarah@example.com",
      role: "Client",
      status: "Pending",
      joined: "2024-01-20",
      projects: 3,
      rating: null
    },
    {
      id: 3,
      name: "Mike Contractor",
      email: "mike@example.com",
      role: "Developer",
      status: "Verified",
      joined: "2024-01-10",
      projects: 25,
      rating: 4.9
    },
    {
      id: 4,
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin",
      status: "Verified",
      joined: "2023-12-01",
      projects: 0,
      rating: null
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role.toLowerCase() === filterRole;
    const matchesStatus = filterStatus === "all" || user.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async () => {
    // Validate form
    if (!newUser.name || !newUser.email) {
      alert("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      // In a real app, this would make an API call
      console.log("Creating new user:", newUser);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setNewUser({
        name: "",
        email: "",
        role: "client",
        phone: "",
        location: ""
      });
      setIsAddUserModalOpen(false);
      
      // Show success message
      alert("User created successfully!");
      
      // In a real app, you would refresh the users list here
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  const handleUserAction = async (action: string, userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'view':
        navigate(`/admin/users/${userId}`);
        break;
      case 'edit':
        navigate(`/admin/users/${userId}/edit`);
        break;
      case 'message':
        navigate('/admin/messages');
        break;
      case 'suspend':
        if (confirm(`Are you sure you want to suspend ${user.name}?`)) {
          console.log('Suspending user:', userId);
          // In a real app, make API call to suspend user
          alert(`${user.name} has been suspended`);
        }
        break;
      case 'activate':
        if (confirm(`Are you sure you want to activate ${user.name}?`)) {
          console.log('Activating user:', userId);
          // In a real app, make API call to activate user
          alert(`${user.name} has been activated`);
        }
        break;
      case 'delete':
        if (confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) {
          console.log('Deleting user:', userId);
          // In a real app, make API call to delete user
          alert(`${user.name} has been deleted`);
        }
        break;
      default:
        break;
    }
  };

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
      "Verified": "default",
      "Pending": "secondary",
      "Suspended": "destructive"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
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
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage all platform users</p>
              </div>
            </div>
            <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-w-[90vw]">
                <DialogHeader>
                  <DialogTitle className="text-base md:text-lg">Add New User</DialogTitle>
                  <DialogDescription className="text-xs md:text-sm">
                    Create a new user account. They will receive an email with login instructions.
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
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
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
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="sm:col-span-3 text-xs md:text-sm"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <Label htmlFor="role" className="text-xs sm:text-right">
                      Role
                    </Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger className="sm:col-span-3 text-xs md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <Label htmlFor="phone" className="text-xs sm:text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                      className="sm:col-span-3 text-xs md:text-sm"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <Label htmlFor="location" className="text-xs sm:text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newUser.location}
                      onChange={(e) => setNewUser(prev => ({ ...prev, location: e.target.value }))}
                      className="sm:col-span-3 text-xs md:text-sm"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)} size="sm" className="text-xs md:text-sm">
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} className="bg-red-600 hover:bg-red-700 text-xs md:text-sm" size="sm">
                    Create User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center space-x-3">
                    <Avatar className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarFallback className="text-xs md:text-base">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-xs sm:text-base text-gray-900">{user.name}</h3>
                        {getStatusIcon(user.status)}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1 text-xs md:text-sm flex-wrap">
                        <span className="text-xs text-gray-500">Role: {user.role}</span>
                        <span className="text-xs text-gray-500">Joined: {user.joined}</span>
                        {user.projects > 0 && (
                          <span className="text-xs text-gray-500">Projects: {user.projects}</span>
                        )}
                        {user.rating && (
                          <span className="text-xs text-gray-500">Rating: {user.rating}/5</span>
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
                        <DropdownMenuItem onClick={() => handleUserAction('view', user.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction('message', user.id)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction('edit', user.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        {user.status === 'Suspended' ? (
                          <DropdownMenuItem onClick={() => handleUserAction('activate', user.id)}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleUserAction('suspend', user.id)}>
                            <UserX className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleUserAction('delete', user.id)}
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
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;