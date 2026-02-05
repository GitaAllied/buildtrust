import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBook,
  FaBriefcase,
  FaCalendar,
  FaDoorOpen,
  FaDownload,
  FaFileContract,
  FaGear,
  FaHeadset,
  FaImages,
  FaLocationPin,
  FaMessage,
  FaMoneyBill,
  FaShare,
  FaStar,
  FaTableCells,
  FaUser,
  FaUserGear,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import SignoutModal from "@/components/ui/signoutModal";

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
    "A contemporary duplex project featuring modern high-end finishes, 4 spacious bedrooms, and an open-plan living concept designed for natural ventilation. This sustainable build incorporates solar-ready roofing and water recycling features. Located in the heart of Lekki, this project aims to set a new standard for luxury urban living.",
  media: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1560184897-6af27d7b5a0b?w=1200&h=800&fit=crop",
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
  const [signOutModal, setSignOutModal] = useState(false);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
    { id: "projects", label: "Projects", icon: <FaBriefcase />, active: true },
    { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "contracts", label: "Contracts", icon: <FaFileContract /> },
    { id: "saved", label: "Saved Developers", icon: <FaUserGear /> },
    { id: "settings", label: "Settings", icon: <FaGear /> },
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

  const targetDate = new Date(2026, 11, 12);

  const endDate = targetDate.toLocaleDateString("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const today = new Date();
  const timeDiff = targetDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

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
            <div className="p-4 sm:pb-2 sm:p-6 hidden md:block">
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
          {/* Signout Button */}
          <div className="p-3 sm:p-4">
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

        <div className="p-3 sm:p-4 md:p-10">
          {/* Content */}
          <div className="max-w-6xl mx-auto space-y-3">
            <div className=" flex items-center gap-2">
              <Badge className="text-[10px] uppercase p-3 py-1">
                {project.status}
              </Badge>
              <p className=" flex items-center gap-1 text-sm text-gray-600">
                <FaLocationPin /> {project.location}
              </p>
            </div>
            <div className="flex md:items-center justify-between flex-col md:flex-row items-start gap-3 ">
              <h1 className="text-2xl md:text-4xl font-extrabold">
                {project.title}
              </h1>
              <div className=" flex items-center gap-4">
                <Button
                onClick={() => navigate("/projects")}
                variant="ghost"
                className=" border"
              >
                All Projects
              </Button>
              <Button
                // variant="ghost"
                className=""
              >
                <FaShare/> Share
              </Button>
              </div>
            </div>

            <div className=" py-5 relative">
              <img
                src="https://placehold.net/main.svg"
                // src={project.image}
                alt={project.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-3xl"
              />
              <div className=" absolute bottom-10 left-5">
                <p className=" text-xs sm:text-sm">Estimated completion</p>
                <p className=" font-bold text-lg sm:text-xl">{endDate}</p>
              </div>
            </div>

            {/* section below image */}
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* section to the left */}
              <div className=" md:col-span-2 space-y-3">
                {/* stats cards */}
                <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Card className=" p-6 sm:p-8 md:p-10 px-6 sm:px-8 flex flex-col items-center">
                    <p className=" text-xs font-bold text-[#253E44]/50">
                      TOTAL BUDGET
                    </p>
                    <h1 className=" font-extrabold text-xl sm:text-2xl text-[#253E44]">
                      N8.5M
                    </h1>
                  </Card>
                  <Card className="p-6 sm:p-8 md:p-10 px-6 sm:px-8 flex flex-col items-center">
                    <p className=" text-xs font-bold text-[#253E44]/50">
                      PROJECT TIMELINE
                    </p>
                    <h1 className=" font-extrabold text-xl sm:text-2xl text-[#253E44]">
                      {daysLeft} Days
                    </h1>
                    <p className=" text-xs text-gray-400">64 days left</p>
                  </Card>
                  <Card className="p-6 sm:p-8 md:p-10 px-6 sm:px-8 text-center">
                    <p className=" text-xs font-bold text-[#253E44]/50">
                      TOTAL PROGRESS
                    </p>
                    <div className=" flex items-center gap-2">
                      <h1 className=" font-extrabold text-xl sm:text-2xl text-[#253E44]">
                        {project.progress || 0}%
                      </h1>
                      <div className="flex-1">
                        <Progress
                          value={project.progress || 0}
                          className="h-3"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
                {/* project description */}
                <Card className=" p-4 sm:p-6 md:p-8 space-y-3">
                  <h3 className="font-bold text-base sm:text-lg">Project Description</h3>
                  <p className="text-sm text-gray-700 leading-6">
                    {project.description}
                  </p>
                  <p className=" text-xs text-gray-400 flex items-center gap-1">
                    <FaCalendar /> Started Aug, 28 2025
                  </p>
                </Card>
                {/* milestones */}
                <Card>
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold">Milestones</h3>
                      <button className="text-[#253E44] text-sm font-bold hover:underline">
                        View All
                      </button>
                    </div>
                    <div className="relative pl-8 space-y-12">
                      <div className="absolute left-[12px] top-2 bottom-2 w-0.5 bg-gray-500"></div>
                      <div className="relative">
                        <div className="absolute -left-[27px] mt-1 w-4 h-4 rounded-full bg-[#253E44] border-4 border-white ring-4 ring-[#253E44]/20"></div>
                        <div className="flex items-start justify-between">
                          <div className = " w-[80%]">
                            <h4 className="font-bold text-sm md:text-base">
                              Foundation &amp; Earthworks
                            </h4>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">
                              Completed on Oct 12, 2024
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-extrabold rounded-full uppercase text-nowrap">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[27px] mt-1 w-4 h-4 rounded-full bg-[#253E44] border-4 border-white ring-4 ring-[#253E44]/40 animate-pulse"></div>
                        <div className="flex items-start justify-between">
                          <div className = " w-[80%]">
                            <h4 className="font-bold text-sm md:text-base">
                              Block Work &amp; Lintel
                            </h4>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">
                              Started Nov 01, 2024 • Expected end Dec 20
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-[#253E44]/10 text-[#253E44] text-[10px] font-extrabold rounded-full uppercase text-nowrap">
                            In Progress
                          </span>
                        </div>
                      </div>
                      <div className="relative opacity-60">
                        <div className="absolute -left-[27px] mt-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                        <div className="flex items-start justify-between text-gray-300">
                          <div className = " w-[80%]">
                            <h4 className="font-bold text-sm md:text-base">
                              Roofing &amp; External Finishing
                            </h4>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">
                              Estimated start January 2025
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-extrabold rounded-full uppercase text-nowrap">
                            Upcoming
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* section to the right */}
              <div>
                <div className="space-y-6">
                  <Card className="">
                    <div className="p-6 space-y-3">
                      <p className="text-slate-400 text-xs font-bold uppercase">
                        Project Developer
                      </p>
                      <div className="flex items-center gap-4">
                        <img
                          alt="Developer"
                          className="w-16 h-16 rounded-full object-cover"
                          src="https://placehold.net/avatar-4.svg"
                        />
                        <div>
                          <h4 className="font-bold text-[#253E44] ">
                            Engr. Adewale S.
                          </h4>
                          <p className="text-xs text-slate-500">
                            Adewale Structures Ltd.
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="material-icons-round text-yellow-400 text-[14px]">
                              <FaStar/>
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              4.9
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (42 reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <button className="w-full bg-[#253E44] hover:bg-slate-800 text-sm text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                          <FaMessage/>
                          Message Developer
                        </button>
                        <button className="w-full bg-white border border-slate-200 hover:border-[#226F75] text-[#253E44] text-sm font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                          <FaBook/>
                          Request Inspection
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Response time
                        </span>
                        <span className="font-bold">
                          &lt; 2 hours
                        </span>
                      </div>
                    </div>
                  </Card>
                  <Card className=" p-6 space-y-3">
                    <h4 className="font-bold text-[#253E44]">
                      Project Assets
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200  hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                            <FaImages/>
                          </div>
                          <div>
                            <p className="text-xs font-bold truncate max-w-[120px]">
                              Project_Plan.pdf
                            </p>
                            <p className="text-[10px] text-slate-400">4.2 MB</p>
                          </div>
                        </div>
                        <span className="material-icons-round text-slate-400">
                          <FaDownload/>
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-50 text-green-600 rounded flex items-center justify-center">
                            <FaTableCells/>
                          </div>
                          <div>
                            <p className="text-xs font-bold truncate max-w-[120px]">
                              Budget_Sheet.xlsx
                            </p>
                            <p className="text-[10px] text-slate-400">1.8 MB</p>
                          </div>
                        </div>
                        <span className="material-icons-round text-slate-400">
                          <FaDownload/>
                        </span>
                      </div>
                    </div>
                    <button className="w-full mt-4 text-xs font-bold text-[#253E44] hover:underline">
                      Download All Reports
                    </button>
                  </Card>
                  <Card className=" p-6 bg-[#253E44]/5 space-y-3">
                    <h4 className="font-bold text-[#253E44] flex items-center gap-2">
                      <FaHeadset/>
                      Need Help?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Our project managers are available to assist with any
                      concerns.
                    </p>
                    <a
                      className="inline-block text-xs font-bold text-[#253E44] hover:underline"
                      href="#"
                    >
                      Chat with Support
                    </a>
                  </Card>
                </div>
              </div>
            </div>
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

export default ProjectDetails;
