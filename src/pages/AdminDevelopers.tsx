import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
// MOCK DATA: Replace with apiClient once backend is ready
import { getAllDevelopers } from "@/lib/mockData";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Briefcase,
  Mail,
  MapPin,
  Plus,
} from "lucide-react";

interface Developer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  rating?: number;
  bio?: string;
  website?: string;
  completed_projects?: number;
  is_active: boolean;
}

const AdminDevelopers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExperience, setFilterExperience] = useState("all");
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDevelopers();
    loadClients();
  }, []);

  const loadDevelopers = async () => {
    try {
      setLoading(true);
      setError(null);
      // MOCK DATA: Using mock data - replace with apiClient.getDevelopers() when ready
      const response = getAllDevelopers();
      setDevelopers(response);
    } catch (err) {
      console.error("Error loading developers:", err);
      setError("Failed to load developers");
      toast({ title: "Error", description: "Failed to load developers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      // MOCK DATA: Mock clients - replace with apiClient.getUsers() when ready
      const mockClients = [
        { id: 101, name: "TechStore Inc.", email: "contact@techstore.com" },
        { id: 102, name: "FitLife Corp", email: "hello@fitlife.com" },
        { id: 103, name: "DataViz Solutions", email: "info@dataviz.com" },
        { id: 104, name: "CloudBase Systems", email: "support@cloudbase.com" },
      ];
      setClients(mockClients);
    } catch (err) {
      console.error("Error loading clients:", err);
    }
  };

  const filteredDevelopers = developers.filter((dev) => {
    const matchesSearch = 
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAssignToClient = async () => {
    if (!selectedDeveloper || !selectedClient) {
      toast({ title: "Error", description: "Please select a client", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      // MOCK DATA: Mock assignment - replace with actual backend endpoint when ready
      console.log(`Assigning developer ${selectedDeveloper.id} to client ${selectedClient}`);
      toast({ title: "Success", description: "Developer assigned to client" });
      setIsAssignDialogOpen(false);
      setSelectedClient("");
      loadDevelopers();
    } catch (err) {
      toast({ title: "Error", description: "Failed to assign developer", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDeveloper = async (devId: number) => {
    if (!confirm("Are you sure you want to delete this developer?")) return;

    try {
      // MOCK DATA: Delete functionality - replace with apiClient.deleteUser() when ready
      console.log("Delete developer:", devId);
      toast({ title: "Success", description: "Developer deleted" });
      loadDevelopers();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete developer", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#253E44] mx-auto" />
          <p className="mt-4 text-gray-600">Loading developers...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Developers Management</h1>
              <p className="text-sm text-gray-500">Manage developers and assign to clients/projects</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/users")}>
              Users
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/projects")}>
              Projects
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/contracts")}>
              Contracts
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
                placeholder="Search developers by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Developers Grid */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Developers ({filteredDevelopers.length})</h2>
          </div>
          {filteredDevelopers.length === 0 ? (
            <Card>
              <CardContent className="pt-12 text-center pb-12">
                <p className="text-gray-500">No developers found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevelopers.map((developer) => (
                <Card key={developer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={developer.name} />
                          <AvatarFallback>
                            {developer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{developer.name}</h3>
                          <p className="text-sm text-gray-500">{developer.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/users/${developer.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedDeveloper(developer);
                            setIsAssignDialogOpen(true);
                          }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Assign to Client
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/users/${developer.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteDeveloper(developer.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {developer.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{developer.location}</span>
                      </div>
                    )}

                    {developer.bio && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{developer.bio}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium">Projects</p>
                        <p className="text-lg font-semibold text-blue-600">{developer.completed_projects || 0}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium">Rating</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <p className="text-lg font-semibold text-yellow-600">{developer.rating || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant={developer.is_active ? "default" : "destructive"}>
                        {developer.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <a
                        href={`mailto:${developer.email}`}
                        className="flex items-center space-x-1 text-sm text-[#253E44] hover:text-[#253E44]/80"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Contact</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Assign to Client Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Developer to Client</DialogTitle>
              <DialogDescription>
                Select a client to work with {selectedDeveloper?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Client</label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAssignToClient}
                disabled={saving}
                className="bg-[#253E44] hover:bg-[#253E44]/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Assigning...
                  </>
                ) : (
                  "Assign Developer"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDevelopers;
