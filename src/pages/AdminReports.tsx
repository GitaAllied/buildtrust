import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Calendar, Shield, TrendingUp, Users, DollarSign } from "lucide-react";

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedType, setSelectedType] = useState("all");
  const navigate = useNavigate();

  const reportTypes = [
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
    },
    {
      id: "system",
      title: "System Health Report",
      description: "Server performance, uptime, and technical metrics",
      icon: Shield,
      lastGenerated: "2024-01-08",
      status: "Processing"
    }
  ];

  const recentReports = [
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
  ];

  const handleGenerateReport = (reportType: string) => {
    // In a real app, this would trigger report generation
    console.log(`Generating ${reportType} report for ${selectedPeriod} period`);
  };

  const handleDownloadReport = (reportId: number) => {
    // In a real app, this would download the report
    console.log(`Downloading report ${reportId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-sm text-gray-500">Generate and download detailed reports</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-32">
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
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Report Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportTypes.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
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
                  className="w-full"
                  variant="outline"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={report.status === 'Processing'}
                >
                  {report.status === 'Processing' ? 'Generating...' : 'Generate Report'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Scheduled Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                <div>
                  <h4 className="font-medium text-gray-900">Monthly Financial Summary</h4>
                  <p className="text-sm text-gray-600">Generated on the 1st of each month</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-2 gap-2 sm:gap-0">
                  <span className="text-sm text-green-600">Active</span>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Edit Schedule
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                <div>
                  <h4 className="font-medium text-gray-900">Weekly User Activity Report</h4>
                  <p className="text-sm text-gray-600">Generated every Monday</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-2 gap-2 sm:gap-0">
                  <span className="text-sm text-green-600">Active</span>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Edit Schedule
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                <div>
                  <h4 className="font-medium text-gray-900">Quarterly Performance Review</h4>
                  <p className="text-sm text-gray-600">Generated at quarter end</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-2 gap-2 sm:gap-0">
                  <span className="text-sm text-gray-500">Inactive</span>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Activate
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;