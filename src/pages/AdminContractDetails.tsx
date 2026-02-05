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
import {
  getContractById,
  getProjectById,
  getDeveloperById,
  updateContract,
  Contract,
} from "@/lib/mockData";
import { FaBusinessTime, FaDownload, FaMoneyBills, FaUserGear } from "react-icons/fa6";

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
      toast({
        title: "Error",
        description: "Contract not found",
        variant: "destructive",
      });
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
        toast({
          title: "Success",
          description: "Contract updated successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update contract",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: "default",
      completed: "default",
      terminated: "destructive",
      disputed: "secondary",
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
              <h1 className="md:text-2xl font-bold text-gray-900">
                Contract #{contract.id}
              </h1>
              <p className="text-sm text-gray-500">{contract.project_title}</p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#253E44] hover:bg-[#253E44]/90"
          >
            <Edit2 className="h-4 w-4 md:mr-2" />
            <p className=" hidden md:block">{isEditing ? "Cancel" : "Edit"}</p>
          </Button>
        </div>
      </div>

      <div className=" px-2 sm:px-3 lg:px-8 py-2 sm:py-3 lg:py-8">
        {!isEditing ? (
          <main className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 ">
                <p className="text-sm font-bold uppercase text-slate-500 mb-2">
                  Contract Status
                </p>
                <span className="text-3xl font-bold capitalize tracking-wider">
                  {contract.status.replace("_", " ")}
                </span>
              </Card>
              <Card className="p-6">
                <p className="text-sm font-bold uppercase text-slate-500 mb-2">
                  Contract Value
                </p>
                <p className="text-3xl font-bold text-slate-900">${contract.agreed_amount.toLocaleString()}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm font-bold uppercase text-slate-500 mb-2">
                  Signed Date
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {new Date(contract.start_date).toLocaleDateString()}
                </p>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                      Contract Information
                    </h2>
                  </div>
                  <div className="p-6 space-y-8">
                    <div className="flex md:items-center flex-col md:flex-row gap-4">
                      <div className="bg-slate-100 p-5 rounded-lg w-fit">
                        <span className="material-icons-outlined text-slate-600">
                          <FaBusinessTime/>
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Project Name
                        </p>
                        <p className="text-md font-medium text-slate-900">
                          {contract.project_title}
                        </p>
                        <p className="text-sm text-slate-500">
                          ID: PRJ-2024-00{contract.project_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex md:items-center flex-col md:flex-row gap-4">
                      <div className="bg-slate-100 p-5 rounded-lg w-fit">
                        <span className="material-icons-outlined text-slate-600">
                          <FaUserGear/>
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Primary Developer
                        </p>
                        <p className="text-md font-medium text-slate-900">
                          John Smith
                        </p>
                        <p className="text-sm text-slate-500">
                          Senior Structural Engineer
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Start Date
                        </p>
                        <p className="text-base font-medium text-slate-900">
                          {new Date(contract.start_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          End Date
                        </p>
                        <p className="text-base font-medium text-slate-900">
                          {new Date(contract.end_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center">
                    <h2 className="text-lg font-bold text-slate-900">
                      Financial Summary
                    </h2>
                    <span className="text-xs text-slate-400">
                      Last updated: Today, 09:42 AM
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-lg transition-colors">
                        <span className="text-slate-600 font-medium">
                          Agreed Amount
                        </span>
                        <span className="text-lg font-bold text-slate-900">
                          ${contract.agreed_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-lg transition-colors">
                        <span className="text-slate-600 font-medium">
                          Paid to Date
                        </span>
                        <span className="text-lg font-bold text-primary">
                          $10,000
                        </span>
                      </div>
                      <div className="border-t border-slate-100 my-2"></div>
                      <div className="flex items-center justify-between py-4 px-4 bg-slate-50 rounded-lg">
                        <span className="text-slate-900 font-bold">
                          Balance Remaining
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-black text-slate-900">
                            ${Number(contract.agreed_amount)-Number(10000)}
                          </span>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                            {100 - Number(((Number(10000) / Number(contract.agreed_amount)) * 100).toFixed(1))}% Outstanding
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 px-4">
                      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                        <span>Payment Progress</span>
                        <span>{((Number(10000)/Number(contract.agreed_amount))*100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div className="bg-primary h-3 rounded-full w-[66.7%]"></div>
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-3">
                      <button className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                        <span className="material-icons-outlined text-sm">
                          <FaMoneyBills/>
                        </span>
                        Record New Payment
                      </button>
                      <button className="w-full py-3 px-4 border border-slate-200text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        <span className="material-icons-outlined text-sm">
                          <FaDownload/>
                        </span>
                        Download Statement
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </main>
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
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreed_amount: e.target.value,
                      })
                    }
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
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
