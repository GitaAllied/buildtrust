import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Trash2,
  Flag,
  CheckSquare,
  Square,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminSidebar from "@/components/AdminSidebar";
import { openAdminSidebar } from "@/redux/action";
import { useSelector, useDispatch } from "react-redux";
import Logo from "@/assets/Logo.png";

const AdminMilestones = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: any) => state.sidebar.adminSidebar);

  // Determine if we're on a specific project page or the general milestones page
  const isProjectSpecific = !!id;

  // Format currency with proper locale and decimal places
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate mock milestones data based on current project or all projects
  const getMockMilestones = () => {
    if (isProjectSpecific) {
      const projectId = parseInt(id || "0");
      return [
        {
          id: 1,
          project_id: projectId,
          title: "Land Acquisition",
          description: "Purchase and legal documentation of land parcel",
          due_date: "2026-05-15",
          amount: 15000,
          status: "completed",
          created_at: "2026-04-01T10:00:00Z",
        },
        {
          id: 2,
          project_id: projectId,
          title: "Site Survey & Planning",
          description: "Complete topographic survey and architectural planning",
          due_date: "2026-06-30",
          amount: 8500,
          status: "completed",
          created_at: "2026-04-10T10:00:00Z",
        },
        {
          id: 3,
          project_id: projectId,
          title: "Foundation Work",
          description: "Excavation and concrete foundation construction",
          due_date: "2026-08-15",
          amount: 22000,
          status: "in_progress",
          created_at: "2026-05-01T10:00:00Z",
        },
        {
          id: 4,
          project_id: projectId,
          title: "Structural Construction",
          description: "Walls, floors, and roofing construction",
          due_date: "2026-10-30",
          amount: 45000,
          status: "pending",
          created_at: "2026-05-15T10:00:00Z",
        },
        {
          id: 5,
          project_id: projectId,
          title: "Electrical & Plumbing",
          description: "Complete electrical wiring and plumbing installation",
          due_date: "2026-11-30",
          amount: 18000,
          status: "pending",
          created_at: "2026-06-01T10:00:00Z",
        },
        {
          id: 6,
          project_id: projectId,
          title: "Interior Finishing",
          description: "Painting, flooring, and final interior work",
          due_date: "2026-12-20",
          amount: 12000,
          status: "pending",
          created_at: "2026-06-15T10:00:00Z",
        },
        {
          id: 7,
          project_id: projectId,
          title: "Final Inspection & Handover",
          description: "Government inspection and project handover to client",
          due_date: "2026-12-31",
          amount: 5000,
          status: "pending",
          created_at: "2026-07-01T10:00:00Z",
        },
      ];
    } else {
      // Mock data for all projects when accessed from main milestones page
      return [
        {
          id: 1,
          project_id: 1,
          project_title: "Residential Complex Phase 1",
          title: "Land Acquisition",
          description: "Purchase and legal documentation of land parcel",
          due_date: "2026-05-15",
          amount: 15000,
          status: "completed",
          created_at: "2026-04-01T10:00:00Z",
        },
        {
          id: 2,
          project_id: 1,
          project_title: "Residential Complex Phase 1",
          title: "Foundation Work",
          description: "Excavation and concrete foundation construction",
          due_date: "2026-08-15",
          amount: 22000,
          status: "in_progress",
          created_at: "2026-05-01T10:00:00Z",
        },
        {
          id: 3,
          project_id: 2,
          project_title: "Commercial Building",
          title: "Site Survey & Planning",
          description: "Complete topographic survey and architectural planning",
          due_date: "2026-06-30",
          amount: 8500,
          status: "completed",
          created_at: "2026-04-10T10:00:00Z",
        },
        {
          id: 4,
          project_id: 2,
          project_title: "Commercial Building",
          title: "Structural Construction",
          description: "Walls, floors, and roofing construction",
          due_date: "2026-10-30",
          amount: 45000,
          status: "in_progress",
          created_at: "2026-05-15T10:00:00Z",
        },
        {
          id: 5,
          project_id: 3,
          project_title: "Luxury Villa Estate",
          title: "Land Acquisition",
          description: "Purchase and legal documentation of land parcel",
          due_date: "2026-07-10",
          amount: 25000,
          status: "at_risk",
          created_at: "2026-03-20T10:00:00Z",
        },
        {
          id: 6,
          project_id: 3,
          project_title: "Luxury Villa Estate",
          title: "Electrical & Plumbing",
          description: "Complete electrical wiring and plumbing installation",
          due_date: "2026-11-30",
          amount: 18000,
          status: "pending",
          created_at: "2026-04-01T10:00:00Z",
        },
        {
          id: 7,
          project_id: 4,
          project_title: "Industrial Warehouse",
          title: "Foundation Work",
          description: "Excavation and concrete foundation construction",
          due_date: "2026-09-20",
          amount: 35000,
          status: "in_progress",
          created_at: "2026-05-10T10:00:00Z",
        },
        {
          id: 8,
          project_id: 5,
          project_title: "Shopping Mall",
          title: "Site Survey & Planning",
          description: "Complete topographic survey and architectural planning",
          due_date: "2026-08-05",
          amount: 12000,
          status: "completed",
          created_at: "2026-04-15T10:00:00Z",
        },
      ];
    }
  };

  const [milestones, setMilestones] = useState<any[]>(getMockMilestones());
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    description: "",
    due_date: "",
    amount: "",
    status: "pending",
  });

  useEffect(() => {
    if (isProjectSpecific) {
      const loadProject = async () => {
        try {
          const projectId = parseInt(id || "0");
          const response = await apiClient.getProjectById(projectId);

          const foundProject = response?.project || response;
          if (foundProject) {
            setProject(foundProject);
          } else {
            // Use mock project data for demonstration
            setProject({
              id: projectId,
              title: `Project ${projectId}`,
              description: "Mock project for milestone demonstration",
              status: "active",
              created_at: new Date().toISOString(),
            });
          }
        } catch (err: any) {
          console.error("Error loading project:", err);
          // Use mock project data for demonstration
          setProject({
            id: parseInt(id || "0"),
            title: `Project ${id}`,
            description: "Mock project for milestone demonstration",
            status: "active",
            created_at: new Date().toISOString(),
          });
        } finally {
          setLoading(false);
        }
      };

      loadProject();
    } else {
      setLoading(false);
    }
  }, [id, toast, isProjectSpecific]);

  const handleDeleteMilestone = (milestoneId: number) => {
    setMilestones(milestones.filter((m) => m.id !== milestoneId));
    toast({
      title: "Success",
      description: "Construction milestone deleted successfully",
    });
  };

  const handleToggleMilestoneStatus = (milestoneId: number) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: m.status === "pending" ? "completed" : "pending",
            }
          : m
      )
    );
  };

  const handleOpenMilestoneModal = (milestone?: any) => {
    if (milestone) {
      setEditingMilestone(milestone);
      setMilestoneForm({
        title: milestone.title || "",
        description: milestone.description || "",
        due_date: milestone.due_date || "",
        amount: milestone.amount?.toString() || "",
        status: milestone.status || "pending",
      });
    } else {
      setEditingMilestone(null);
      setMilestoneForm({ title: "", description: "", due_date: "", amount: "", status: "pending" });
    }
    setShowMilestoneModal(true);
  };

  const handleCloseMilestoneModal = () => {
    setShowMilestoneModal(false);
    setEditingMilestone(null);
    setMilestoneForm({ title: "", description: "", due_date: "", amount: "", status: "pending" });
  };

  const handleSaveMilestone = () => {
    const errors: string[] = [];
    if (!milestoneForm.title.trim()) errors.push("Title is required.");
    if (!milestoneForm.amount || Number(milestoneForm.amount) <= 0) errors.push("Amount must be greater than 0.");
    if (!milestoneForm.due_date) errors.push("Due date is required.");

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(" "),
        variant: "destructive",
      });
      return;
    }

    const payload = {
      id: editingMilestone ? editingMilestone.id : Date.now(),
      project_id: project?.id || 0,
      title: milestoneForm.title.trim(),
      description: milestoneForm.description.trim(),
      due_date: milestoneForm.due_date,
      amount: Number(milestoneForm.amount),
      status: milestoneForm.status,
      created_at: editingMilestone ? editingMilestone.created_at : new Date().toISOString(),
    };

    if (editingMilestone) {
      setMilestones((prev) => prev.map((m) => (m.id === editingMilestone.id ? payload : m)));
      toast({ title: "Success", description: "Construction milestone updated successfully." });
    } else {
      setMilestones((prev) => [payload, ...prev]);
      toast({ title: "Success", description: "Construction milestone added successfully." });
    }

    handleCloseMilestoneModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#253E44]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openAdminSidebar(!isOpen))}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-[#226F75]" />
          ) : (
            <Menu className="h-5 w-5 text-[#226F75]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <AdminSidebar active={"milestones"} />
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center md:space-x-4">
            <Button
              variant="ghost"
              onClick={() => isProjectSpecific ? navigate(`/admin/projects/${id}`) : navigate("/admin/projects")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="md:text-2xl font-bold text-gray-900">
                {isProjectSpecific ? `Milestones: ${project?.title || "Project"}` : "All Project Milestones"}
              </h1>
              <p className="text-sm text-gray-500">
                {isProjectSpecific ? "Track construction progress and payments" : "Overview of all construction project milestones"}
              </p>
            </div>
          </div>
          {!isProjectSpecific && (
            <Button
              size="sm"
              className="bg-[#226F75] hover:bg-[#226F75]/90"
              onClick={() => handleOpenMilestoneModal()}
            >
              Add Construction Milestone
            </Button>
          )}
        </div>
      </div>

      <div className="px-2 sm:px-3 lg:px-8 py-2 sm:py-3 lg:py-8">
        <div className="px-6 py-8">
          {/* Milestones List */}
          <Card className="overflow-hidden">
            <div className="p-8">
              {milestones.length === 0 ? (
                <div className="text-center py-12">
                  <Flag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No construction milestones yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleToggleMilestoneStatus(milestone.id)}
                            className="mt-1 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {milestone.status === "completed" ? (
                              <CheckSquare className="h-5 w-5 text-green-600" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-semibold text-sm ${
                                milestone.status === "completed"
                                  ? "text-slate-400 line-through"
                                  : "text-slate-900"
                              }`}>
                                {milestone.title}
                              </h4>
                              <Badge variant={
                                milestone.status === "completed" ? "default" :
                                milestone.status === "in_progress" ? "secondary" :
                                milestone.status === "at_risk" ? "destructive" :
                                "outline"
                              }>
                                {milestone.status.replace("_", " ")}
                              </Badge>
                            </div>
                            {!isProjectSpecific && milestone.project_title && (
                              <p className="text-xs text-slate-600 mt-1">
                                Project: {milestone.project_title}
                              </p>
                            )}
                            {milestone.description && (
                              <p className="text-xs text-slate-500 mt-1">{milestone.description}</p>
                            )}
                            {milestone.amount !== undefined && (
                              <p className="text-xs text-slate-500 mt-1">
                                Amount: {formatCurrency(milestone.amount)}
                              </p>
                            )}
                            {milestone.due_date && (
                              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(milestone.due_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenMilestoneModal(milestone)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {editingMilestone ? "Edit Construction Milestone" : "Add Construction Milestone"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="milestoneTitle">Title</Label>
                  <Input
                    id="milestoneTitle"
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="milestoneAmount">Amount</Label>
                  <Input
                    id="milestoneAmount"
                    type="number"
                    min={0}
                    step="0.01"
                    value={milestoneForm.amount}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, amount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="milestoneDescription">Description</Label>
                <Textarea
                  id="milestoneDescription"
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="milestoneDueDate">Due Date</Label>
                  <Input
                    id="milestoneDueDate"
                    type="date"
                    value={milestoneForm.due_date}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="milestoneStatus">Status</Label>
                  <Select value={milestoneForm.status} onValueChange={(value) => setMilestoneForm({ ...milestoneForm, status: value })}>
                    <SelectTrigger id="milestoneStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="at_risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCloseMilestoneModal}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#226F75] hover:bg-[#226F75]/90"
                  onClick={handleSaveMilestone}
                >
                  Save Construction Milestone
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>

    {/* Sidebar */}
    <AdminSidebar active={"milestones"} />
  </div>
);
};

export default AdminMilestones;
