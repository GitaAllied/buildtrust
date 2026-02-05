import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Camera,
  Video,
  FileText,
  Menu,
  X,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaGear,
  FaMessage,
  FaMoneyBill,
  FaUpload,
  FaUser,
  FaDownload,
  FaDoorOpen,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const UploadUpdate = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [milestone, setMilestone] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // File states
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaUser />,
      active: true,
    },
    { id: "requests", label: "Project Requests", icon: <FaDownload /> },
    { id: "projects", label: "Active Projects", icon: <FaBriefcase /> },
    { id: "upload", label: "Upload Update", icon: <FaUpload /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
    { id: "profile", label: "Licenses & Profile", icon: <FaUser /> },
    { id: "support", label: "Support", icon: <FaGear /> },
  ];

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/developer-dashboard");
        break;
      case "requests":
        navigate("/project-requests");
        break;
      case "projects":
        navigate("/active-projects");
        break;
      case "upload":
        navigate("/upload-update");
        break;
      case "messages":
        navigate("/developer-messages");
        break;
      case "payments":
        navigate("/developer-payments");
        break;
      case "profile":
        navigate("/developer-liscences");
        break;
      case "support":
        navigate("/support");
        break;
        case "logout":
        handleLogout();
        break;
      default:
        navigate("/browse");
    }
  };

  const projects = [
    { id: 1, name: "Family Duplex - Chioma Adeleke" },
    { id: 2, name: "Office Complex - James Okonkwo" },
    { id: 3, name: "Modern Villa - Ada Nwosu" },
  ];

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photos" | "videos" | "documents",
  ) => {
    const files = Array.from(e.target.files || []);

    if (type === "photos") {
      setPhotos((prev) => [...prev, ...files]);
    } else if (type === "videos") {
      setVideos((prev) => [...prev, ...files]);
    } else {
      setDocuments((prev) => [...prev, ...files]);
    }

    e.target.value = "";
  };

  const removeFile = (
    index: number,
    type: "photos" | "videos" | "documents",
  ) => {
    if (type === "photos") {
      setPhotos((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "videos") {
      setVideos((prev) => prev.filter((_, i) => i !== index));
    } else {
      setDocuments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    console.log({
      project: selectedProject,
      milestone,
      description,
      photos,
      videos,
      documents,
    });
    alert("Update submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
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
        <div className=" h-full flex flex-col justify-between">
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
                handleLogout();
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
                  Upload Progress Update
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Share project progress with your clients
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3">
              <CardTitle className="flex items-center text-xs sm:text-sm md:text-base gap-2">
                <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                Project Progress Update
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="project" className="text-xs sm:text-sm">
                    Select Project
                  </Label>
                  <select
                    id="project"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226F75]/50 text-xs sm:text-sm h-9"
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="milestone" className="text-xs sm:text-sm">
                    Milestone/Phase
                  </Label>
                  <Input
                    id="milestone"
                    placeholder="e.g., Foundation Complete, Roofing Started"
                    value={milestone}
                    onChange={(e) => setMilestone(e.target.value)}
                    className="text-xs sm:text-sm h-9"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-xs sm:text-sm">
                  Progress Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the completed work, any challenges, and next steps..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label className="text-xs sm:text-sm">Upload Media</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  {/* Photos Upload */}
                  <Card
                    className="border-dashed border-2 border-gray-300 hover:border-[#253E44]/50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("photos-input")?.click()
                    }
                  >
                    <CardContent className="p-4 sm:p-6 text-center">
                      <Camera className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs sm:text-sm text-gray-600">
                        Upload Photos
                      </p>
                      <p className="text-xs text-gray-400">
                        JPG, PNG up to 10MB
                      </p>
                      {photos.length > 0 && (
                        <p className="text-xs text-[#226F75] font-semibold mt-2">
                          {photos.length} file(s) selected
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <input
                    id="photos-input"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleFileChange(e, "photos")}
                    className="hidden"
                  />

                  {/* Videos Upload */}
                  <Card
                    className="border-dashed border-2 border-gray-300 hover:border-[#253E44]/50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("videos-input")?.click()
                    }
                  >
                    <CardContent className="p-4 sm:p-6 text-center">
                      <Video className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs sm:text-sm text-gray-600">
                        Upload Videos
                      </p>
                      <p className="text-xs text-gray-400">
                        MP4, MOV up to 50MB
                      </p>
                      {videos.length > 0 && (
                        <p className="text-xs text-[#226F75] font-semibold mt-2">
                          {videos.length} file(s) selected
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <input
                    id="videos-input"
                    type="file"
                    multiple
                    accept="video/mp4,video/quicktime,video/x-msvideo"
                    onChange={(e) => handleFileChange(e, "videos")}
                    className="hidden"
                  />

                  {/* Documents Upload */}
                  <Card
                    className="border-dashed border-2 border-gray-300 hover:border-[#253E44]/50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("documents-input")?.click()
                    }
                  >
                    <CardContent className="p-4 sm:p-6 text-center">
                      <FileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs sm:text-sm text-gray-600">
                        Upload Documents
                      </p>
                      <p className="text-xs text-gray-400">
                        PDF, DOC up to 5MB
                      </p>
                      {documents.length > 0 && (
                        <p className="text-xs text-[#226F75] font-semibold mt-2">
                          {documents.length} file(s) selected
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <input
                    id="documents-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => handleFileChange(e, "documents")}
                    className="hidden"
                  />
                </div>

                {/* File Lists */}
                {(photos.length > 0 ||
                  videos.length > 0 ||
                  documents.length > 0) && (
                  <div className="space-y-3 pt-2">
                    {photos.length > 0 && (
                      <div className="bg-[#226F75]/10 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Photos ({photos.length})
                        </p>
                        <div className="space-y-1">
                          {photos.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-white rounded px-2 py-1"
                            >
                              <span className="truncate flex-1">
                                {file.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(idx, "photos");
                                }}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {videos.length > 0 && (
                      <div className="bg-[#226F75]/10 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Videos ({videos.length})
                        </p>
                        <div className="space-y-1">
                          {videos.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-white rounded px-2 py-1"
                            >
                              <span className="truncate flex-1">
                                {file.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(idx, "videos");
                                }}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {documents.length > 0 && (
                      <div className="bg-[#226F75]/10 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Documents ({documents.length})
                        </p>
                        <div className="space-y-1">
                          {documents.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-white rounded px-2 py-1"
                            >
                              <span className="truncate flex-1">
                                {file.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(idx, "documents");
                                }}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm w-full sm:w-auto"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#253E44]/90 hover:bg-[#253E44] text-xs sm:text-sm w-full sm:w-auto"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadUpdate;
