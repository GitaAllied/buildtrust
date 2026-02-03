import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, User, Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";
import { FaBriefcase, FaDoorOpen, FaFileContract, FaGear, FaMessage, FaMoneyBill, FaUser, FaUserGear } from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";

const mockProject = {
  id: 1,
  title: "Modern Duplex in Lekki",
  developer_name: "Engr. Adewale Structures",
  status: "In Progress",
  progress: 45,
  start_date: "2024-08-15",
  expected_completion: "2025-02-15",
  budget: "8.5",
  location: "Lekki, Lagos",
  image:
    "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=800&fit=crop",
  description:
    "A contemporary duplex project with modern finishes, 4 bedrooms, open plan living and sustainable features.",
  media: [
    {
      id: 1,
      url: 
        "https://images.unsplash.com/photo-1560184897-6af27d7b5a0b?w=1200&h=800&fit=crop",
    },
  ],
  milestones: [
    { id: 1, title: "Foundation", status: "completed" },
    { id: 2, title: "Block Work", status: "in_progress" },
    { id: 3, title: "Roofing", status: "pending" },
  ],
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [project, setProject] = useState<any | null>(null);

  const [activeTab, setActiveTab] = useState("projects");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
    { id: "projects", label: "Projects", icon: <FaBriefcase />, active: true },
    { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "contracts", label: "Contracts", icon: <FaFileContract /> },
    { id: "saved", label: "Saved Developers", icon: <FaUserGear /> },
    { id: "settings", label: "Settings", icon: <FaGear /> },
    { id: "logout", label: "Sign Out", action: "logout", icon: <FaDoorOpen /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/client-dashboard");
        break;
      case "projects":
        navigate("/projects");
        break;
      case "payments":
        navigate("/payments");
        break;
      case "messages":
        navigate("/messages");
        break;
      case "contracts":
        navigate("/contracts");
        break;
      case "saved":
        navigate("/saved-developers");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        navigate("/browse");
    }
  };

  useEffect(() => {
    // For now use mock data. In future replace with apiClient.getProject(id)
    if (!id) return;
    // If id matches mock, show it; otherwise still show mock but with id
    setProject({ ...mockProject, id: Number(id) });
  }, [id]);

  if (!project) return null;

  const formatBudget = (b: any) => {
    if (b === null || b === undefined || b === "") return "—";
    const s = typeof b === "number" ? String(b) : String(b).trim();
    return /[Mm]/.test(s) ? s : `${s}M`;
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <Link to={'/'}><img src={Logo} alt="Build Trust Africa Logo" /></Link>
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
        className={`$${'{'}
          sidebarOpen ? "block" : "hidden"
        } md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed top-14 md:top-0 left-0 right-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}
      >
        <div className="p-4 sm:p-6 border-b border-white/20 hidden md:block">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
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
              className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center ${'{'}
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
            <Button
              className="bg-[#253E44] hover:bg-[#253E44]/90 text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => navigate("/browse")}
            >
              Start New Project
            </Button>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {/* Content */}
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="text-sm">{project.status}</Badge>
                <Button onClick={() => navigate('/projects')} variant="ghost">All Projects</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-4">
                    <img src={project.image} alt={project.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Developer</p>
                        <p className="font-semibold">{project.developer_name}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{project.location}</span>
                          <Calendar className="h-4 w-4 ml-4" />
                          <span>{project.start_date} — {project.expected_completion}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-semibold text-green-600 text-lg">{formatBudget(project.budget)}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Project Description</h3>
                      <p className="text-sm text-gray-700">{project.description}</p>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Progress</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Progress value={project.progress || 0} className="h-3" />
                        </div>
                        <div className="text-sm text-gray-600">{project.progress || 0}%</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Milestones</h4>
                      <ul className="space-y-2">
                        {project.milestones.map((m: any) => (
                          <li key={m.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{m.title}</p>
                              <p className="text-xs text-gray-500 capitalize">{m.status.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <Badge className="text-xs">{m.status === 'completed' ? 'Done' : m.status === 'in_progress' ? 'In Progress' : 'Pending'}</Badge>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <aside>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <img src={Logo} alt="logo" className="mx-auto w-28 mb-4" />
                      <p className="text-sm text-gray-600 mb-4">Project actions</p>
                      <div className="space-y-2">
                        <Button className="w-full">Message Developer</Button>
                        <Button variant="outline" className="w-full">Download Report</Button>
                        <Button variant="ghost" className="w-full">Share</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
