import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit2,
  Loader2,
  Save,
  FileText,
} from "lucide-react";
import { getContractById, getProjectById, getDeveloperById, updateContract, Contract } from "@/lib/mockData";

const AdminContractDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    agreed_amount: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const contractId = parseInt(id || "0");
    const foundContract = getContractById(contractId);
    
    if (foundContract) {
      setContract(foundContract);
      setFormData({
        status: foundContract.status,
        agreed_amount: foundContract.agreed_amount.toString(),
        start_date: foundContract.start_date || "",
        end_date: foundContract.end_date || "",
      });
    } else {
      toast({ title: "Error", description: "Contract not found", variant: "destructive" });
      navigate("/admin/contracts");
    }

    setLoading(false);
  }, [id, navigate, toast]);

  const handleSave = async () => {
    if (!contract) return;

    setSaving(true);
    try {
      const updatedContract = updateContract(contract.id, {
        status: formData.status,
        agreed_amount: parseFloat(formData.agreed_amount),
        start_date: formData.start_date,
        end_date: formData.end_date,
      });

      if (updatedContract) {
        setContract(updatedContract);
        setIsEditing(false);
        toast({ title: "Success", description: "Contract updated successfully" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update contract", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      "active": "default",
      "completed": "default",
      "terminated": "destructive",
      "disputed": "secondary",
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "active":
        return <Clock className="h-6 w-6 text-blue-600" />;
      case "disputed":
        return <AlertCircle className="h-6 w-6 text-orange-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#253E44]" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">Contract not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/contracts")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contract #{contract.id}</h1>
              <p className="text-sm text-gray-500">{contract.project_title}</p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#253E44] hover:bg-[#253E44]/90"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isEditing ? (
          <>
            {/* View Mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusIcon(contract.status)}
                      {getStatusBadge(contract.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Contract Value</p>
                    <div className="flex items-center space-x-1 text-2xl font-bold text-gray-900 mt-2">
                      <DollarSign className="h-6 w-6" />
                      <span>{contract.agreed_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Created Date</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-600">Project</label>
                    </div>
                    <p className="text-gray-900">{contract.project_title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Developer</label>
                    <p className="text-gray-900 mt-2">{contract.developer_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Date</label>
                    <p className="text-gray-900 mt-2">
                      {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">End Date</label>
                    <p className="text-gray-900 mt-2">
                      {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : "Not specified"}
                    </p>
                  </div>
                </div>

                {contract.end_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Duration</label>
                    <p className="text-gray-900 mt-2">
                      {Math.ceil(
                        (new Date(contract.end_date).getTime() - new Date(contract.start_date || contract.created_at).getTime()) / 
                        (1000 * 60 * 60 * 24)
                      )} days
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Agreed Amount</span>
                    <span className="font-semibold text-gray-900">${contract.agreed_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Status</span>
                    <span className="font-semibold">{getStatusBadge(contract.status)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Contract Created</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Contract</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Agreed Amount</label>
                  <input
                    type="number"
                    value={formData.agreed_amount}
                    onChange={(e) => setFormData({ ...formData, agreed_amount: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#253E44] hover:bg-[#253E44]/90"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminContractDetails;
