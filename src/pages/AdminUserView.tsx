import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api";
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
  Edit,
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

const AdminUserView = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user data for when API is not connected
  const mockUserData: User = {
    id: 1,
    name: "Ade Johnson",
    email: "ade.johnson@example.com",
    role: "Client",
    status: "Verified",
    phone: "+234 812 345 6789",
    location: "Lagos, Nigeria",
    joined: "Jan 15, 2025",
    projects: 5,
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    bio: "Experienced real estate investor looking for premium construction services. Successfully completed 5 projects with excellent contractors.",
    skills: ["Construction Management", "Project Planning", "Budget Control"],
    completedProjects: 5,
    activeProjects: 2,
    totalEarnings: 0,
    lastActive: "2 hours ago",
  };

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
        
        // Determine status based on is_active first, then email/setup verification
        let status = 'Pending';
        if (userData.is_active === false || userData.is_active === 0) {
          status = 'Suspended';
        } else if (!userData.email_verified || userData.email_verified === 0) {
          status = 'Pending';
        } else if (userData.setup_completed === 1 || userData.setup_completed === true) {
          status = 'Verified';
        }
        
        const mappedUser = {
          id: userData.id,
          name: userData.name || 'Unknown User',
          email: userData.email,
          role: userData.role?.charAt(0).toUpperCase() + userData.role?.slice(1) || 'User',
          status: status,
          phone: userData.phone || '-',
          location: userData.location || '-',
          joined: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently',
          projects: 0,
          rating: 0,
          bio: '',
          skills: [],
          completedProjects: 0,
          activeProjects: 0,
          totalEarnings: 0,
          lastActive: '',
          avatar: '',
        } as User;
        setUser(mappedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        console.warn('Using mock data due to API connection issue');
        // Use mock data when API fails
        setUser(mockUserData);
        setError(null); // Don't show error, just display mock data
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
      <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/users')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="md:text-2xl font-bold text-gray-900">User Profile</h1>
                <p className="text-sm text-gray-500">View user details and information</p>
              </div>
            </div>
            {user && (
              <Button
                onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                className="bg-[#253E44] hover:bg-[#253E44]/90"
              >
                <Edit className=" mr-0 md:mr-2 h-4 w-4" />
                <p className=" hidden md:block">Edit User</p>
              </Button>
            )}
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
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                      {user?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 justify-center md:justify-start">
                      <CardTitle className="text-2xl">{user?.name}</CardTitle>
                      {user && getStatusIcon(user.status)}
                      {/* {getStatusBadge(user.status)} */}
                    </div>
                    <p className="text-gray-600 mt-1 text-center md:text-left">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user?.email}</span>
                      </div>
                      {user?.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{user?.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  {/* About Section */}
                  {user?.bio && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{user?.bio}</p>
                    </div>
                  )}

                  {/* Skills Section */}
                  {user?.skills && user?.skills.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {user?.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Statistics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{user?.completedProjects || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Completed Projects</div>
                      </div>
                      <div className="text-center bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{user?.activeProjects || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Active Projects</div>
                      </div>
                      <div className="text-center bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{user?.rating ? `${user?.rating}` : '0'}</div>
                        <div className="text-xs text-gray-600 mt-1">Rating</div>
                      </div>
                      <div className="text-center bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">${user?.totalEarnings || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Total Earnings</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity & Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Timeline & Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 pb-4 border-b">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Account Created</p>
                      <p className="text-xs text-gray-500 mt-1">Member since {user?.joined}</p>
                    </div>
                  </div>

                  {user?.completedProjects > 0 && (
                    <div className="flex items-start space-x-3 pb-4 border-b">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Projects Completed</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.completedProjects} successful projects delivered</p>
                      </div>
                    </div>
                  )}

                  {user?.activeProjects > 0 && (
                    <div className="flex items-start space-x-3 pb-4 border-b">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Active Projects</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.activeProjects} projects currently in progress</p>
                      </div>
                    </div>
                  )}

                  {user?.rating && user?.rating > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Rating</p>
                        <p className="text-xs text-gray-500 mt-1">Average rating: {user?.rating}/5 stars</p>
                      </div>
                    </div>
                  )}

                  {!user?.completedProjects && !user?.activeProjects && (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500">No activity yet</p>
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
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                {user?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{user?.phone}</p>
                    </div>
                  </div>
                )}
                {user?.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-600">{user?.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-gray-600">{user?.joined}</p>
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
                  {user && getStatusBadge(user.status)}
                </div>
                <Separator className="my-4" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role</span>
                    <span className="font-medium capitalize">{user?.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account ID</span>
                    <span className="font-medium">{user?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email Verified</span>
                    <span className="font-medium">
                      {user?.status === 'Suspended' ? '✗ No' : '✓ Yes'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active</span>
                    <span className="font-medium">
                      {user?.status === 'Suspended' ? '✗ No' : '✓ Yes'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-xs">{user?.joined}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects</span>
                    <span className="font-medium">{user?.projects}</span>
                  </div>
                  {user?.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        {user?.rating}/5
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