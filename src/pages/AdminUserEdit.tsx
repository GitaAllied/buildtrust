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
  Upload
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    phone: "",
    location: "",
    bio: "",
    skills: [] as string[]
  });

  // Mock user data - in a real app, this would come from an API
  const mockUsers: User[] = [
    {
      id: 1,
      name: "John Developer",
      email: "john@example.com",
      role: "developer",
      status: "Verified",
      phone: "+234 801 234 5678",
      location: "Lagos, Nigeria",
      joined: "Jan 2024",
      projects: 12,
      rating: 4.8,
      avatar: "",
      bio: "Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies.",
      skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
      completedProjects: 10,
      activeProjects: 2,
      totalEarnings: 25000,
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Sarah Client",
      email: "sarah@example.com",
      role: "client",
      status: "Verified",
      phone: "+234 802 345 6789",
      location: "Abuja, Nigeria",
      joined: "Mar 2024",
      projects: 5,
      rating: 4.9,
      avatar: "",
      bio: "Product manager looking to build innovative solutions for the Nigerian market.",
      skills: ["Product Management", "Agile", "UX Design"],
      completedProjects: 3,
      activeProjects: 2,
      totalEarnings: 15000,
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Mike Contractor",
      email: "mike@example.com",
      role: "developer",
      status: "Pending",
      phone: "+234 803 456 7890",
      location: "Port Harcourt, Nigeria",
      joined: "Dec 2024",
      projects: 0,
      avatar: "",
      bio: "New to the platform, excited to start building amazing projects.",
      skills: ["JavaScript", "Python", "Django"],
      completedProjects: 0,
      activeProjects: 0,
      totalEarnings: 0,
      lastActive: "1 week ago"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchUser = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const foundUser = mockUsers.find(u => u.id === parseInt(userId || "0"));
        if (foundUser) {
          setUser(foundUser);
          setFormData({
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            status: foundUser.status,
            phone: foundUser.phone || "",
            location: foundUser.location || "",
            bio: foundUser.bio || "",
            skills: foundUser.skills || []
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
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
      alert("Name and email are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setSaving(true);
    try {
      // In a real app, this would be an API call to update the user
      console.log("Updating user:", formData);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      alert("User updated successfully!");

      // Navigate back to user view
      navigate(`/admin/users/${userId}`);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/users/${userId}`);
  };

  const handleSkillChange = (skillString: string) => {
    const skills = skillString.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setFormData(prev => ({ ...prev, skills }));
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">User not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate('/admin/users')}
            className="mt-4 bg-red-600 hover:bg-red-700"
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
      <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-14 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-start justify-between flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/admin/users/${userId}`)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                <p className="text-sm text-gray-500">Update user information and settings</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#253E44] hover:bg-[#253E44]/90"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
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

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about this user..."
                    rows={4}
                  />
                </div>

                {user.role === 'developer' && (
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={formData.skills.join(', ')}
                      onChange={(e) => handleSkillChange(e.target.value)}
                      placeholder="React, Node.js, TypeScript"
                    />
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <AvatarImage src={user.avatar} alt={formData.name} />
                    <AvatarFallback>
                      {formData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{formData.name || 'User Name'}</h3>
                    <p className="text-sm text-gray-600">{formData.email || 'user@example.com'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(formData.status)}
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
                    <span className="font-medium">{user.projects}</span>
                  </div>
                  {user.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium">{user.rating}/5</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined</span>
                    <span className="font-medium">{user.joined}</span>
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
                    <span className="font-semibold">{user.projects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{user.completedProjects || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="font-semibold text-blue-600">{user.activeProjects || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Earnings</span>
                    <span className="font-semibold">${user.totalEarnings || 0}</span>
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