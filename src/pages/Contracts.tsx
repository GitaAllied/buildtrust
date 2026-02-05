import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Eye, Menu, X } from "lucide-react";
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
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/api";

// Derive backend origin to resolve media URLs stored as "/uploads/...".
const API_BASE = (import.meta.env.VITE_API_URL ?? 'https://buildtrust-backend.onrender.com/api').replace(/\/+$/, '');
const API_ORIGIN = API_BASE.replace(/\/api$/, '');

const Contracts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("contracts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
        case "logout":
        handleLogout();
        break;
      default:
        navigate("/browse");
    }
  };
  // Real data state
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date or show 'Pending' if null
  const formatDateOrPending = (date: any) => {
    if (!date) return 'Pending';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Pending';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Resolve media URL helper (in case contract has file references)
  const resolveMediaUrl = (media: any) => {
    if (!media) return null;
    let url = media.url ?? media.filename ?? null;
    if (!url) return null;
    url = String(url);
    if (url.startsWith('http')) return url;
    if (!url.startsWith('/')) url = `/${url}`;
    return `${API_ORIGIN}${url}`;
  };

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        // Backend does not expose /api/contracts; use /api/projects which returns enriched projects including contract info
        const res = await apiClient.getClientProjects();
        const projects = res.projects ?? res.data ?? res;
        const mapped = (Array.isArray(projects) ? projects : []).map((p: any) => ({
          id: p.contract_id || p.id,
          title: p.contract_title || p.title || `Contract for ${p.title || 'Project'}`,
          developer: p.developer_name || p.developer || '',
          project: p.title || p.project_title || '',
          value: p.agreed_amount || p.value || p.budget_range || p.budget || '—',
          status: (p.contract_status || p.status) || (p.contract_id ? 'Active' : 'Draft') ,
          start_date: p.start_date || null,
          end_date: p.deadline || p.contract_deadline || p.end_date || null,
          signed: p.contract_signed_at || p.signed_at || p.created_at || '',
          deadline: p.contract_deadline || p.deadline || '',
          file: p.contract_file || p.file || null,
        })).filter((c: any) => c.id); // keep only entries with a contract id

        setContracts(mapped);
      } catch (err: any) {
        console.error('Error fetching contracts:', err);
        setError(err.message || 'Failed to load contracts');
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

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
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="md:text-2xl font-bold text-gray-900">Contracts</h1>
                <p className="text-gray-500">Manage your project contracts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Loading contracts...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-12">
              <p className="text-lg font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No contracts found.</div>
          ) : (
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
                          <h3 className="font-semibold text-base md:text-lg">
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
                              <strong>Start Date:</strong> {formatDateOrPending(contract.start_date)}
                            </p>
                            <p>
                              <strong>End Date:</strong> {formatDateOrPending(contract.end_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/contracts/${contract.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {contract.file ? (
                          <a href={resolveMediaUrl(contract.file) || contract.file} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <Download className="h-4 w-4 mr-2" />
                            No File
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;
