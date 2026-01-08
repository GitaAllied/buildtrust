
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Eye } from "lucide-react";

const Contracts = () => {
  const navigate = useNavigate();

  const contracts = [
    {
      id: 1,
      title: "Modern Duplex Construction Contract",
      developer: "Engr. Adewale Structures",
      project: "Modern Duplex in Lekki",
      value: "₦8,500,000",
      status: "Active",
      signed: "2024-01-15",
      deadline: "2024-12-15"
    },
    {
      id: 2,
      title: "Commercial Plaza Development Agreement",
      developer: "Prime Build Ltd",
      project: "Commercial Plaza",
      value: "₦25,000,000",
      status: "Active",
      signed: "2024-02-20",
      deadline: "2025-06-20"
    },
    {
      id: 3,
      title: "Bungalow Renovation Contract",
      developer: "Covenant Builders",
      project: "Bungalow Renovation",
      value: "₦4,200,000",
      status: "Completed",
      signed: "2023-10-10",
      deadline: "2024-01-10"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
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
            <Card key={contract.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold text-lg">{contract.title}</h3>
                      <Badge 
                        variant={contract.status === "Active" ? "default" : "secondary"}
                        className={contract.status === "Active" ? "bg-green-600" : ""}
                      >
                        {contract.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Developer:</strong> {contract.developer}</p>
                        <p><strong>Project:</strong> {contract.project}</p>
                      </div>
                      <div>
                        <p><strong>Contract Value:</strong> {contract.value}</p>
                        <p><strong>Signed:</strong> {contract.signed}</p>
                        <p><strong>Deadline:</strong> {contract.deadline}</p>
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
  );
};

export default Contracts;
