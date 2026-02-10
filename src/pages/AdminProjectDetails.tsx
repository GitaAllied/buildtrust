import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  DollarSign,
  Calendar,
  User,
  Edit2,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";
import {
  getProjectById,
  getAllDevelopers,
  updateProject,
  Project,
  Developer,
} from "@/lib/mockData";
import { FaCloudArrowDown, FaRetweet, FaShare } from "react-icons/fa6";

const AdminProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    budget: "",
    developer_id: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const projectId = parseInt(id || "0");
    const foundProject = getProjectById(projectId);

    if (foundProject) {
      setProject(foundProject);
      setFormData({
        title: foundProject.title,
        description: foundProject.description,
        status: foundProject.status,
        budget: foundProject.budget.toString(),
        developer_id: foundProject.developer_id?.toString() || "",
      });
    } else {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive",
      });
      navigate("/admin/projects");
    }

    setDevelopers(getAllDevelopers());
    setLoading(false);
  }, [id, navigate, toast]);

  const handleSave = async () => {
    if (!project) return;

    // Validation
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!formData.status) {
      errors.status = "Status is required";
    }
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      errors.budget = "Budget must be greater than 0";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      });
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      const updatedProject = updateProject(project.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status as any,
        budget: parseFloat(formData.budget),
        developer_id: formData.developer_id && formData.developer_id !== "0"
          ? parseInt(formData.developer_id)
          : undefined,
      });

      if (updatedProject) {
        setProject(updatedProject);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        throw new Error("Failed to update project");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: "secondary",
      in_progress: "default",
      completed: "default",
      cancelled: "destructive",
    };

    const statusLabels: Record<string, string> = {
      open: "Open",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "in_progress":
        return <Clock className="h-6 w-6 text-blue-600" />;
      case "open":
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">Project not found</p>
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
          <div className="flex items-center md:space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/projects")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="md:text-2xl font-bold text-gray-900">
                {project.title}
              </h1>
              <p className="text-sm text-gray-500">Project Details</p>
            </div>
          </div>
          <Button
            onClick={() => {
              if (!isEditing && project) {
                // Entering edit mode - sync form data from current project
                setFormData({
                  title: project.title,
                  description: project.description,
                  status: project.status,
                  budget: project.budget.toString(),
                  developer_id: project.developer_id?.toString() || "",
                });
                setFormErrors({});
              }
              setIsEditing(!isEditing);
            }}
            className="bg-[#253E44] hover:bg-[#253E44]/90"
          >
            <Edit2 className="h-4 w-4 md:mr-2" />
            <p className=" hidden md:block">{isEditing ? "Cancel" : "Edit"}</p>
          </Button>
        </div>
      </div>

      <div className=" px-2 sm:px-3 lg:px-8 py-2 sm:py-3 lg:py-8">
        {!isEditing ? (
          <div className=" px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className=" p-6 flex flex-col">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">
                  Status
                </span>
                <span className="font-bold text-3xl capitalize text-slate-900">
                  {project.status.replace("_", " ")}
                </span>
              </Card>
              <Card className=" p-6">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1 block">
                  Budget
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">
                    ${project.budget.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-sm">USD</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-primary"></div>
                  </div>
                  <span className="text-xs text-slate-400">65% used</span>
                </div>
              </Card>
              <Card className=" p-6 ">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2 block">
                  Timeline Progress
                </span>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-slate-900">
                    Day 142{" "}
                    <span className="text-sm font-normal text-slate-400">
                      / 200
                    </span>
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[71%] h-full bg-primary"></div>
                </div>
                <span className="text-xs text-slate-400">71%</span>
                </div>
              </Card>
            </div>
            <Card className="overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">
                  Project Information
                </h3>
              </div>
              <div className="p-8">
                <div className="mb-10">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Description
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {/* Complete architectural design and structural construction of
                    a 5-bedroom modern luxury duplex in the heart of Lekki. This
                    project emphasizes sustainable building materials and
                    energy-efficient systems throughout the residence. */}
                    {project.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Client
                      </h4>
                      <div className="flex items-center gap-3">
                        
                        <p className="text-slate-900 font-medium">
                          {project.client_name}
                        </p>
                      </div>
                    </div>
                    <hr className="border-slate-100" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Assigned Developer
                      </h4>
                      <div className="flex items-center gap-3">
                        <img
                          alt="Developer Avatar"
                          className="w-8 h-8 rounded-full"
                          src="https://placehold.net/avatar-4.svg"
                        />
                        <div>
                          <p className="text-slate-900 font-medium">
                            {project.developer_name || "Unassigned"}
                          </p>
                          <p className="text-xs text-slate-400">
                            Senior Civil Engineer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Start Date
                        </h4>
                        <p className="text-slate-900 font-medium">
                          {new Date(project.created_at).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Estimated End
                        </h4>
                        <p className="text-slate-900 font-medium">
                          03 June, 2026
                        </p>
                      </div>
                    </div>
                    <hr className="border-slate-100" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Location
                      </h4>
                      <div className="flex items-center gap-2">
                        
                        <p className="text-slate-900 font-medium">
                          Lekki Phase 1, Lagos, Nigeria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center flex-col md:flex-row gap-5 md:gap-0">
                <div className="flex gap-10 md:gap-4">
                  <div className="text-xs text-slate-400">
                    <span className="block">LAST UPDATED</span>
                    <span className="text-slate-600 font-medium">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="block">CREATED BY</span>
                    <span className="text-slate-600 font-medium">
                      Admin (Sarah J.)
                    </span>
                  </div>
                </div>
                <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                  View Full History{" "}
                </button>
              </div>
            </Card>
            <div className="mt-8 flex gap-4 flex-col md:flex-row">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-DEFAULT text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors justify-center">
                <FaCloudArrowDown/>
                Export Project PDF
              </button>
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-DEFAULT text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors justify-center">
                <FaShare/>
                Share Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-8">
            {/* Edit Mode */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-900">Project Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter project title"
                    className={`mt-2 ${formErrors.title ? "border-red-500" : ""}`}
                    disabled={saving}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter project description"
                    className={`mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226F75] ${
                      formErrors.description ? "border-red-500" : ""
                    }`}
                    rows={4}
                    disabled={saving}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                      disabled={saving}
                    >
                      <SelectTrigger className={`mt-2 ${formErrors.status ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.status && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900">Budget (USD)</label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`mt-2 ${formErrors.budget ? "border-red-500" : ""}`}
                      disabled={saving}
                    />
                    {formErrors.budget && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.budget}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Assign Developer
                  </label>
                  <Select
                    value={formData.developer_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, developer_id: value })
                    }
                    disabled={saving}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select developer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Unassigned</SelectItem>
                      {developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id.toString()}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormErrors({});
                    }}
                    disabled={saving}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectDetails;
