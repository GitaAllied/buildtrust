import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
// MOCK DATA: Replace with apiClient once backend is ready
import {
  getAllProjects,
  getAllDevelopers,
  updateProject,
} from "@/lib/mockData";
import {
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  DollarSign,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  X,
  Menu,
} from "lucide-react";
import {
  FaBook,
  FaDoorOpen,
  FaGear,
  FaHandshake,
  FaMessage,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import SignoutModal from "@/components/ui/signoutModal";
interface Project {
  id: number;
  title: string;
  description: string;
  client_id: number;
  developer_id?: number;
  status: string;
  budget: number;
  created_at: string;
  updated_at: string;
  client_name?: string;
  developer_name?: string;
}

const AdminProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeveloperDialogOpen, setIsDeveloperDialogOpen] = useState(false);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("projects");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const [signOutModal, setSignOutModal] = useState(false);
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
    { id: "projects", label: "Projects", icon: <FaHandshake /> },
    { id: "contracts", label: "Contracts", icon: <FaBook /> },
    { id: "developers", label: "Developers", icon: <FaUser /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "reports", label: "Reports", icon: <FaBook /> },
    { id: "settings", label: "Settings", icon: <FaGear /> },
    { id: "support", label: "Support", icon: <FaHandshake />, active: true },
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

  useEffect(() => {
    loadProjects();
    loadDevelopers();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      // MOCK DATA: Using mock data - replace with apiClient.getAllProjects() when ready
      const response = getAllProjects();
      const projectsWithNames = response.map((p: any) => ({
        ...p,
        client_name: p.client_name || `Client ${p.client_id}`,
        developer_name:
          p.developer_name ||
          (p.developer_id ? `Developer ${p.developer_id}` : "Unassigned"),
      }));
      setProjects(projectsWithNames);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects");
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDevelopers = async () => {
    try {
      // MOCK DATA: Using mock data - replace with apiClient.getDevelopers() when ready
      const response = getAllDevelopers();
      setDevelopers(response);
    } catch (err) {
      console.error("Error loading developers:", err);
      setDevelopers([]);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: "secondary",
      in_progress: "default",
      completed: "default",
      cancelled: "destructive",
    };

    const statusLabels: Record<string, string> = {
      open: "Open",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "open":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const handleAssignDeveloper = async () => {
    if (!selectedProject || !selectedDeveloper) {
      toast({
        title: "Error",
        description: "Please select a developer",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // MOCK DATA: Using mock update - replace with apiClient.assignDeveloperToProject() when ready
      updateProject(selectedProject.id, {
        developer_id: parseInt(selectedDeveloper),
      });
      toast({ title: "Success", description: "Developer assigned to project" });
      setIsDeveloperDialogOpen(false);
      setSelectedDeveloper("");
      loadProjects();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign developer",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      // MOCK DATA: Delete functionality - replace with apiClient.deleteProject() when ready
      console.log("Delete project:", projectId);
      toast({ title: "Success", description: "Project deleted" });
      loadProjects();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#253E44] mx-auto" />
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

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
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin/users")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Projects Management
                </h1>
                <p className="text-sm text-gray-500">
                  Manage all projects and assignments
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/users")}
              >
                Users
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/contracts")}
              >
                Contracts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/developers")}
              >
                Developers
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search projects or clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Project
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Developer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Budget
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Created
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-gray-500"
                        >
                          No projects found
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((project) => (
                        <tr
                          key={project.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {project.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                  {project.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-900">
                              {project.client_name}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                project.developer_id ? "secondary" : "outline"
                              }
                            >
                              {project.developer_name}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(project.status)}
                              {getStatusBadge(project.status)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1 text-gray-900 font-medium">
                              <DollarSign className="h-4 w-4" />
                              <span>{project.budget || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-600">
                              {new Date(
                                project.created_at,
                              ).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      navigate(`/admin/projects/${project.id}`)
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setIsDeveloperDialogOpen(true);
                                    }}
                                  >
                                    <User className="h-4 w-4 mr-2" />
                                    Assign Developer
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDeleteProject(project.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Assign Developer Dialog */}
          <Dialog
            open={isDeveloperDialogOpen}
            onOpenChange={setIsDeveloperDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Developer to Project</DialogTitle>
                <DialogDescription>
                  Assign a developer to work on "{selectedProject?.title}"
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Select Developer
                  </label>
                  <Select
                    value={selectedDeveloper}
                    onValueChange={setSelectedDeveloper}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a developer" />
                    </SelectTrigger>
                    <SelectContent>
                      {developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id.toString()}>
                          {dev.name} ({dev.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeveloperDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignDeveloper}
                  disabled={saving}
                  className="bg-[#253E44] hover:bg-[#253E44]/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Assigning...
                    </>
                  ) : (
                    "Assign Developer"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

export default AdminProjects;
