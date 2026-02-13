import { useState, useEffect } from "react";
// Helper to ensure document URLs are absolute
function getAbsoluteUrl(url: string) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  // Use backend URL from env or fallback
  const backend = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:3001';
  const combined = url.startsWith('/') ? backend + url : backend + '/' + url;
  try {
    return encodeURI(combined);
  } catch (e) {
    return combined;
  }
}
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Loader2,
  FileCheck,
  Download,
  AlertCircle,
  Eye
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  location?: string;
  current_state?: string | null;
  current_country?: string | null;
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
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [selectedDocumentForPreview, setSelectedDocumentForPreview] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewAttemptUrl, setPreviewAttemptUrl] = useState<string | null>(null);
  const [previewTriedAlternate, setPreviewTriedAlternate] = useState(false);
  const [previewAlternates, setPreviewAlternates] = useState<string[]>([]);
  const [previewAlternateIndex, setPreviewAlternateIndex] = useState(0);

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
          current_state: userData.current_state || null,
          current_country: userData.current_country || null,
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
      loadDocuments();
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
      "Suspended": "destructive",
      "Active": "secondary",
      "Awaiting Approval": "secondary",
      "Pending Email": "secondary",
      "Pending Setup": "secondary"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  const handleApproveDocument = async (documentId: number) => {
    if (!userId) return;
    try {
      setIsSubmitting(true);
      await apiClient.approveUserDocument(userId, documentId);
      toast({
        title: "Success",
        description: "Document approved successfully",
      });
      loadDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve document",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineDocument = async () => {
    if (!userId || !selectedDocumentId || !declineReason.trim()) return;
    try {
      setIsSubmitting(true);
      await apiClient.declineUserDocument(userId, selectedDocumentId, {
        reason: declineReason,
      });
      toast({
        title: "Success",
        description: "Document declined and user notified",
      });
      setShowDeclineDialog(false);
      setDeclineReason("");
      setSelectedDocumentId(null);
      loadDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline document",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadDocuments = async () => {
    if (!userId) return;
    try {
      const docs = await apiClient.getUserDocuments(userId);
      setDocuments(Array.isArray(docs) ? docs : docs?.documents || []);
    } catch (error) {
      console.error("Failed to load documents:", error);
      setDocuments([]);
    }
  };

  // Build alternate URLs to try when previewing a document. This handles legacy
  // filenames like 'uploaded_<timestamp>_<name>' by mapping them to '/uploads/...'.
  const buildAlternateUrls = (doc: any) => {
    try {
      const backend = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:3001';
      const original = doc.url || '';
      const urls: string[] = [];

      // If absolute URL, parse to get filename
      let pathname = '';
      if (/^https?:\/\//i.test(original)) {
        try { pathname = new URL(original).pathname; } catch (e) { pathname = original; }
      } else {
        pathname = original.startsWith('/') ? original : '/' + original;
      }

      const segments = pathname.split('/').filter(Boolean);
      const filename = segments.length ? segments[segments.length - 1] : '';

      if (filename) {
        const decoded = decodeURIComponent(filename);
        const bare = decoded.replace(/^uploaded[_-]?/, '');

        // Candidate: /uploads/<filename> (encoded and decoded)
        urls.push(`${backend}/uploads/${encodeURIComponent(filename)}`);
        urls.push(`${backend}/uploads/${encodeURIComponent(decoded)}`);
        urls.push(`${backend}/uploads/${encodeURIComponent(bare)}`);

        // Candidate: if doc.type is present, /uploads/<type>/<filename>
        if (doc.type) {
          urls.push(`${backend}/uploads/${encodeURIComponent(doc.type)}/${encodeURIComponent(filename)}`);
          urls.push(`${backend}/uploads/${encodeURIComponent(doc.type)}/${encodeURIComponent(decoded)}`);
          urls.push(`${backend}/uploads/${encodeURIComponent(doc.type)}/${encodeURIComponent(bare)}`);
        }

        // Also include a direct backend path without encoding (some servers expect raw path)
        urls.push(`${backend}/uploads/${filename}`);
        urls.push(`${backend}/uploads/${decoded}`);
      }

      // If path contains 'uploaded_' try replacing with 'uploads/'
      if (pathname.includes('uploaded_') || pathname.includes('uploaded-')) {
        const replaced = pathname.replace(/uploaded[_-]/g, 'uploads/');
        if (/^https?:\/\//i.test(original)) {
          try { urls.push(new URL(replaced, original).toString()); } catch (e) { urls.push(`${backend}${replaced}`); }
        } else {
          urls.push(`${backend}${replaced}`);
        }
      }

      // include the original absolute/relative path as last resort
      if (original) {
        if (/^https?:\/\//i.test(original)) urls.push(original);
        else urls.push(`${backend}${original.startsWith('/') ? original : '/' + original}`);
      }

      // Remove duplicates and return
      return Array.from(new Set(urls)).filter(Boolean);
    } catch (e) {
      return [];
    }
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

            {/* Developer Documents Card - Only show for Developers */}
            {user?.role?.toLowerCase() === "developer" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Documents & Verification
                    </CardTitle>
                    <Badge variant={documents && documents.length > 0 ? (documents.some((d: any) => !d.verified) ? "secondary" : "default") : "outline"}>
                      {documents && documents.length > 0
                        ? `${documents.filter((d: any) => d.verified).length}/${documents.length} Verified`
                        : "No documents"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {documents && documents.length > 0 ? (
                    <div className="space-y-4">
                      {documents.map((doc: any) => (
                        <div
                          key={doc.id}
                          className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm capitalize">
                                {doc.type?.replace(/_/g, " ") || "Document"}
                              </h4>
                              {doc.verified ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600">
                              Uploaded:{" "}
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                            {doc.verified === 2 && doc.decline_reason && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                <p className="text-xs font-medium text-red-900">Declined - Reason:</p>
                                <p className="text-xs text-red-800">{doc.decline_reason}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                            {(doc.verified === null || doc.verified === 0) && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApproveDocument(doc.id)}
                                  disabled={isSubmitting}
                                  className="bg-green-600 hover:bg-green-700 text-xs"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedDocumentId(doc.id);
                                    setShowDeclineDialog(true);
                                  }}
                                  disabled={isSubmitting}
                                  className="text-xs"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Decline
                                </Button>
                              </>
                            )}
                            {doc.verified === 1 && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Verified
                              </Badge>
                            )}
                            {doc.verified === 2 && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Declined
                              </Badge>
                            )}
                            {doc.url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedDocumentForPreview(doc);
                                  setPreviewTriedAlternate(false);
                                  setPreviewAttemptUrl(getAbsoluteUrl(doc.url));
                                  setPreviewAlternates(buildAlternateUrls(doc));
                                  setPreviewAlternateIndex(0);
                                  setPreviewError(null);
                                  setShowPreviewDialog(true);
                                }}
                                className="text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileCheck className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No documents submitted yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

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
                      { (user?.current_state || user?.current_country) && (
                        <p className="text-xs text-gray-400">{[user?.current_state, user?.current_country].filter(Boolean).join(', ')}</p>
                      )}
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

      {/* Document Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={(open) => {
        setShowPreviewDialog(open);
        if (!open) {
          setPreviewError(null);
        }
      }}>
        <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Document Preview - {selectedDocumentForPreview?.type?.replace(/_/g, " ")}
            </DialogTitle>
            <DialogDescription>
              Review the document below before approving or declining
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocumentForPreview && (
            <div className="grid gap-4 py-4">
              {/* Document Content */}
              <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center min-h-[400px]">
                {selectedDocumentForPreview.url ? (
                  previewError ? (
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-red-600 mb-2">{previewError}</p>
                      <p className="text-xs text-gray-600 mb-3">URL: {previewAttemptUrl || getAbsoluteUrl(selectedDocumentForPreview.url)}</p>
                      <Button size="sm" asChild>
                        <a href={previewAttemptUrl || getAbsoluteUrl(selectedDocumentForPreview.url)} target="_blank" rel="noopener noreferrer">Open in new tab →</a>
                      </Button>
                    </div>
                  ) : selectedDocumentForPreview.url.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={previewAttemptUrl || getAbsoluteUrl(selectedDocumentForPreview.url)}
                      className="w-full h-full min-h-[500px]"
                      title="Document Preview"
                      onError={() => {
                        // try next alternate URL if available
                        if (previewAlternates && previewAlternateIndex < previewAlternates.length) {
                          const next = previewAlternates[previewAlternateIndex];
                          setPreviewAttemptUrl(getAbsoluteUrl(next));
                          setPreviewAlternateIndex(i => i + 1);
                          setPreviewError(null);
                          return;
                        }
                        setPreviewError("Failed to load PDF");
                      }}
                    />
                  ) : (
                    <img
                      src={previewAttemptUrl || getAbsoluteUrl(selectedDocumentForPreview.url)}
                      alt={selectedDocumentForPreview.type}
                      className="max-w-full max-h-[500px] object-contain"
                      onError={() => {
                        if (previewAlternates && previewAlternateIndex < previewAlternates.length) {
                          const next = previewAlternates[previewAlternateIndex];
                          setPreviewAttemptUrl(getAbsoluteUrl(next));
                          setPreviewAlternateIndex(i => i + 1);
                          setPreviewError(null);
                          return;
                        }
                        setPreviewError("Failed to load image");
                      }}
                      onLoad={() => setPreviewError(null)}
                    />
                  )
                ) : (
                  <p className="text-gray-500">No document URL available</p>
                )}
              </div>

              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg text-sm">
                <div>
                  <p className="text-gray-600">Document Type</p>
                  <p className="font-semibold capitalize">{selectedDocumentForPreview.type?.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <p className="text-gray-600">Uploaded</p>
                  <p className="font-semibold">{new Date(selectedDocumentForPreview.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">File Size</p>
                  <p className="font-semibold">{(selectedDocumentForPreview.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-semibold">
                    {selectedDocumentForPreview.verified === 1 && "✓ Verified"}
                    {selectedDocumentForPreview.verified === 2 && "✗ Declined"}
                    {(selectedDocumentForPreview.verified === null || selectedDocumentForPreview.verified === 0) && "⏳ Pending"}
                  </p>
                </div>
              </div>

              {/* Show decline reason if document was declined */}
              {selectedDocumentForPreview.verified === 2 && selectedDocumentForPreview.decline_reason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900">Document Declined - Reason:</p>
                  <p className="text-sm text-red-800 mt-1">{selectedDocumentForPreview.decline_reason}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 flex flex-wrap justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowPreviewDialog(false);
                setSelectedDocumentForPreview(null);
              }}
              disabled={isSubmitting}
              size="sm"
            >
              Close
            </Button>
            {selectedDocumentForPreview?.url && (
              <Button
                variant="outline"
                asChild
                size="sm"
              >
                <a href={getAbsoluteUrl(selectedDocumentForPreview.url)} target="_blank" rel="noopener noreferrer">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </a>
              </Button>
            )}
            {!selectedDocumentForPreview?.verified && (
              <>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setShowPreviewDialog(false);
                    setSelectedDocumentId(selectedDocumentForPreview?.id || null);
                    setShowDeclineDialog(true);
                  }}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (selectedDocumentForPreview?.id) {
                      handleApproveDocument(selectedDocumentForPreview.id);
                      setShowPreviewDialog(false);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve Document
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Document Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="sm:max-w-[425px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Decline Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this document. The user will be
              notified with this message.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-sm">
                Decline Reason *
              </Label>
              <Textarea
                id="reason"
                placeholder="Explain why the document was declined (e.g., image quality, missing information, etc.)"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="text-sm"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeclineDialog(false);
                setDeclineReason("");
                setSelectedDocumentId(null);
              }}
              disabled={isSubmitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeclineDocument}
              disabled={isSubmitting || !declineReason.trim()}
              className="bg-red-600 hover:bg-red-700"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Declining...
                </>
              ) : (
                "Decline Document"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserView;