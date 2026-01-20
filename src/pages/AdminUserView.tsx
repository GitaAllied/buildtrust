import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Edit
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

const AdminUserView = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        setUser(foundUser || null);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "Suspended":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
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
      <div className="bg-white shadow-sm border-b">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/users')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                <p className="text-sm text-gray-500">View user details and information</p>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
              className="bg-[#253E44] hover:bg-[#253E44]/90"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center flex-col md:flex-row space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      {getStatusIcon(user.status)}
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-gray-600 mt-1 text-center md:text-left">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {user.bio && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-700">{user.bio}</p>
                  </div>
                )}

                {user.skills && user.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.completedProjects || 0}</div>
                    <div className="text-sm text-gray-600">Completed Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.activeProjects || 0}</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.rating ? `${user.rating}/5` : 'N/A'}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">${user.totalEarnings || 0}</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity & Projects Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Account created</p>
                      <p className="text-xs text-gray-500">Joined in {user.joined}</p>
                    </div>
                  </div>
                  {user.lastActive && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Last active</p>
                        <p className="text-xs text-gray-500">{user.lastActive}</p>
                      </div>
                    </div>
                  )}
                  {user.projects > 0 && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Projects completed</p>
                        <p className="text-xs text-gray-500">{user.completedProjects} projects finished</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-600">{user.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-gray-600">{user.joined}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(user.status)}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role</span>
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects</span>
                    <span className="font-medium">{user.projects}</span>
                  </div>
                  {user.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        {user.rating}/5
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserView;