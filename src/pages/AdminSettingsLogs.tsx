import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { FileText, Search, Filter, Download, ArrowLeft, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

const AdminSettingsLogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  const logs = [
    {
      id: 1,
      timestamp: "2024-01-09 14:30:25",
      level: "error",
      type: "authentication",
      message: "Failed login attempt for user admin@buildtrust.africa from IP 192.168.1.100",
      user: "admin@buildtrust.africa",
      ip: "192.168.1.100"
    },
    {
      id: 2,
      timestamp: "2024-01-09 14:25:10",
      level: "info",
      type: "payment",
      message: "Payment processed successfully - Transaction ID: TXN_123456789",
      user: "john.doe@example.com",
      ip: "203.0.113.45"
    },
    {
      id: 3,
      timestamp: "2024-01-09 14:20:05",
      level: "warning",
      type: "system",
      message: "High memory usage detected: 85% of available RAM",
      user: "system",
      ip: "localhost"
    },
    {
      id: 4,
      timestamp: "2024-01-09 14:15:30",
      level: "info",
      type: "user",
      message: "New user registration: sarah.johnson@example.com",
      user: "sarah.johnson@example.com",
      ip: "198.51.100.23"
    },
    {
      id: 5,
      timestamp: "2024-01-09 14:10:15",
      level: "error",
      type: "api",
      message: "API rate limit exceeded for key bt_prod_xxxxxxxxxxxxxxxx",
      user: "api_user",
      ip: "104.28.1.100"
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip.includes(searchTerm);
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    const matchesType = filterType === "all" || log.type === filterType;
    return matchesSearch && matchesLevel && matchesType;
  });

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLogBadgeColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-orange-100 text-orange-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "success":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportLogs = () => {
    console.log("Exporting logs...");
    alert("Logs exported successfully!");
  };

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all logs? This action cannot be undone.")) {
      console.log("Clearing logs...");
      alert("Logs cleared successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/settings')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Settings</span>
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
                <p className="text-sm text-gray-500">View and manage system activity logs</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-x-0 sm:space-x-2 mt-4">
              <Button onClick={handleExportLogs} variant="outline" className="w-full sm:w-auto mb-2 sm:mb-0">
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
              <Button onClick={handleClearLogs} variant="destructive" className="w-full sm:w-auto">
                Clear Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>System Logs ({filteredLogs.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 mt-1">
                    {getLogIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getLogBadgeColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{log.type}</span>
                      <span className="text-sm text-gray-500">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{log.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>User: {log.user}</span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs.filter(log => log.level === 'error').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs.filter(log => log.level === 'warning').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Info className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Info</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs.filter(log => log.level === 'info').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs.filter(log => log.level === 'success').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsLogs;