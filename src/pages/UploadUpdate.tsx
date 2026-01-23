
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Camera, Video, FileText, Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaGear,
  FaMessage,
  FaMoneyBill,
  FaUpload,
  FaUser,
  FaDownload
} from "react-icons/fa6";

const UploadUpdate = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState("");
  const [milestone, setMilestone] = useState("");
  const [description, setDescription] = useState("");

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
      default:
        navigate("/browse");
    }
  };

  const projects = [
    { id: 1, name: "Family Duplex - Chioma Adeleke" },
    { id: 2, name: "Office Complex - James Okonkwo" },
    { id: 3, name: "Modern Villa - Ada Nwosu" }
  ];

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <img src={Logo} alt="" />
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
            <img src={Logo} alt="" className="w-[55%]" />
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
              className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-1 transition-all text-xs sm:text-sm font-medium flex gap-2 items-center ${
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
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-14 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">Upload Progress Update</h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Share project progress with your clients</p>
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
                <Label htmlFor="project" className="text-xs sm:text-sm">Select Project</Label>
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
                <Label htmlFor="milestone" className="text-xs sm:text-sm">Milestone/Phase</Label>
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
              <Label htmlFor="description" className="text-xs sm:text-sm">Progress Description</Label>
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
                <Card className="border-dashed border-2 border-gray-300 hover:border-[#253E44]/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Camera className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600">Upload Photos</p>
                    <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed border-2 border-gray-300 hover:border-[#253E44]/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Video className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600">Upload Videos</p>
                    <p className="text-xs text-gray-400">MP4, MOV up to 50MB</p>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed border-2 border-gray-300 hover:border-[#253E44]/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600">Upload Documents</p>
                    <p className="text-xs text-gray-400">PDF, DOC up to 5MB</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="text-xs sm:text-sm w-full sm:w-auto">
                Cancel
              </Button>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                  Save as Draft
                </Button>
                <Button className="bg-[#253E44]/60 hover:bg-[#253E44]/70 text-xs sm:text-sm w-full sm:w-auto">
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
