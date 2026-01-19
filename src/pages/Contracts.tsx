import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Eye, Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaFileContract,
  FaGear,
  FaMessage,
  FaMoneyBill,
  FaUser,
  FaUserGear,
} from "react-icons/fa6";

const Contracts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("contracts");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
    { id: "projects", label: "Projects", icon: <FaBriefcase /> },
    { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
    { id: "messages", label: "Messages", icon: <FaMessage />, active: true },
    { id: "contracts", label: "Contracts", icon: <FaFileContract /> },
    { id: "saved", label: "Saved Developers", icon: <FaUserGear /> },
    { id: "settings", label: "Settings", icon: <FaGear /> },
  ];

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
      default:
        navigate("/browse");
    }
  };

  const contracts = [
    {
      id: 1,
      title: "Modern Duplex Construction Contract",
      developer: "Engr. Adewale Structures",
      project: "Modern Duplex in Lekki",
      value: "₦8,500,000",
      status: "Active",
      signed: "2024-01-15",
      deadline: "2024-12-15",
    },
    {
      id: 2,
      title: "Commercial Plaza Development Agreement",
      developer: "Prime Build Ltd",
      project: "Commercial Plaza",
      value: "₦25,000,000",
      status: "Active",
      signed: "2024-02-20",
      deadline: "2025-06-20",
    },
    {
      id: 3,
      title: "Bungalow Renovation Contract",
      developer: "Covenant Builders",
      project: "Bungalow Renovation",
      value: "₦4,200,000",
      status: "Completed",
      signed: "2023-10-10",
      deadline: "2024-01-10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <img src={Logo} alt="Build Trust Africa Logo" />
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
        } md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed md:relative top-14 md:top-0 left-0 right-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}
      >
        <div className="p-4 sm:p-6 border-b border-white/20 hidden md:block">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
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
      <div className="w-full flex-1 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
                <p className="text-gray-500">Manage your project contracts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6">
            {contracts.map((contract) => (
              <Card
                key={contract.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-5 md:justify-between flex-col md:flex-row">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <h3 className="font-semibold text-lg">
                          {contract.title}
                        </h3>
                        <Badge
                          variant={
                            contract.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            contract.status === "Active" ? "bg-green-600" : ""
                          }
                        >
                          {contract.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 text-sm text-gray-600">
                        <div>
                          <p>
                            <strong>Developer:</strong> {contract.developer}
                          </p>
                          <p>
                            <strong>Project:</strong> {contract.project}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Contract Value:</strong> {contract.value}
                          </p>
                          <p>
                            <strong>Signed:</strong> {contract.signed}
                          </p>
                          <p>
                            <strong>Deadline:</strong> {contract.deadline}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
