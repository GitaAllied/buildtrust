import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Eye, Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/api";
import SignoutModal from "@/components/ui/signoutModal";
import ClientSidebar from "@/components/ClientSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openClientSidebar, openSignoutModal } from "@/redux/action";

// Derive backend origin to resolve media URLs stored as "/uploads/...".
const API_BASE = (
  import.meta.env.VITE_API_URL ?? '/api'
).replace(/\/+$/, "");
const API_ORIGIN = API_BASE.replace(/\/api$/, "");

// Mock contracts data for demo/style purposes
const MOCK_CONTRACTS = [
  {
    id: 1,
    contract_id: 1,
    title: "Modern Duplex Construction Contract",
    contract_title: "Modern Duplex Construction",
    developer_name: "Engr. Adewale Structures",
    project_title: "Modern Duplex in Lekki",
    agreed_amount: "₦8,500,000",
    contract_status: "Active",
    start_date: "2024-01-15",
    contract_deadline: "2024-12-15",
    deadline: "2024-12-15",
    contract_signed_at: "2023-12-20",
    created_at: "2023-12-20",
    contract_file: {
      url: "/uploads/contracts/modern_duplex_contract.pdf",
      filename: "Modern_Duplex_Contract.pdf",
    },
  },
  {
    id: 2,
    contract_id: 2,
    title: "Commercial Plaza Development",
    contract_title: "Commercial Plaza Development Contract",
    developer_name: "BuildCore Developments",
    project_title: "Commercial Plaza - Victoria Island",
    agreed_amount: "₦45,000,000",
    contract_status: "Active",
    start_date: "2024-02-01",
    contract_deadline: "2025-06-30",
    deadline: "2025-06-30",
    contract_signed_at: "2024-01-15",
    created_at: "2024-01-15",
    contract_file: {
      url: "/uploads/contracts/commercial_plaza_contract.pdf",
      filename: "Commercial_Plaza_Contract.pdf",
    },
  },
  {
    id: 3,
    contract_id: 3,
    title: "Residential Estate Infrastructure",
    contract_title: "Infrastructure Development",
    developer_name: "Crown Estate Builders",
    project_title: "Crown Heights Estate - Phase 2",
    agreed_amount: "₦22,000,000",
    contract_status: "Completed",
    start_date: "2023-06-01",
    contract_deadline: "2024-03-31",
    deadline: "2024-03-31",
    contract_signed_at: "2023-05-20",
    created_at: "2023-05-20",
    contract_file: {
      url: "/uploads/contracts/crown_estate_contract.pdf",
      filename: "Crown_Estate_Contract.pdf",
    },
  },
  {
    id: 4,
    contract_id: 4,
    title: "Office Complex Renovation",
    contract_title: "Office Complex Renovation Project",
    developer_name: "Prestige Constructions Ltd",
    project_title: "Downtown Office Complex Upgrade",
    agreed_amount: "₦12,500,000",
    contract_status: "Draft",
    start_date: null,
    contract_deadline: null,
    deadline: null,
    contract_signed_at: null,
    created_at: "2024-04-10",
    contract_file: null,
  },
  {
    id: 5,
    contract_id: 5,
    title: "Hospital Wing Construction",
    contract_title: "Medical Facility Construction",
    developer_name: "MedBuild Contractors",
    project_title: "Teaching Hospital - New Wing",
    agreed_amount: "₦35,000,000",
    contract_status: "Pending",
    start_date: "2024-05-01",
    contract_deadline: "2025-12-31",
    deadline: "2025-12-31",
    contract_signed_at: "2024-04-15",
    created_at: "2024-04-15",
    contract_file: {
      url: "/uploads/contracts/hospital_contract.pdf",
      filename: "Hospital_Wing_Contract.pdf",
    },
  },
];

const Contracts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: any) => state.sidebar.clientSidebar);
  const signOutModal = useSelector((state: any) => state.signout);

  // Real data state
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date or show 'Pending' if null
  const formatDateOrPending = (date: any) => {
    if (!date) return "Pending";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Pending";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Resolve media URL helper (in case contract has file references)
  const resolveMediaUrl = (media: any) => {
    if (!media) return null;
    let url = media.url ?? media.filename ?? null;
    if (!url) return null;
    url = String(url);
    if (url.startsWith("http")) return url;
    if (!url.startsWith("/")) url = `/${url}`;
    return `${API_ORIGIN}${url}`;
  };

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mapped = MOCK_CONTRACTS.map((p: any) => ({
          id: p.contract_id || p.id,
          title:
            p.contract_title ||
            p.title ||
            `Contract for ${p.title || "Project"}`,
          developer: p.developer_name || p.developer || "",
          project: p.project_title || p.title || "",
          value:
            p.agreed_amount || p.value || p.budget || "—",
          status:
            p.contract_status ||
            p.status ||
            (p.contract_id ? "Active" : "Draft"),
          start_date: p.start_date || null,
          end_date: p.contract_deadline || p.deadline || p.end_date || null,
          signed: p.contract_signed_at || p.signed_at || p.created_at || "",
          deadline: p.contract_deadline || p.deadline || "",
          file: p.contract_file || p.file || null,
        }));

        setContracts(mapped);
      } catch (err: any) {
        console.error("Error fetching contracts:", err);
        setError(err.message || "Failed to load contracts");
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
          <Link to={"/"}>
            <img src={Logo} alt="Build Trust Africa Logo" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openClientSidebar(!isOpen))}
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
      <ClientSidebar active={"contracts"} />
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="md:text-2xl font-bold text-gray-900">
                  Contracts
                </h1>
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
            <div className="text-center py-12 text-gray-600">
              No contracts found.
            </div>
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
                              <strong>Start Date:</strong>{" "}
                              {formatDateOrPending(contract.start_date)}
                            </p>
                            <p>
                              <strong>End Date:</strong>{" "}
                              {formatDateOrPending(contract.end_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/contracts/${contract.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {contract.file ? (
                          <a
                            href={
                              resolveMediaUrl(contract.file) || contract.file
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
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
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() => dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default Contracts;
