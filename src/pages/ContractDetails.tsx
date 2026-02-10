import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, FileText, Download, Eye } from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBook,
  FaBriefcase,
  FaCheck,
  FaCircleCheck,
  FaClock,
  FaCreditCard,
  FaDoorOpen,
  FaDownload,
  FaFileContract,
  FaFilePdf,
  FaGavel,
  FaGear,
  FaImages,
  FaLayerGroup,
  FaLocationPin,
  FaMessage,
  FaMoneyBill,
  FaPhone,
  FaRecycle,
  FaResolving,
  FaRetweet,
  FaUpload,
  FaUser,
  FaUserGear,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";

// Mock contract details data
const mockContractDetails = {
  id: 1,
  title: "Modern Duplex Construction Contract",
  contract_number: "BTRUST-2024-001",
  developer: "Engr. Adewale Structures",
  developer_email: "adewale@structures.com",
  project: "Modern Duplex in Lekki",
  location: "Lekki, Lagos",
  value: "₦8,500,000",
  status: "Active",
  start_date: "2024-01-15",
  end_date: "2024-12-15",
  description:
    "Comprehensive construction contract for a modern duplex with contemporary finishes, 4 bedrooms, open plan living, and sustainable features including solar installation and water harvesting.",
  terms: [
    {
      title: "Payment Terms",
      details:
        "50% upfront, 30% at foundation completion, 20% at final handover",
    },
    // { title: "Project Duration", details: "12 months from commencement date" },
    {
      title: "Warranty Period",
      details: "2 years on all structural work, 1 year on finishes",
    },
    { title: "Site Access", details: "Monday to Friday, 8 AM to 5 PM" },
  ],
  milestones: [
    {
      id: 1,
      title: "Foundation & Excavation",
      status: "completed",
      dueDate: "2024-03-15",
      payment: "₦2,550,000",
    },
    {
      id: 2,
      title: "Block Work & Columns",
      status: "completed",
      dueDate: "2024-05-15",
      payment: "₦2,550,000",
    },
    {
      id: 3,
      title: "Roof & Windows",
      status: "in_progress",
      dueDate: "2024-08-15",
      payment: "₦1,700,000",
    },
    {
      id: 4,
      title: "Electrical & Plumbing",
      status: "pending",
      dueDate: "2024-10-15",
      payment: "₦1,200,000",
    },
  ],
  attachments: [
    { id: 1, name: "Contract_Agreement.pdf", size: "2.4 MB", type: "PDF" },
    { id: 2, name: "Architectural_Plans.pdf", size: "5.2 MB", type: "PDF" },
    { id: 3, name: "Safety_Protocol.docx", size: "800 KB", type: "DOCX" },
  ],
};

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const contract = { ...mockContractDetails, id: Number(id) };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
    { id: "projects", label: "Projects", icon: <FaBriefcase /> },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "in_progress":
        return "bg-blue-600";
      case "pending":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <Link to="/">
            <img src={Logo} alt="Build Trust Africa Logo" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openAdminSidebar(!isOpen))}
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
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
          >
            <Link to="/">
              <img src={Logo} alt="" className="w-[55%]" />
            </Link>
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
              className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center ${
                item.id === "contracts"
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
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                Contract Details
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                View and manage contract information
              </p>
            </div>
            <Button
              className="bg-[#253E44] hover:bg-[#253E44]/90 text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => navigate("/contracts")}
            >
              ← Back to Contracts
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
            <Card className="glass-header p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 md:mb-6 gap-4">
                <div className="flex gap-3 md:gap-4 items-center">
                  <div className="p-2 md:p-3 bg-primary/10 rounded-xl">
                    <span className="material-icons-round text-primary text-xl md:text-3xl">
                      <FaGavel />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                      <h2 className="text-md md:text-xl font-bold truncate">{contract.title}</h2>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider self-start">
                        {contract.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm mt-0.5 truncate">
                      Contract {contract.contract_number} • {contract.developer}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-gray-200">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Total Value
                  </span>
                  <span className="text-base md:text-lg font-bold text-primary">
                    {contract.value}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Start Date
                  </span>
                  <span className="text-base md:text-lg font-bold">
                    {new Date(contract.start_date).toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    End Date
                  </span>
                  <span className="text-base md:text-lg font-bold">
                    {new Date(contract.end_date).toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Current Phase
                  </span>
                  <span className="text-base md:text-lg font-bold flex items-center gap-2">
                    Roof &amp; Windows
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  </span>
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <Card className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
                    <h3 className="text-base md:text-lg font-bold">Milestone Progress</h3>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <span className="text-xs md:text-sm font-medium text-gray-500">
                        Overall Completion: 65%
                      </span>
                      <div className="w-full sm:w-48 h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-primary h-full w-[65%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {contract.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row md:justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/50 gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${milestone.status === "completed" ? "bg-green-500" : milestone.status === "in_progress" ? "bg-blue-500" : "bg-gray-300"}`}
                          >
                            {milestone.status === "completed" && <FaCheck className="text-sm" />}
                            {milestone.status === "in_progress" && <FaRetweet className="text-sm" />}
                            {milestone.status === "pending" && <FaClock className="text-sm" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base mb-1">
                              {milestone.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Due: {new Date(milestone.dueDate).toLocaleDateString("en-NG", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t md:border-t-0 md:gap-2 border-gray-100">
                          <div className="flex flex-col">
                            <p className="text-sm font-bold">{milestone.payment}</p>
                            <p className="text-xs text-gray-400">Paid</p>
                          </div>
                          <span className={`px-3 py-1.5 text-xs font-bold rounded-full uppercase ${
                            milestone.status === "completed" ? "bg-green-100 text-green-700" :
                            milestone.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {milestone.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">Key Contract Terms</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {contract.terms.map((term, index) => (
                      <div key={index} className="p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mb-2 md:mb-3 ${
                          term.title === "Payment Terms" ? "text-amber-600 bg-amber-100" :
                          term.title === "Warranty Period" ? "bg-blue-100 text-blue-600" :
                          "bg-green-100 text-green-600"
                        }`}>
                          {term.title === "Payment Terms" && <FaCreditCard className="text-sm md:text-base" />}
                          {term.title === "Warranty Period" && <FaCircleCheck className="text-sm md:text-base" />}
                          {term.title === "Site Access" && <FaLocationPin className="text-sm md:text-base" />}
                        </div>
                        <h4 className="font-bold text-sm md:text-base mb-1">
                          {term.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {term.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <div className="space-y-6 md:space-y-8">
                <Card className="bg-[#253E44] text-white p-4 md:p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Quick Actions</h3>
                    <div className="space-y-2 md:space-y-3">
                      <button className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 md:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-xs md:text-sm">
                        <FaBook className="text-sm md:text-base"/>
                        Sign Contract
                      </button>
                      <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 md:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-xs md:text-sm">
                        <FaMessage className="text-sm md:text-base"/>
                        Message Developer
                      </button>
                      <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 md:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-xs md:text-sm">
                        <FaFilePdf className="text-sm md:text-base"/>
                        Export as PDF
                      </button>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 md:-bottom-8 -right-6 md:-right-8 w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full blur-2xl"></div>
                </Card>
                <Card className="p-4 md:p-6">
                  <div className="flex justify-between items-center mb-3 md:mb-4">
                    <h3 className="text-base md:text-lg font-bold">Documents</h3>
                    <span className="text-xs text-primary font-bold cursor-pointer hover:underline">
                      View All
                    </span>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center p-2.5 md:p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className="p-1.5 md:p-2 bg-red-100 text-red-600 rounded-lg mr-2 md:mr-3 flex-shrink-0">
                        <FaFilePdf className="text-sm md:text-base"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-medium truncate">
                          Contract_Agreement.pdf
                        </h4>
                        <p className="text-[10px] text-gray-500">
                          2.4 MB • Jan 10
                        </p>
                      </div>
                      <button className="text-gray-400 group-hover:text-primary transition-colors flex-shrink-0">
                        <FaDownload className="text-sm md:text-base"/>
                      </button>
                    </div>
                    <div className="flex items-center p-2.5 md:p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-lg mr-2 md:mr-3 flex-shrink-0">
                        <FaLayerGroup className="text-sm md:text-base"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-medium truncate">
                          Architectural_Plans.pdf
                        </h4>
                        <p className="text-[10px] text-gray-500">
                          15.2 MB • Jan 12
                        </p>
                      </div>
                      <button className="text-gray-400 group-hover:text-primary transition-colors flex-shrink-0">
                        <FaDownload className="text-sm md:text-base"/>
                      </button>
                    </div>
                    <div className="flex items-center p-2.5 md:p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className="p-1.5 md:p-2 bg-emerald-100 text-emerald-600 rounded-lg mr-2 md:mr-3 flex-shrink-0">
                        <FaBook className="text-sm md:text-base"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-medium truncate">
                          Safety_Protocols.docx
                        </h4>
                        <p className="text-[10px] text-gray-500">
                          800 KB • Jan 15
                        </p>
                      </div>
                      <button className="text-gray-400 group-hover:text-primary transition-colors flex-shrink-0">
                        <FaDownload className="text-sm md:text-base"/>
                      </button>
                    </div>
                  </div>
                  <button className="w-full mt-3 md:mt-4 py-2 text-xs font-bold text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                    <FaUpload className="text-sm md:text-base"/>
                    Upload New Document
                  </button>
                </Card>
                <div className="p-3 md:p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white flex-shrink-0">
                      <img
                        alt="Developer Avatar"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqvhKU6XAw0LAk0iwFdYICbYCywpB_ax49T98jvB558qiKEobTWDGipPsW5O3M1fZq4IxJiCAVYxs6Hj3ihbXc3uGfSDSGZo8SsRjAmMCz61jQ6paGtgBS2LnuESnd35RIzt3_99cWG5_igO9owTtIXHfda5LQ17P9vwHp89YaLRte_9Kt6zWOkPQiSg36FlhbuwIrC5dzFBVCBNl_YksixTV2qEmrti2k56Gky2ZsLvi4hVAUkj3Tkq8dgIwlhfyvqrEvw0VnhXWD"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">Engr. Adewale</h4>
                      <p className="text-[10px] text-gray-500">
                        Principal Developer
                      </p>
                    </div>
                    <button className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform flex-shrink-0">
                      <FaPhone className="text-sm md:text-base"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
