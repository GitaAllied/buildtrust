import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  MapPin,
  User,
  Menu,
  X,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/api";
import SignoutModal from "@/components/ui/signoutModal";
import ClientSidebar from "@/components/ClientSidebar";
import { useSelector, useDispatch } from "react-redux";
import { openClientSidebar, openSignoutModal } from "@/redux/action";

// Derive backend origin to resolve media URLs stored as "/uploads/...".
const API_BASE = (
  import.meta.env.VITE_API_URL ?? "https://buildtrust-backend.onrender.com/api"
).replace(/\/+$/, "");
const API_ORIGIN = API_BASE.replace(/\/api$/, "");

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const isOpen = useSelector((state:any) => state.sidebar.clientSidebar)
  const signOutModal = useSelector((state:any) => state.signout) 

  // State for real projects, loading, and error handling
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getClientProjects();
        // Transform API response to match the UI structure if needed
        const projectsData = response.projects || [];
        // Normalize budget field: prefer backend `budget_range` (snake_case) or `budgetRange` (camelCase)
        const mapped = projectsData.map((p: any) => {
          const budget = p.budget_range ?? p.budgetRange ?? p.budget ?? "";
          return { ...p, budget };
        });
        setProjects(mapped);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError(err.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Error handling display
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-600";
      case "In Progress":
        return "bg-blue-600";
      case "Planning":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.developer_name || project.developer || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (project.status || "").toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  // Calculate dynamic stats from real projects data
  const totalProjects = projects.length;
  const inProgressCount = projects.filter(
    (p) => p.status === "In Progress",
  ).length;
  const completedCount = projects.filter(
    (p) => p.status === "Completed",
  ).length;
  const planningCount = projects.filter((p) => p.status === "Planning").length;

  const PLACEHOLDER_IMAGE = "https://placehold.net/main.svg";

  // Resolve media URL: handle absolute URLs, relative '/uploads/..', 'uploads/..', or media.filename
  const resolveMediaUrl = (media: any) => {
    if (!media) return null;
    let url = media.url ?? media.filename ?? null;
    if (!url) return null;
    url = String(url);
    if (url.startsWith("http")) return url;
    // ensure leading slash
    if (!url.startsWith("/")) url = `/${url}`;
    return `${API_ORIGIN}${url}`;
  };

  const getProjectImageSrc = (project: any) => {
    const mediaUrl = resolveMediaUrl(project.media);
    if (mediaUrl) return mediaUrl;
    if (project.image) return project.image;
    return PLACEHOLDER_IMAGE;
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="Build Trust Africa Logo" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openClientSidebar(!isOpen))}
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
      <ClientSidebar active={"projects"} />
      <div className="flex-1 md:pl-64 w-full min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  My Projects
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Track and manage your construction projects
                </p>
              </div>
            </div>
            {/* <Button
              className="bg-[#253E44] hover:bg-[#253E44]/90 text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => navigate("/browse")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Start New Project
            </Button> */}
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {/* Search and Filter */}
          <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                className="pl-10 text-xs sm:text-sm h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                className="px-3 sm:px-4 py-2 border rounded-lg bg-white text-xs sm:text-sm h-9 flex-1 sm:flex-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Projects Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            <Card>
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalProjects}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Total Projects
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  {inProgressCount}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  In Progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {completedCount}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <p className="text-lg sm:text-2xl font-bold text-orange-600">
                  {planningCount}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Planning
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <img
                      src={getProjectImageSrc(project)}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          PLACEHOLDER_IMAGE;
                      }}
                      alt={project.title}
                      className="w-full sm:w-24 md:w-32 h-40 sm:h-24 md:h-32 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h3 className="font-semibold text-xs sm:text-sm md:text-base truncate">
                          {project.title}
                        </h3>
                        <Badge
                          className={`${getStatusColor(
                            project.status,
                          )} text-xs flex-shrink-0`}
                        >
                          {project.status}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs sm:text-sm text-gray-600 flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{project.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">
                            {project.developer_name || project.developer}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate text-xs">
                            {project.start_date || project.startDate} -{" "}
                            {project.expected_completion ||
                              project.expectedCompletion}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {project.status === "In Progress" && (
                    <div className="">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-semibold text-sm sm:text-base text-green-600">
                        {(() => {
                          const b = project.budget;
                          if (b === null || b === undefined || b === "")
                            return "—";
                          const s =
                            typeof b === "number"
                              ? String(b)
                              : String(b).trim();
                          return /[Mm]/.test(s) ? s : `${s}M`;
                        })()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs w-full sm:w-auto"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 text-center">
                      <strong>Latest Update:</strong>{" "}
                      {project.last_update ||
                        project.lastUpdate ||
                        "No updates yet"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                No projects found matching your criteria.
              </p>
              <Button
                className="bg-[#226F75]/60 hover:bg-[#226F75]/70 text-xs sm:text-sm w-full sm:w-auto"
                onClick={() => navigate("/browse")}
              >
                Start Your First Project
              </Button>
            </div>
          )}
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() =>dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default Projects;
