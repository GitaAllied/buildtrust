import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, Shield } from "lucide-react";

const AdminAnalytics = () => {
  const navigate = useNavigate();

  const analyticsData = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: Users
    },
    {
      title: "Active Projects",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp
    },
    {
      title: "Total Revenue",
      value: "₦45.2M",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Platform Growth",
      value: "23.7%",
      change: "+5.1%",
      trend: "up",
      icon: BarChart3
    }
  ];

  const monthlyData = [
    { month: "Jan", users: 1200, projects: 89, revenue: 3200000 },
    { month: "Feb", users: 1350, projects: 95, revenue: 3500000 },
    { month: "Mar", users: 1520, projects: 102, revenue: 3800000 },
    { month: "Apr", users: 1680, projects: 118, revenue: 4200000 },
    { month: "May", users: 1850, projects: 125, revenue: 4500000 },
    { month: "Jun", users: 2100, projects: 135, revenue: 4800000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/super-admin-dashboard')}
                className="flex items-center space-x-2 text-xs md:text-sm"
              >
                <Shield className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="hidden sm:block text-gray-300">|</div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-500">Platform performance and insights</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" size="sm" className="text-xs md:text-sm w-full sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 Days
              </Button>
              <Button variant="outline" size="sm" className="text-xs md:text-sm w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {analyticsData.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className={`text-xs md:text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change} from last month
                    </p>
                  </div>
                  <metric.icon className="h-6 md:h-8 w-6 md:w-8 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* User Growth Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base">User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between text-xs md:text-sm">
                    <span className="font-medium">{data.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{data.users} users</span>
                      <Progress value={(data.users / 2500) * 100} className="w-12 md:w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base">Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between text-xs md:text-sm">
                    <span className="font-medium">{data.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">₦{(data.revenue / 1000000).toFixed(1)}M</span>
                      <Progress value={(data.revenue / 5000000) * 100} className="w-12 md:w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Top Performing Regions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base">Top Regions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span>Lagos</span>
                <span className="font-medium">3,245 users</span>
              </div>
              <Progress value={65} className="h-2" />

              <div className="flex justify-between items-center text-xs md:text-sm">
                <span>Abuja</span>
                <span className="font-medium">2,180 users</span>
              </div>
              <Progress value={43} className="h-2" />

              <div className="flex justify-between items-center text-xs md:text-sm">
                <span>Port Harcourt</span>
                <span className="font-medium">1,890 users</span>
              </div>
              <Progress value={38} className="h-2" />
            </CardContent>
          </Card>

          {/* User Engagement */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base">User Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-center">
              <div>
                <p className="text-xl md:text-2xl font-bold text-green-600">87%</p>
                <p className="text-xs md:text-sm text-gray-600">Active Users</p>
              </div>
              <Progress value={87} className="h-2" />

              <div className="mt-3">
                <p className="text-xl md:text-2xl font-bold text-blue-600">4.2</p>
                <p className="text-xs md:text-sm text-gray-600">Avg. Session Time (hrs)</p>
              </div>

              <div className="mt-3">
                <p className="text-xl md:text-2xl font-bold text-purple-600">92%</p>
                <p className="text-xs md:text-sm text-gray-600">Return Rate</p>
              </div>
            </CardContent>
          </Card>

          {/* System Performance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base">System Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between items-center">
                <span>Uptime</span>
                <span className="font-medium text-green-600">99.9%</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Response Time</span>
                <span className="font-medium">245ms</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Error Rate</span>
                <span className="font-medium text-red-600">0.1%</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Server Load</span>
                <span className="font-medium">67%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;