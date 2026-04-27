import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import {
  ArrowLeft,
  Edit2,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ContractData {
  id: number;
  project_id: number;
  developer_id?: number;
  agreed_amount: number;
  status: string;
  contract_terms?: string;
  needs_resign?: boolean;
  developer_signature_url?: string;
  client_signature_url?: string;
  developer_signed_at?: string;
  client_signed_at?: string;
  created_at: string;
  updated_at: string;
}

interface ProjectData {
  id: number;
  title: string;
  location?: string;
  building_type?: string;
  budget_min?: number;
  budget_max?: number;
  budget?: number;
  duration?: string;
  client_id?: number;
  developer_id?: number;
  developer_name?: string;
  client_name?: string;
  assigned_at?: string | null;
  developer?: { name: string };
  client?: { name: string };
}

const AdminContractDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [contract, setContract] = useState<ContractData | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contractTemplate, setContractTemplate] = useState("");
  const [formData, setFormData] = useState({
    status: "",
    contract_terms: "",
  });

  useEffect(() => {
    loadContractTemplate();
    loadContractData();
  }, [id]);

  const loadContractTemplate = async () => {
    try {
      const response = await apiClient.getContractTemplate();
      const template = response?.template?.contract_terms || "";
      setContractTemplate(template);
    } catch (err) {
      console.error("Error loading contract template:", err);
    }
  };

  const loadContractData = async () => {
    try {
      setLoading(true);
      const contractId = parseInt(id || "0");
      
      // Fetch contract by contract ID with full project data via JOIN
      const response = await apiClient.getContractById(contractId);
      const contractData = response?.contract;

      if (!contractData) {
        toast({
          title: "Error",
          description: "Contract not found",
          variant: "destructive",
        });
        navigate("/admin/contracts");
        return;
      }

      setContract(contractData);
      
      // Project data is already joined in the response
      const projectData = {
        id: contractData.project_id,
        title: contractData.project_title,
        location: contractData.location,
        building_type: contractData.building_type,
        duration: contractData.duration,
        budget_min: contractData.budget_min,
        budget_max: contractData.budget_max,
        budget: contractData.budget,
        developer_id: contractData.developer_id,
        developer_name: contractData.developer_name,
        assigned_at: contractData.assigned_at,
        client_id: contractData.client_id,
        client_name: contractData.client_name,
        developer: contractData.developer_name ? { name: contractData.developer_name } : undefined,
        client: contractData.client_name ? { name: contractData.client_name } : undefined,
      };
      
      setProject(projectData as ProjectData);
      setFormData({
        status: contractData.status || "",
        contract_terms: contractData.contract_terms || contractTemplate,
      });
    } catch (err) {
      console.error("Error loading contract:", err);
      toast({
        title: "Error",
        description: "Failed to load contract details",
        variant: "destructive",
      });
      navigate("/admin/contracts");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!project || !contract) return;

    setSaving(true);
    try {
      const updateData: Record<string, any> = {};

      if (formData.status) updateData.status = formData.status;
      if (formData.contract_terms) updateData.contract_terms = formData.contract_terms;

      // Update contract by project ID (backend finds the contract)
      await apiClient.updateProjectContract(project.id, updateData);

      toast({
        title: "Success",
        description: formData.contract_terms !== (contract.contract_terms || contractTemplate)
          ? "Contract updated. Parties must review and re-sign."
          : "Contract updated successfully",
      });
      setIsEditing(false);
      loadContractData();
    } catch (err) {
      console.error("Error updating contract:", err);
      toast({
        title: "Error",
        description: "Failed to update contract",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#253E44]" />
      </div>
    );
  }

  if (!contract || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">Contract not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const budgetDisplay = `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(project.budget_min || 0))} - $${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(project.budget_max || 0))}`;

  const bothSigned = contract.developer_signature_url && contract.client_signature_url;
  const needsResign = contract.needs_resign;

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
              <p className="text-sm text-gray-500">{project.title}</p>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#253E44] hover:bg-[#253E44]/90"
            >
              <Edit2 className="h-4 w-4 md:mr-2" />
              <p className="hidden md:block">Edit Contract</p>
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Status Alert */}
        {needsResign && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">Contract Requires Re-signing</p>
                <p className="text-sm text-yellow-800">The contract terms have been updated by admin. Both parties need to review and re-sign the updated contract.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isEditing ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Status</p>
                <div className="flex items-center gap-2">
                  {contract.status === 'active' && <Clock className="h-5 w-5 text-blue-600" />}
                  {contract.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  <span className="text-lg font-bold capitalize">{contract.status}</span>
                </div>
              </Card>

              <Card className="p-4">
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Contract Amount</p>
                <p className="text-lg font-bold">${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(project.budget || 0))}</p>
              </Card>

              <Card className="p-4">
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Budget Range</p>
                <p className="text-base font-bold">{budgetDisplay}</p>
              </Card>

              <Card className="p-4">
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Signatures</p>
                <p className="text-lg font-bold">
                  {bothSigned ? "✓ Both Signed" : "⏳ Pending"}
                </p>
              </Card>
            </div>

            {/* Project & Developer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Project Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Project Title</p>
                    <p className="font-semibold">{project.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-semibold">{project.location || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Building Type</p>
                    <p className="font-semibold">{project.building_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-semibold">{project.duration ? `${project.duration} months` : "N/A"}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Assigned Developer</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Developer Name</p>
                    <p className="font-semibold">{project.developer?.name || "Unassigned"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Assigned Date</p>
                    <p className="font-semibold">
                      {project.assigned_at 
                        ? new Date(project.assigned_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Client Name</p>
                    <p className="font-semibold">{project.client?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Signature Status</p>
                    <p className="font-semibold">
                      {contract.developer_signed_at ? "✓ Developer Signed" : "⏳ Awaiting"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contract Terms Display */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Contract Terms</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {contract.contract_terms || contractTemplate}
                </p>
              </div>
            </Card>
          </div>
        ) : (
          // Edit Mode
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4">Edit Contract</h3>
              <div className="space-y-4">
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

                  <label className="text-sm font-medium">Contract Terms</label>
                  <textarea
                    value={formData.contract_terms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contract_terms: e.target.value,
                      })
                    }
                    rows={12}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end gap-4">
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
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminContractDetails;
