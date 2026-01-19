import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  X,
  Menu,
  CheckCircle,
  Clock,
  Download,
  CreditCard,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaDownload,
  FaGear,
  FaMessage,
  FaMoneyBill,
  FaUpload,
  FaUser,
} from "react-icons/fa6";

const DeveloperPayments = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  const [selectedConversation, setSelectedConversation] = useState(1);
    const [newMessage, setNewMessage] = useState("");  

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaUser />
    },
    { id: "requests", label: "Project Requests", icon: <FaDownload /> },
    { id: "projects", label: "Active Projects", icon: <FaBriefcase /> },
    { id: "upload", label: "Upload Update", icon: <FaUpload /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "payments", label: "Payments", icon: <FaMoneyBill />,
      active: true, },
    { id: "profile", label: "Licenses & Profile", icon: <FaUser /> },
    { id: "support", label: "Support", icon: <FaGear /> },
  ];

  const projects = [
    {
      id: 1,
      title: "Modern Duplex in Lekki",
      totalAmount: 8500000,
      paidAmount: 4300000,
      milestones: [
        {
          name: "Foundation",
          amount: 2800000,
          status: "paid",
          date: "2024-10-15",
        },
        {
          name: "Block Work",
          amount: 1500000,
          status: "paid",
          date: "2024-11-02",
        },
        {
          name: "Roofing",
          amount: 3200000,
          status: "pending",
          date: "2024-12-01",
        },
        {
          name: "Finishing",
          amount: 1000000,
          status: "upcoming",
          date: "2025-01-15",
        },
      ],
    },
    {
      id: 2,
      title: "Commercial Plaza",
      totalAmount: 25000000,
      paidAmount: 5000000,
      milestones: [
        {
          name: "Site Preparation",
          amount: 5000000,
          status: "paid",
          date: "2024-11-10",
        },
        {
          name: "Foundation",
          amount: 8000000,
          status: "pending",
          date: "2024-12-15",
        },
        {
          name: "Structure",
          amount: 12000000,
          status: "upcoming",
          date: "2025-03-01",
        },
      ],
    },
  ];

  const transactions = [
    {
      id: 1,
      project: "Modern Duplex",
      milestone: "Block Work",
      amount: 1500000,
      date: "2024-11-02",
      status: "completed",
      method: "Bank Transfer",
    },
    {
      id: 2,
      project: "Modern Duplex",
      milestone: "Foundation",
      amount: 2800000,
      date: "2024-10-15",
      status: "completed",
      method: "Bank Transfer",
    },
    {
      id: 3,
      project: "Commercial Plaza",
      milestone: "Site Preparation",
      amount: 5000000,
      date: "2024-11-10",
      status: "completed",
      method: "Wire Transfer",
    },
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex flex-col md:flex-row">
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
        } md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed md:relative top-14 md:top-0 left-0 right-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}
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

      {/* Main Content */}
      <div className="w-full flex-1 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  Payments & Escrow
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Manage your project payments and milestones
                </p>
              </div>
            </div>
            <Button className="bg-[#253E44] hover:bg-[#253E44]/90 text-xs sm:text-sm w-full sm:w-auto">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === "overview"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("transactions")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === "transactions"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Transactions
            </button>
          </div>

          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-600">
                      Total Invested
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900">₦9.3M</p>
                    <p className="text-sm text-green-600">Across 2 projects</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-600">
                      Pending Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">₦11.2M</p>
                    <p className="text-sm text-gray-500">2 milestones due</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-600">
                      Completed Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">3</p>
                    <p className="text-sm text-gray-500">₦15.7M total value</p>
                  </CardContent>
                </Card>
              </div>

              {/* Project Payment Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Project Payment Status
                </h2>
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {project.title}
                        </CardTitle>
                        <Badge variant="outline">
                          {Math.round(
                            (project.paidAmount / project.totalAmount) * 100
                          )}
                          % Complete
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>
                          Progress: {formatAmount(project.paidAmount)} of{" "}
                          {formatAmount(project.totalAmount)}
                        </span>
                        <span>
                          {Math.round(
                            (project.paidAmount / project.totalAmount) * 100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(project.paidAmount / project.totalAmount) * 100}
                        className="h-2"
                      />

                      <div className="space-y-2">
                        {project.milestones.map((milestone, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {milestone.status === "paid" && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                              {milestone.status === "pending" && (
                                <Clock className="h-5 w-5 text-orange-500" />
                              )}
                              {milestone.status === "upcoming" && (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                              )}
                              <div>
                                <p className="font-medium">{milestone.name}</p>
                                <p className="text-sm text-gray-500">
                                  {milestone.date}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatAmount(milestone.amount)}
                              </p>
                              <Badge
                                variant={
                                  milestone.status === "paid"
                                    ? "default"
                                    : milestone.status === "pending"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className={
                                  milestone.status === "paid"
                                    ? "bg-green-600"
                                    : ""
                                }
                              >
                                {milestone.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "transactions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Milestone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Method
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {transaction.date}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {transaction.project}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {transaction.milestone}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {formatAmount(transaction.amount)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {transaction.method}
                            </td>
                            <td className="px-6 py-4">
                              <Badge className="bg-green-600">
                                {transaction.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperPayments;
