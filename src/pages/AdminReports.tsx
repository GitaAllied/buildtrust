import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Calendar, Shield, TrendingUp, Users, DollarSign } from "lucide-react";

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedType, setSelectedType] = useState("all");
  const navigate = useNavigate();

  const [reportTypes, setReportTypes] = useState([
    {
      id: "financial",
      title: "Financial Report",
      description: "Revenue, payments, and financial metrics",
      icon: DollarSign,
      lastGenerated: "2024-01-08",
      status: "Ready"
    },
    {
      id: "user",
      title: "User Activity Report",
      description: "User registrations, engagement, and demographics",
      icon: Users,
      lastGenerated: "2024-01-08",
      status: "Ready"
    },
    {
      id: "project",
      title: "Project Performance Report",
      description: "Project completion rates, timelines, and quality metrics",
      icon: TrendingUp,
      lastGenerated: "2024-01-07",
      status: "Ready"
    }
  ]);

  const [recentReports, setRecentReports] = useState([
    {
      id: 1,
      name: "Monthly Financial Report - December 2024",
      type: "Financial",
      generated: "2024-01-08 14:30",
      size: "2.4 MB",
      downloads: 12
    },
    {
      id: 2,
      name: "User Activity Report - December 2024",
      type: "User",
      generated: "2024-01-08 12:15",
      size: "1.8 MB",
      downloads: 8
    },
    {
      id: 3,
      name: "Project Performance Q4 2024",
      type: "Project",
      generated: "2024-01-07 16:45",
      size: "3.1 MB",
      downloads: 15
    }
  ]);

  const { toast } = useToast();

  const handleGenerateReport = (reportTypeId: string) => {
    // Update status to Processing
    setReportTypes((prev) => prev.map((r) => r.id === reportTypeId ? { ...r, status: 'Processing' } : r));

    toast({ title: 'Report generation started', description: 'The report will be ready shortly.' });

    // Simulate async generation
    setTimeout(() => {
      const generatedAt = new Date().toLocaleString();
      setReportTypes((prev) => prev.map((r) => r.id === reportTypeId ? { ...r, status: 'Ready', lastGenerated: generatedAt } : r));

      // Add to recentReports
      setRecentReports((prev) => [
        {
          id: prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1,
          name: `${reportTypes.find(r => r.id === reportTypeId)?.title ?? 'Report'} - ${generatedAt.split(',')[0]}`,
          type: reportTypes.find(r => r.id === reportTypeId)?.title?.split(' ')[0] ?? 'Report',
          generated: generatedAt,
          size: `${(1 + Math.random() * 3).toFixed(1)} MB`,
          downloads: 0
        },
        ...prev
      ]);

      toast({ title: 'Report ready', description: 'The report is ready for download.' });
    }, 2000);
  };

  const handleDownloadReport = (reportId: number) => {
    const report = recentReports.find((r) => r.id === reportId);
    if (!report) return;

    // Create a small CSV/summary for demo purposes
    const csv = `Report Name,Type,Generated,Size\n"${report.name}","${report.type}","${report.generated}","${report.size}"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // Increment download counter
    setRecentReports((prev) => prev.map((r) => r.id === reportId ? { ...r, downloads: r.downloads + 1 } : r));

    toast({ title: 'Download started', description: `${report.name} is being downloaded.` });
  };

  const visibleReportTypes = reportTypes.filter(r => selectedType === 'all' || r.id === selectedType);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/super-admin-dashboard')}
                className="flex items-center space-x-2"
              >
                <Shield className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-xs sm:text-sm text-gray-500">Generate and download detailed reports</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        {/* Report Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 auto-rows-fr flex-1 min-h-[220px]">
          {visibleReportTypes.length ? visibleReportTypes.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4 md:p-6 h-full flex flex-col">
                <div className="flex items-start sm:items-center justify-between mb-4 gap-3">
                  <report.icon className="h-8 w-8 text-gray-400" />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <div className="text-xs text-gray-500 mb-4">
                  Last generated: {report.lastGenerated}
                </div>
                <Button
                  className="mt-auto w-full"
                  variant="outline"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={report.status === 'Processing'}
                >
                  {report.status === 'Processing' ? 'Generating...' : 'Generate Report'}
                </Button>
              </CardContent>
            </Card>
          )) : (
            <Card className="border-dashed border-2 border-gray-200 h-full">
              <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                <h3 className="text-lg font-medium">No reports found</h3>
                <p className="text-sm text-gray-500 mt-2">Try selecting a different type or show all reports.</p>
                <div className="mt-4">
                  <Button onClick={() => setSelectedType('all')} variant="outline">Show All Reports</Button>
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
              {recentReports.length ? recentReports.map((report) => (
                <div key={report.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                  <div className="flex items-start sm:items-center space-x-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
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
                    onClick={() => handleDownloadReport(report.id)}
                    className="w-full sm:w-auto"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              )) : (
                <div className="p-4 text-center text-sm text-gray-500">No recent reports yet. Generate a report to get started.</div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminReports;