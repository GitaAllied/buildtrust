import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import {
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FileText,
  Edit2,
  Save,
} from "lucide-react";
import { FaMoneyBill } from "react-icons/fa6";


interface Contract {
  id: number;
  project_id: number;
  status: string;
  contract_terms?: string;
  needs_resign?: boolean;
  created_at: string;
  project_title?: string;
  developer_name?: string;
  assigned_at?: string | null;
  acceptance_status?: string;
  budget?: number;
}

const AdminContracts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isContractTemplateModalOpen, setIsContractTemplateModalOpen] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [contractTemplateContent, setContractTemplateContent] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function: Check if developer is assigned (not expired and has assigned_at)
  const isDeveloperAssigned = (contract: Contract): boolean => {
    // Developer is considered unassigned if:
    // 1. acceptance_status is 'expired' (72-hour timer expired without response)
    // 2. assigned_at is null (no developer was ever assigned)
    return contract.acceptance_status !== 'expired' && !!contract.assigned_at;
  };

  // Helper function: Auto-check if assigned_at dates are due and update status in DB
  const checkAndUpdateExpiredAcceptances = async () => {
    try {
      console.log('🔍 Checking for expired project acceptances...');
      const response = await apiClient.checkExpiredProjectAcceptances();
      
      if (response.expiredCount > 0) {
        console.log(`⏰ ${response.expiredCount} project acceptance(s) expired and updated`);
        toast({
          title: "Acceptances Updated",
          description: `${response.expiredCount} project acceptance(s) expired and marked as expired.`,
          variant: "default"
        });
        // Refresh the contracts list to show updated status
        await loadContracts();
      } else {
        console.log('✓ No expired acceptances found');
      }
      return response;
    } catch (error) {
      console.error('Error checking expired acceptances:', error);
      toast({
        title: "Error",
        description: "Failed to check for expired acceptances",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadContracts();
    loadContractTemplate();
  }, []);

  const loadContractTemplate = async () => {
    try {
      const response = await apiClient.getContractTemplate();
      if (response?.template?.contract_terms) {
        setContractTemplateContent(response.template.contract_terms);
      }
    } catch (err) {
      console.error("Error loading contract template:", err);
      // Use default template if fetch fails
    }
  };

  const loadContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all contracts with project details joined from backend
      const response = await apiClient.getAllContracts();
      const contractsData = response?.contracts || [];
      
      // Map to Contract interface
      const contractsWithDetails = contractsData.map((contract: any) => ({
        id: contract.id,
        project_id: contract.project_id,
        status: contract.status || 'active',
        contract_terms: contract.contract_terms || '',
        needs_resign: contract.needs_resign || false,
        created_at: contract.created_at,
        project_title: contract.project_title || 'Untitled Project',
        developer_name: contract.developer_name || 'Unassigned',
        assigned_at: contract.assigned_at,
        acceptance_status: contract.acceptance_status,
        budget: contract.budget || 0,
      }));
      
      setContracts(contractsWithDetails);
    } catch (err) {
      console.error("Error loading contracts:", err);
      setError("Failed to load contracts");
      toast({ title: "Error", description: "Failed to load contracts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setEditFormData({
      status: contract.status || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveContract = async () => {
    if (!selectedContract) {
      toast({ title: "Error", description: "No contract selected", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const updateData: Record<string, any> = {};
      
      if (editFormData.status) updateData.status = editFormData.status;

      await apiClient.updateProjectContract(selectedContract.project_id, updateData);
      
      toast({ title: "Success", description: "Contract updated successfully" });
      setIsEditDialogOpen(false);
      loadContracts();
    } catch (err) {
      console.error("Error updating contract:", err);
      toast({ title: "Error", description: "Failed to update contract", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };


  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = 
      contract.project_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.developer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || contract.status === filterStatus;
    const isDeveloper = isDeveloperAssigned(contract);
    return matchesSearch && matchesStatus && isDeveloper;
  });

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
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "active":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "disputed":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedContract || !newStatus) {
      toast({ title: "Error", description: "Please select a status", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      await apiClient.updateProjectContract(selectedContract.project_id, { status: newStatus });
      toast({ title: "Success", description: "Contract status updated" });
      setIsStatusDialogOpen(false);
      setNewStatus("");
      loadContracts();
    } catch (err) {
      toast({ title: "Error", description: "Failed to update contract", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContract = async (contractId: number) => {
    if (!confirm("Are you sure you want to delete this contract?")) return;

    try {
      setSaving(true);
      // Find the contract to get projectId
      const contract = contracts.find(c => c.id === contractId);
      if (!contract) {
        toast({ title: "Error", description: "Contract not found", variant: "destructive" });
        return;
      }

      await apiClient.deleteProjectContract(contract.project_id);
      toast({ title: "Success", description: "Contract deleted successfully" });
      loadContracts();
    } catch (err) {
      console.error('Error deleting contract:', err);
      toast({ title: "Error", description: "Failed to delete contract", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#253E44] mx-auto" />
          <p className="mt-4 text-gray-600">Loading contracts...</p>
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
              onClick={() => navigate("/admin/users")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contracts Management</h1>
              <p className="text-sm text-gray-500">Manage all project contracts</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Button className="bg-[#253E44] hover:bg-[#253E44]/90" onClick={() => setIsContractTemplateModalOpen(true)}>
              Contract Template
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search projects or developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Contracts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Contracts ({filteredContracts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Project</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Developer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No contracts found
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((contract) => (
                      <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <p className="font-medium text-gray-900">{contract.project_title}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {isDeveloperAssigned(contract) ? (
                              <p className="text-sm text-gray-900">{contract.developer_name}</p>
                            ) : (
                              <p className="text-sm text-gray-600">Unassigned</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1 text-gray-900 font-medium">
                            <FaMoneyBill className="h-4 w-4" />
                            <span>${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(contract.budget || 0))}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(contract.status)}
                            {getStatusBadge(contract.status)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">
                            {new Date(contract.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/admin/contracts/${contract.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedContract(contract);
                                  setNewStatus(contract.status);
                                  setIsStatusDialogOpen(true);
                                }}>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteContract(contract.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Update Status Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Contract Status</DialogTitle>
              <DialogDescription>
                Update status for contract on "{selectedContract?.project_title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStatus}
                disabled={saving}
                className="bg-[#253E44] hover:bg-[#253E44]/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Contract Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Contract Status</DialogTitle>
              <DialogDescription>
                Update status for contract on "{selectedContract?.project_title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={editFormData.status} onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveContract}
                disabled={saving}
                className="bg-[#253E44] hover:bg-[#253E44]/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Contract Template Modal */}
        <Dialog open={isContractTemplateModalOpen} onOpenChange={setIsContractTemplateModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>Standard Contract Template</DialogTitle>
                  <DialogDescription>
                    Official BuildTrust Service Agreement and Legal Contract
                  </DialogDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingTemplate(!isEditingTemplate)}
                  className="ml-4"
                >
                  {isEditingTemplate ? "Cancel" : "Edit"}
                </Button>
              </div>
            </DialogHeader>
            {isEditingTemplate ? (
              <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
                  {/* Rich Text Toolbar */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300 p-3 flex flex-wrap gap-2 items-center">
                    {/* Text Formatting */}
                    <div className="flex gap-1 items-center">
                      <button
                        className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-[#253E44] hover:text-white font-bold text-sm transition"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-[#253E44] hover:text-white italic text-sm transition"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-[#253E44] hover:text-white underline text-sm transition"
                        title="Underline"
                      >
                        U
                      </button>
                    </div>
                    <div className="border-l border-gray-300 h-6"></div>
                    
                    {/* Font Size */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600 font-semibold">Size:</span>
                      <select className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium hover:border-[#253E44] transition">
                        <option value="small">Small</option>
                        <option value="medium" selected>Normal</option>
                        <option value="large">Large</option>
                        <option value="xl">XL</option>
                      </select>
                    </div>
                    <div className="border-l border-gray-300 h-6"></div>
                    
                    {/* Text Color */}
                    <div className="flex items-center gap-1">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <span className="text-xs text-gray-600 font-semibold">Text:</span>
                        <input
                          type="color"
                          defaultValue="#000000"
                          className="w-7 h-7 border border-gray-300 rounded cursor-pointer"
                          title="Text Color"
                        />
                      </label>
                    </div>
                    
                    {/* Background Color */}
                    <div className="flex items-center gap-1">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <span className="text-xs text-gray-600 font-semibold">BG:</span>
                        <input
                          type="color"
                          defaultValue="#ffffff"
                          className="w-7 h-7 border border-gray-300 rounded cursor-pointer"
                          title="Background Color"
                        />
                      </label>
                    </div>
                    <div className="border-l border-gray-300 h-6"></div>
                    
                    {/* List Options */}
                    <div className="flex gap-1 items-center">
                      <button
                        className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-[#253E44] hover:text-white text-sm transition"
                        title="Bullet Point"
                      >
                        •
                      </button>
                      <button
                        className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-[#253E44] hover:text-white text-sm transition"
                        title="Numbered List"
                      >
                        1.
                      </button>
                    </div>
                    <div className="border-l border-gray-300 h-6"></div>
                    
                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setContractTemplateContent(
                          `BUILDTRUST SERVICE AGREEMENT & LEGAL CONTRACT\n\n1. PARTIES & SCOPE\nThis binding contract is entered into between: (a) Client as Project Owner, (b) Developer as Service Provider, and (c) BuildTrust Africa as Platform Facilitator.\n\n2. PROJECT SCOPE & DELIVERABLES\nDeveloper is responsible for quality workmanship, adherence to specifications, timely completion, regular progress updates, and site safety compliance.\n\n3. AGREED CONTRACT VALUE & PAYMENT TERMS\nPayments are released in milestones upon verified completion of project phases. Client shall make payments within 7 days of invoice.\n\n4. PERFORMANCE & LIABILITY\nDeveloper warrants professional execution of all work. BuildTrust provides platform mediation but does not assume contractor liability.\n\n5. BREACH & REMEDIES\nFailure to meet standards results in contract termination, funds adjustment, and potential legal action.\n\n6. DISPUTE RESOLUTION\nAll disputes are referred to BuildTrust's mediation team (14-day resolution window).\n\n7. TERMINATION & CANCELLATION\nClient may cancel with 14-day notice and 20% fee forfeiture if no work commenced.\n\n8. CONFIDENTIALITY & IP RIGHTS\nBoth parties maintain confidentiality. Client retains all intellectual property rights.\n\n9. INSURANCE & COMPLIANCE\nDeveloper must maintain liability insurance and comply with all regulations.\n\n10. LEGAL JURISDICTION\nThis contract is governed by applicable laws of the project location.\n\n11. PLATFORM PROTECTIONS\nBuildTrust holds funds in escrow, releasing only upon verified completion.`
                        );
                      }}
                      className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-orange-50 hover:border-orange-300 text-sm transition text-orange-600 font-semibold"
                      title="Reset to Default Template"
                    >
                      ↻ Reset
                    </button>
                  </div>
                  
                  {/* Editor Area */}
                  <textarea
                    value={contractTemplateContent}
                    onChange={(e) => setContractTemplateContent(e.target.value)}
                    rows={18}
                    className="w-full px-4 py-4 border-0 focus:outline-none focus:ring-0 font-serif text-sm leading-relaxed resize-none bg-white"
                    style={{ fontFamily: '"Georgia", serif', lineHeight: '1.8' }}
                    placeholder="Enter contract template content..."
                  />
                </div>
                
                {/* Statistics */}
                <div className="flex justify-between items-center text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  <div className="space-x-4">
                    <span>📄 Words: {contractTemplateContent.split(/\s+/).filter(w => w.length > 0).length}</span>
                    <span>🔤 Characters: {contractTemplateContent.length}</span>
                  </div>
                  <span className="text-gray-400">Last edited: just now</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingTemplate(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        // Save template to database
                        await apiClient.updateContractTemplate({
                          contract_terms: contractTemplateContent
                        });
                        
                        toast({
                          title: "Success",
                          description: "Contract template saved. New projects will use this template.",
                        });
                        setIsEditingTemplate(false);
                      } catch (err) {
                        console.error("Error saving template:", err);
                        toast({
                          title: "Error",
                          description: "Failed to save contract template",
                          variant: "destructive"
                        });
                      } finally {
                        setSaving(false);
                      }
                    }}
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
                        Save Template
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-gray-700">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-700">
                      <strong>ℹ️ Master Template</strong> - Changes to this template apply to all future projects. Existing contracts are not affected.
                    </p>
                  </div>
                  
                  <h5 className="font-bold text-center text-sm text-[#253E44] mb-4">
                    {contractTemplateContent.split('\n')[0] || 'BUILDTRUST SERVICE AGREEMENT & LEGAL CONTRACT'}
                  </h5>

                  <div className="space-y-3 text-sm text-gray-700 whitespace-pre-wrap font-serif leading-relaxed">
                    {contractTemplateContent}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button 
                onClick={() => setIsContractTemplateModalOpen(false)}
                className="bg-[#253E44] hover:bg-[#253E44]/90"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminContracts;
