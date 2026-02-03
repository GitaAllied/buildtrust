import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, FileText, Download, Eye } from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaDoorOpen,
  FaFileContract,
  FaGear,
  FaMessage,
  FaMoneyBill,
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
  description: "Comprehensive construction contract for a modern duplex with contemporary finishes, 4 bedrooms, open plan living, and sustainable features including solar installation and water harvesting.",
  terms: [
    { title: "Payment Terms", details: "50% upfront, 30% at foundation completion, 20% at final handover" },
    { title: "Project Duration", details: "12 months from commencement date" },
    { title: "Warranty Period", details: "2 years on all structural work, 1 year on finishes" },
    { title: "Site Access", details: "Monday to Friday, 8 AM to 5 PM" },
  ],
  milestones: [
    { id: 1, title: "Foundation & Excavation", status: "completed", dueDate: "2024-03-15", payment: "₦2,550,000" },
    { id: 2, title: "Block Work & Columns", status: "completed", dueDate: "2024-05-15", payment: "₦2,550,000" },
    { id: 3, title: "Roof & Windows", status: "in_progress", dueDate: "2024-08-15", payment: "₦1,700,000" },
    { id: 4, title: "Electrical & Plumbing", status: "pending", dueDate: "2024-10-15", payment: "₦1,200,000" },
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
          <Link to="/"><img src={Logo} alt="Build Trust Africa Logo" /></Link>
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
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
          >
            <Link to="/"><img src={Logo} alt="" className="w-[55%]" /></Link>
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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Contract Header Card */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="h-6 w-6 text-[#226F75] mt-1" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{contract.title}</h2>
                        <p className="text-sm text-gray-500">Contract #{contract.contract_number}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
                      <div>
                        <p><strong>Developer:</strong> {contract.developer}</p>
                        <p className="text-xs text-gray-500">{contract.developer_email}</p>
                      </div>
                      <div>
                        <p><strong>Project:</strong> {contract.project}</p>
                        <p className="text-xs text-gray-500">{contract.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-white mb-3 ${contract.status === "Active" ? "bg-green-600" : "bg-gray-600"}`}>
                      {contract.status}
                    </Badge>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500">Contract Value</p>
                      <p className="text-2xl font-bold text-[#226F75]">{contract.value}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Contract Description</h3>
                    <p className="text-gray-700 leading-relaxed">{contract.description}</p>
                  </CardContent>
                </Card>

                {/* Contract Terms */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Contract Terms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contract.terms.map((term, idx) => (
                        <div key={idx} className="border-l-4 border-[#226F75] pl-4">
                          <h4 className="font-semibold text-gray-900">{term.title}</h4>
                          <p className="text-sm text-gray-600">{term.details}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Milestones */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Project Milestones</h3>
                    <div className="space-y-3">
                      {contract.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                          <div className={`h-10 w-10 rounded-full ${getStatusColor(milestone.status)} flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm`}>
                            {milestone.id}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                              <Badge className={`text-xs ${getStatusColor(milestone.status)} text-white`}>
                                {getStatusLabel(milestone.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Due: {milestone.dueDate}</p>
                            <p className="text-sm font-semibold text-[#226F75]">{milestone.payment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contract Duration */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Contract Duration</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p className="font-semibold text-gray-900">{contract.start_date}</p>
                      </div>
                      <div className="pt-3 border-t">
                        <p className="text-gray-500">End Date</p>
                        <p className="font-semibold text-gray-900">{contract.end_date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Attachments */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Attachments</h4>
                    <div className="space-y-2">
                      {contract.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size}</p>
                          </div>
                          <Download className="h-4 w-4 text-[#226F75] cursor-pointer hover:text-[#226F75]/80" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card className="border-0 shadow-md bg-gradient-to-br from-[#226F75]/10 to-[#253E44]/10">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Actions</h4>
                    <div className="space-y-2">
                      <Button className="w-full bg-[#226F75] hover:bg-[#226F75]/90">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Contract
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Request Modification
                      </Button>
                      <Button variant="outline" className="w-full">
                        Message Developer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
