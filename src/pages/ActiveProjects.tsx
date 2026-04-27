import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { X, Menu, Plus, Search, Calendar, MapPin, User } from "lucide-react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import DeveloperSidebar from "@/components/DeveloperSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openDeveloperSidebar, openSignoutModal } from "@/redux/action";
import { apiClient } from "@/lib/api";

// Constants for API URLs
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const API_ORIGIN = API_BASE === '/api' ? window.location.origin : API_BASE.replace(/\/api$/, '');

const ActiveProjects = () => {
  const [uploadProgress, setUploadProgress] = useState("");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isOpen = useSelector((state: any) => state.sidebar.developerSidebar);
  const signOutModal = useSelector((state: any) => state.signout);

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  // Helper to resolve media URLs
  const resolveMediaUrl = (urlOrPath: string) => {
    if (!urlOrPath) return null;
    if (urlOrPath.startsWith('http')) return urlOrPath; // Absolute URL
    if (urlOrPath.startsWith('/uploads/')) return `${API_ORIGIN}${urlOrPath}`; // Relative path
    return urlOrPath; // Fallback
  };

  // Helper to get current image for a project
  const getProjectImage = (mediaArray: any[]) => {
    if (!mediaArray || mediaArray.length === 0) return 'https://placehold.net/main.svg';
    const currentIndex = currentImageIndices[0] || 0; // Simplified: would use project.id in real scenario
    const currentMedia = mediaArray[currentIndex];
    return resolveMediaUrl(currentMedia?.url) || 'https://placehold.net/main.svg';
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (user?.role === 'developer') {
          // For developers, get their accepted/active projects
          response = await apiClient.getDeveloperActiveProjects();
        } else {
          // For clients, get their created projects
          response = await apiClient.getClientProjects();
        }

        const projectsData = response?.projects || response || [];
        console.log('📦 Projects fetched:', projectsData);
        
        // Initialize image indices for all projects
        const indices: Record<number, number> = {};
        projectsData.forEach((p: any, index: number) => {
          indices[p.id] = 0;
        });
        setCurrentImageIndices(indices);
        
        // Transform data to match component structure
        const transformedProjects = projectsData.map((project: any) => {
          // For clients: data comes from getClientProjects
          // For developers: data comes from getDeveloperActiveProjects
          
          if (user?.role === 'client') {
            // Client projects data structure
            return {
              id: project.id,
              title: project.title,
              location: project.location || 'Location TBD',
              developer: project.developer_name || 'Assigned Developer',
              status: project.status === 'active' ? 'In Progress' : project.status,
              progress: project.progress || 0,
              startDate: project.created_at?.split('T')[0] || '',
              expectedCompletion: project.updated_at?.split('T')[0] || '',
              budget: project.budget ? `$${Number(project.budget).toLocaleString('en-US')}` : 'Budget TBD',
              media_array: project.media_array || [], // All images for rotation
              lastUpdate: `Last updated on ${new Date(project.updated_at).toLocaleDateString('en-US')}`,
            };
          } else {
            // Developer projects data structure
            return {
              id: project.id,
              title: project.title,
              location: project.location || 'Location TBD',
              developer: project.client_name || 'Client',
              status: project.status || 'In Progress',
              progress: project.progress || 0,
              startDate: project.start_date?.split('T')[0] || '',
              expectedCompletion: project.start_date ? new Date(new Date(project.start_date).getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
              budget: project.budget_min || project.budget_max 
                ? `$${Number(project.budget_min || 0).toLocaleString('en-US')} - $${Number(project.budget_max || 0).toLocaleString('en-US')}`
                : 'Budget TBD',
              media_array: project.media_array || [], // All images for rotation
              lastUpdate: `Assigned to you`,
            };
          }
        });
        
        setProjects(transformedProjects);
      } catch (err) {
        console.error('❌ Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const intervals = projects.map((project) => {
      if (!project.media_array || project.media_array.length <= 1) return null;
      
      return setInterval(() => {
        setCurrentImageIndices((prev) => {
          const newIndex = ((prev[project.id] || 0) + 1) % project.media_array.length;
          return { ...prev, [project.id]: newIndex };
        });
      }, 5000); // Change image every 5 seconds
    });

    return () => {
      intervals.forEach((id) => {
        if (id) clearInterval(id);
      });
    };
  }, [projects]);

  // Helper to get current image for a project
  const getCurrentProjectImage = (project: any) => {
    if (!project.media_array || project.media_array.length === 0) {
      return 'https://placehold.net/main.svg';
    }
    const currentIndex = currentImageIndices[project.id] || 0;
    const currentMedia = project.media_array[currentIndex];
    return resolveMediaUrl(currentMedia?.url) || 'https://placehold.net/main.svg';
  };

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
      project.developer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      project.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openDeveloperSidebar(!isOpen))}
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
      <DeveloperSidebar active={"projects"} />

      {/* Main Content */}
      <div className="flex-1 md:pl-64 w-full min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  {user?.role === "developer" ? "My Active Projects" : "My Projects"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {user?.role === "developer" 
                    ? "Track progress on your assigned projects" 
                    : "Track and manage your construction projects"}
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
          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-16">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-[#226F75] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <p className="mt-3 text-sm text-gray-600">Loading projects...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
              <Button
                className="bg-[#253E44] hover:bg-[#253E44]/70 text-xs sm:text-sm"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
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

              {/* Projects Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="relative w-full sm:w-24 md:w-32 h-40 sm:h-24 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                          <img
                            src={getCurrentProjectImage(project)}
                            alt={project.title}
                            className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.net/main.svg';
                            }}
                          />
                          {project.media_array && project.media_array.length > 1 && (
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                              {project.media_array.map((_: any, index: number) => (
                                <div
                                  key={index}
                                  className={`h-1.5 rounded-full transition-all ${
                                    index === (currentImageIndices[project.id] || 0)
                                      ? 'bg-white w-3'
                                      : 'bg-white/50 w-1.5'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
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
                              <span className="truncate">{project.developer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate text-xs">
                                {project.startDate} - {project.expectedCompletion}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {project.status === "In Progress" && (
                        <div className="">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="font-semibold text-sm sm:text-base text-green-600">
                            {project.budget}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs w-full sm:w-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/project/${project.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-600 text-center">
                          <strong>Latest Update:</strong> {project.lastUpdate}
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
                  {projects.length === 0 ? (
                    <Button
                      className="bg-[#253E44] hover:bg-[#253E44]/70 text-xs sm:text-sm w-full sm:w-auto"
                      onClick={() => navigate(user?.role === "developer" ? "/project-requests" : "/browse")}
                    >
                      {user?.role === "developer" ? "Check Project Requests" : "Start Your First Project"}
                    </Button>
                  ) : null}
                </div>
              )}
            </>
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

export default ActiveProjects;
