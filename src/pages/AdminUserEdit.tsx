import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  ArrowLeft,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  location?: string;
  joined: string;
  projects: number;
  rating?: number;
  avatar?: string;
  bio?: string;
  skills?: string[];
  completedProjects?: number;
  activeProjects?: number;
  totalEarnings?: number;
  lastActive?: string;
}

const AdminUserEdit = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    email_verified: false,
    is_active: true,
    skills: "" as any,
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!userId) {
          setError('Invalid user ID');
          return;
        }
        const userData = await apiClient.getUser(userId);
        const mappedUser = {
          id: userData.id,
          name: userData.name || 'Unknown User',
          email: userData.email,
          role: userData.role?.charAt(0).toUpperCase() + userData.role?.slice(1) || 'User',
          status: !userData.email_verified || userData.email_verified === 0 ? 'Pending' : (userData.setup_completed === 1 || userData.setup_completed === true) ? 'Verified' : 'Pending',
          phone: userData.phone || '-',
          location: userData.location || '-',
          joined: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently',
          projects: 0,
          rating: 0,
        } as User;
        setUser(mappedUser);
        setFormData({
          name: mappedUser.name,
          email: mappedUser.email,
          role: userData.role || 'client',
          phone: userData.phone || '',
          location: userData.location || '',
          bio: userData.bio || '',
          website: userData.website || '',
          email_verified: userData.email_verified === 1 || userData.email_verified === true,
          is_active: userData.is_active === 1 || userData.is_active === true,
          skills: userData.skills ? userData.skills.join(', ') : '',
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("User not found. The user you're looking for doesn't exist or has been removed.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleSave = async () => {
    // Validate form
    if (!formData.name || !formData.email) {
      toast({ title: 'Error', description: 'Name and email are required', variant: 'destructive' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      // Call API to update user
      await apiClient.updateUser(parseInt(userId || '0'), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone || null,
        location: formData.location || null,
        bio: formData.bio || null,
        website: formData.website || null,
        email_verified: formData.email_verified ? 1 : 0,
        is_active: formData.is_active ? 1 : 0,
        skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()) : null,
      });

      toast({ title: 'Success', description: 'User updated successfully!' });
      
      // Navigate back to user view
      navigate(`/admin/users/${userId}`);
    } catch (err) {
      console.error("Error updating user:", err);
      toast({ title: 'Error', description: 'Failed to update user. Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/users/${userId}`);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "Verified": "default",
      "Pending": "secondary",
      "Suspended": "destructive"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#253E44] mx-auto" />
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">User not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error || "The user you're looking for doesn't exist or has been removed."}
          </p>
          <Button
            onClick={() => navigate('/admin/users')}
            className="mt-4 bg-[#253E44] hover:bg-[#253E44]/90"
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 md:gap-0 md:space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/admin/users/${userId}`)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="md:text-2xl font-bold text-gray-900">Edit User</h1>
                <p className="text-sm text-gray-500">Update user information</p>
              </div>
            </div>
            <div className="flex gap-2 md:gap-0 md:space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                <X className="md:mr-2 h-4 w-4" />
                <span className="hidden md:inline">Cancel</span>
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
                    <Save className="md:mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio/About</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Write a brief bio about the user"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website/Portfolio</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="e.g. React, TypeScript, Node.js, UI Design"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Email Verified</Label>
                      <p className="text-sm text-gray-600 mt-1">Mark if user email has been verified</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.email_verified}
                      onChange={(e) => setFormData(prev => ({ ...prev, email_verified: e.target.checked }))}
                      className="w-5 h-5 cursor-pointer rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Account Active</Label>
                      <p className="text-sm text-gray-600 mt-1">Uncheck to suspend the account</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-5 h-5 cursor-pointer rounded border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar} alt={formData.name} />
                    <AvatarFallback>
                      {formData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{formData.name || 'User Name'}</h3>
                    <p className="text-sm text-gray-600">{formData.email || 'user@example.com'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(user?.status || 'Pending')}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role</span>
                    <span className="font-medium capitalize">{formData.role || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects</span>
                    <span className="font-medium">{user?.projects || 0}</span>
                  </div>
                  {user?.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium">{user?.rating}/5</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined</span>
                    <span className="font-medium">{user?.joined}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Projects</span>
                    <span className="font-semibold">{user?.projects || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{user?.completedProjects || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="font-semibold text-blue-600">{user?.activeProjects || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Earnings</span>
                    <span className="font-semibold">${user?.totalEarnings || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserEdit;