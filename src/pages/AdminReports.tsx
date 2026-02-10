import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  X,
  Menu,
  Loader
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import AdminSidebar from "@/components/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openAdminSidebar, openSignoutModal } from "@/redux/action";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: any;
  lastGenerated?: string;
  status: "Ready" | "Processing";
}

interface ReportData {
  id: number;
  name: string;
  type: string;
  generated: string;
  size: string;
  downloads: number;
  data?: any;
}

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedType, setSelectedType] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const isOpen = useSelector((state:any) => state.sidebar.adminSidebar)
  const signOutModal = useSelector((state:any) => state.signout) 

  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [recentReports, setRecentReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load report types on mount
  useEffect(() => {
    loadReportTypes();
  }, []);

  const loadReportTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const types = await apiClient.getReportTypes();
      
      // Map icon components
      const iconMap: Record<string, any> = {
        DollarSign,
        Users,
        TrendingUp,
      };

      const mappedTypes = types.map((type: any) => ({
        ...type,
        icon: iconMap[type.icon] || FileText,
        status: 'Ready' as const,
      }));

      setReportTypes(mappedTypes);
    } catch (err: any) {
      console.error('Error loading report types:', err);
      setError('Failed to load report types');
    } finally {
      setLoading(false);
    }
  };

  const { toast } = useToast();

  const handleGenerateReport = async (reportTypeId: string) => {
    try {
      setGeneratingReport(reportTypeId);
      setError(null);

      let response: any;
      if (reportTypeId === 'financial') {
        response = await apiClient.generateFinancialReport(selectedPeriod);
      } else if (reportTypeId === 'user') {
        response = await apiClient.generateUserReport(selectedPeriod);
      } else if (reportTypeId === 'project') {
        response = await apiClient.generateProjectReport(selectedPeriod);
      }

      // Update status to Ready
      setReportTypes((prev) =>
        prev.map((r) =>
          r.id === reportTypeId 
            ? { 
                ...r, 
                status: 'Ready' as const, 
                lastGenerated: new Date().toLocaleString() 
              } 
            : r
        )
      );

      // Add to recent reports
      if (response) {
        setRecentReports((prev) => [response, ...prev]);
      }

      toast({
        title: "Report ready",
        description: "The report is ready for download.",
      });
    } catch (err: any) {
      console.error('Error generating report:', err);
      setError(err?.message || 'Failed to generate report');
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleDownloadReport = async (reportId: number, type: string) => {
    try {
      await apiClient.downloadReport(reportId, type);

      // Increment download counter
      setRecentReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, downloads: r.downloads + 1 } : r
        )
      );

      toast({
        title: "Download started",
        description: "Report is being downloaded.",
      });
    } catch (err: any) {
      console.error('Error downloading report:', err);
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      });
    }
  };

  const visibleReportTypes = reportTypes.filter(
    (r) => selectedType === "all" || r.id === selectedType
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={'/'}><img src={Logo} alt="" /></Link>
        </div>
        <button
          onClick={() => dispatch(openAdminSidebar(!isOpen))}
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
      <AdminSidebar active={"reports"} />
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
            <div className="flex items-start justify-between flex-col md:flex-row md:items-center gap-4 md:gap-0">
              <div className="flex items-center space-x-4 ">
                <div>
                  <h1 className="md:text-2xl font-bold text-gray-900">
                    Reports & Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Generate and download detailed reports
                  </p>
                </div>
              </div>
              <div className="flex flex-row sm:items-center gap-3">
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-full sm:w-32 md:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-40 md:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading reports...</span>
            </div>
          ) : (
            <>
          {/* Report Types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8 auto-rows-fr flex-1 min-h-[220px]">
            {visibleReportTypes.length ? (
              visibleReportTypes.map((report) => (
                <Card
                  key={report.id}
                  className="hover:shadow-md transition-shadow h-full"
                >
                  <CardContent className="p-4 md:p-6 h-full flex flex-col">
                    <div className="flex items-start sm:items-center justify-between mb-4 gap-3">
                      <report.icon className="h-8 w-8 text-gray-400" />
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          generatingReport === report.id
                            ? "bg-orange-100 text-orange-800"
                            : report.status === "Ready"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {generatingReport === report.id ? "Processing..." : report.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {report.description}
                    </p>
                    <div className="text-xs text-gray-500 mb-4">
                      Last generated: {report.lastGenerated || "Never"}
                    </div>
                    <Button
                      className="mt-auto w-full"
                      variant="outline"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={generatingReport === report.id}
                    >
                      {generatingReport === report.id ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        "Generate Report"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-dashed border-2 border-gray-200 h-full">
                <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                  <h3 className="text-lg font-medium">No reports found</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Try selecting a different type or show all reports.
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={() => setSelectedType("all")}
                      variant="outline"
                    >
                      Show All Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Reports */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.length ? (
                  recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3"
                    >
                      <div className="flex items-start sm:items-center space-x-4 flex-1 min-w-0">
                        <FileText className="h-8 w-8 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {report.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span>Type: {report.type}</span>
                            <span>Generated: {report.generated}</span>
                            <span>Size: {report.size}</span>
                            <span>Downloads: {report.downloads}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadReport(report.id, report.type.toLowerCase())}
                        className="w-full sm:w-auto flex-shrink-0"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No recent reports yet. Generate a report to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
            </>
          )}
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() =>dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default AdminReports;
