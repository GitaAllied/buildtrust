import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Briefcase,
  Edit2,
  Loader2,
  Save,
} from "lucide-react";
import { getDeveloperById, updateDeveloper, Developer } from "@/lib/mockData";

const AdminDeveloperDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    is_active: true,
  });

  useEffect(() => {
    const developerId = parseInt(id || "0");
    const foundDeveloper = getDeveloperById(developerId);
    
    if (foundDeveloper) {
      setDeveloper(foundDeveloper);
      setFormData({
        name: foundDeveloper.name,
        email: foundDeveloper.email,
        phone: foundDeveloper.phone || "",
        location: foundDeveloper.location || "",
        bio: foundDeveloper.bio || "",
        website: foundDeveloper.website || "",
        is_active: foundDeveloper.is_active,
      });
    } else {
      toast({ title: "Error", description: "Developer not found", variant: "destructive" });
      navigate("/admin/developers");
    }

    setLoading(false);
  }, [id, navigate, toast]);

  const handleSave = async () => {
    if (!developer) return;

    setSaving(true);
    try {
      const updatedDeveloper = updateDeveloper(developer.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
        is_active: formData.is_active,
      });

      if (updatedDeveloper) {
        setDeveloper(updatedDeveloper);
        setIsEditing(false);
        toast({ title: "Success", description: "Developer updated successfully" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update developer", variant: "destructive" });
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

  if (!developer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">Developer not found</p>
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
              onClick={() => navigate("/admin/developers")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={developer.name} />
                <AvatarFallback>
                  {developer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{developer.name}</h1>
                <p className="text-sm text-gray-500">Developer Profile</p>
              </div>
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
                    <Badge variant={developer.is_active ? "default" : "destructive"} className="mt-2">
                      {developer.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <p className="text-2xl font-bold">{developer.rating || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Completed Projects</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {developer.completed_projects || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${developer.email}`} className="text-[#253E44] hover:underline">
                      {developer.email}
                    </a>
                  </div>
                </div>

                {developer.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href={`tel:${developer.phone}`} className="text-[#253E44] hover:underline">
                        {developer.phone}
                      </a>
                    </div>
                  </div>
                )}

                {developer.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900">{developer.location}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {developer.bio && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900">{developer.bio}</p>
                </CardContent>
              </Card>
            )}

            {developer.specializations && developer.specializations.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {developer.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {developer.years_experience && (
                  <div>
                    <p className="text-sm text-gray-600">Years of Experience</p>
                    <p className="text-gray-900 font-semibold mt-1">{developer.years_experience}+ years</p>
                  </div>
                )}

                {developer.website && (
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a href={developer.website} target="_blank" rel="noopener noreferrer" className="text-[#253E44] hover:underline">
                      {developer.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Developer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    Active Status
                  </label>
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

export default AdminDeveloperDetails;
