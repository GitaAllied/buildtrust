
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { DollarSign, CheckCircle, Clock, Download, ArrowLeft, CreditCard } from "lucide-react";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: "Modern Duplex in Lekki",
      totalAmount: 8500000,
      paidAmount: 4300000,
      milestones: [
        { name: "Foundation", amount: 2800000, status: "paid", date: "2024-10-15" },
        { name: "Block Work", amount: 1500000, status: "paid", date: "2024-11-02" },
        { name: "Roofing", amount: 3200000, status: "pending", date: "2024-12-01" },
        { name: "Finishing", amount: 1000000, status: "upcoming", date: "2025-01-15" }
      ]
    },
    {
      id: 2,
      title: "Commercial Plaza",
      totalAmount: 25000000,
      paidAmount: 5000000,
      milestones: [
        { name: "Site Preparation", amount: 5000000, status: "paid", date: "2024-11-10" },
        { name: "Foundation", amount: 8000000, status: "pending", date: "2024-12-15" },
        { name: "Structure", amount: 12000000, status: "upcoming", date: "2025-03-01" }
      ]
    }
  ];

  const transactions = [
    {
      id: 1,
      project: "Modern Duplex",
      milestone: "Block Work",
      amount: 1500000,
      date: "2024-11-02",
      status: "completed",
      method: "Bank Transfer"
    },
    {
      id: 2,
      project: "Modern Duplex",
      milestone: "Foundation",
      amount: 2800000,
      date: "2024-10-15",
      status: "completed",
      method: "Bank Transfer"
    },
    {
      id: 3,
      project: "Commercial Plaza",
      milestone: "Site Preparation",
      amount: 5000000,
      date: "2024-11-10",
      status: "completed",
      method: "Wire Transfer"
    }
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">Payments & Escrow</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Manage your project payments and milestones</p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm w-full sm:w-auto">
            <CreditCard className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "overview" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "transactions" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Transactions
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Total Invested</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">₦9.3M</p>
                  <p className="text-sm text-green-600">Across 2 projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600">₦11.2M</p>
                  <p className="text-sm text-gray-500">2 milestones due</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Completed Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">3</p>
                  <p className="text-sm text-gray-500">₦15.7M total value</p>
                </CardContent>
              </Card>
            </div>

            {/* Project Payment Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Project Payment Status</h2>
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="outline">
                        {Math.round((project.paidAmount / project.totalAmount) * 100)}% Complete
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {formatAmount(project.paidAmount)} of {formatAmount(project.totalAmount)}</span>
                      <span>{Math.round((project.paidAmount / project.totalAmount) * 100)}%</span>
                    </div>
                    <Progress value={(project.paidAmount / project.totalAmount) * 100} className="h-2" />
                    
                    <div className="space-y-2">
                      {project.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                              <p className="text-sm text-gray-500">{milestone.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatAmount(milestone.amount)}</p>
                            <Badge 
                              variant={milestone.status === "paid" ? "default" : milestone.status === "pending" ? "destructive" : "secondary"}
                              className={milestone.status === "paid" ? "bg-green-600" : ""}
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

        {activeTab === "transactions" && (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Milestone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{transaction.project}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{transaction.milestone}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {formatAmount(transaction.amount)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{transaction.method}</td>
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
  );
};

export default Payments;
