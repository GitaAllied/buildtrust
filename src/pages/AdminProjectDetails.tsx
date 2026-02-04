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
import { getProjectById, getAllDevelopers, updateProject, Project, Developer } from "@/lib/mockData";

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
      toast({ title: "Error", description: "Project not found", variant: "destructive" });
      navigate("/admin/projects");
    }

    setDevelopers(getAllDevelopers());
    setLoading(false);
  }, [id, navigate, toast]);

  const handleSave = async () => {
    if (!project) return;

    setSaving(true);
    try {
      const updatedProject = updateProject(project.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        budget: parseFloat(formData.budget),
        developer_id: formData.developer_id ? parseInt(formData.developer_id) : undefined,
      });

      if (updatedProject) {
        setProject(updatedProject);
        setIsEditing(false);
        toast({ title: "Success", description: "Project updated successfully" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update project", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      "open": "secondary",
      "in_progress": "default",
      "completed": "default",
      "cancelled": "destructive",
    };
    
    const statusLabels: Record<string, string> = {
      "open": "Open",
      "in_progress": "In Progress",
      "completed": "Completed",
      "cancelled": "Cancelled",
    };

    return <Badge variant={variants[status] || "outline"}>{statusLabels[status] || status}</Badge>;
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/projects")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-sm text-gray-500">Project Details</p>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusIcon(project.status)}
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <div className="flex items-center space-x-1 text-2xl font-bold text-gray-900 mt-2">
                      <DollarSign className="h-6 w-6" />
                      <span>{project.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900 mt-2">{project.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Client</label>
                    <p className="text-gray-900 mt-2">{project.client_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Assigned Developer</label>
                    <Badge className="mt-2">
                      {project.developer_name || "Unassigned"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Date</label>
                    <p className="text-gray-900 mt-2">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-gray-900 mt-2">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </p>
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
                <CardTitle>Edit Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Project Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Budget</label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Assign Developer</label>
                  <Select value={formData.developer_id} onValueChange={(value) => setFormData({ ...formData, developer_id: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select developer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id.toString()}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default AdminProjectDetails;
