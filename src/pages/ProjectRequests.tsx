import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, DollarSign, User, X, Menu, AlertCircle, Building2, CheckCircle, XCircle } from "lucide-react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SignoutModal from "@/components/ui/signoutModal";
import DeveloperSidebar from "@/components/DeveloperSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openDeveloperSidebar, openSignoutModal } from "@/redux/action";
import { FaMoneyBill } from "react-icons/fa6";
import { apiClient } from "@/lib/api";

interface ProjectRequest {
  id: number;
  title: string;
  description: string;
  location: string;
  building_type: string;
  budget_min: number;
  budget_max: number;
  duration: string;
  start_date: string;
  client: { id: number; name: string; email: string };
  acceptance_status: 'pending' | 'accepted' | 'rejected';
  assigned_at: string;
  hours_remaining?: number;
  created_at: string;
  status: string;
}

const ProjectRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const isOpen = useSelector((state: any) => state.sidebar.developerSidebar);
  const signOutModal = useSelector((state: any) => state.signout);
  
  const [pendingRequests, setPendingRequests] = useState<ProjectRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<ProjectRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch developer's assigned projects
  useEffect(() => {
    if (!user || loading) return;

    const fetchProjectRequests = async () => {
      try {
        setIsLoadingRequests(true);
        setError(null);
        
        const response = await apiClient.getDeveloperProjects();
        console.log('📦 Developer projects fetched:', response);
        
        const projects = Array.isArray(response?.projects) ? response.projects : [];

        // Separate pending and accepted requests
        const pending = projects.filter((p: ProjectRequest) => p.acceptance_status === 'pending');
        const accepted = projects.filter((p: ProjectRequest) => p.acceptance_status === 'accepted');

        setPendingRequests(pending);
        setAcceptedRequests(accepted);
      } catch (error) {
        console.error('❌ Failed to fetch project requests:', error);
        setError('Failed to load project requests. Please try again.');
        setPendingRequests([]);
        setAcceptedRequests([]);
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchProjectRequests();
  }, [user, loading]);

  const formatDuration = (duration?: string) => {
    if (!duration) return "Timeline pending";
    const durationMap: Record<string, string> = {
      '3-6': '3-6 months',
      '6-12': '6-12 months',
      '12-18': '12-18 months',
      '18+': '18+ months'
    };
    return durationMap[duration] || duration;
  };

  const formatBudget = (budget_min?: number, budget_max?: number) => {
    if (budget_min && budget_max) {
      const min = `$${Number(budget_min).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      const max = `$${Number(budget_max).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      return `${min} - ${max}`;
    }
    return "Budget TBD";
  };

  const handleAccept = async (projectId: number) => {
    try {
      await apiClient.acceptProjectAssignment(projectId);
      // Refresh the list
      const response = await apiClient.getDeveloperProjects();
      const projects = Array.isArray(response?.projects) ? response.projects : [];
      const pending = projects.filter((p: ProjectRequest) => p.acceptance_status === 'pending');
      const accepted = projects.filter((p: ProjectRequest) => p.acceptance_status === 'accepted');
      setPendingRequests(pending);
      setAcceptedRequests(accepted);
    } catch (error) {
      console.error('Failed to accept project:', error);
      alert('Failed to accept project. Please try again.');
    }
  };

  const handleReject = async (projectId: number) => {
    if (!confirm('Are you sure you want to reject this project?')) return;
    
    try {
      await apiClient.rejectProjectAssignment(projectId);
      // Refresh the list
      const response = await apiClient.getDeveloperProjects();
      const projects = Array.isArray(response?.projects) ? response.projects : [];
      const pending = projects.filter((p: ProjectRequest) => p.acceptance_status === 'pending');
      const accepted = projects.filter((p: ProjectRequest) => p.acceptance_status === 'accepted');
      setPendingRequests(pending);
      setAcceptedRequests(accepted);
    } catch (error) {
      console.error('Failed to reject project:', error);
      alert('Failed to reject project. Please try again.');
    }
  };

  const renderRequestCard = (request: ProjectRequest, isPending: boolean) => (
    <Card key={request.id} className={`transition-shadow hover:shadow-md ${isPending ? 'border-orange-200 bg-orange-50/30' : 'border-green-200 bg-green-50/30'}`}>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
            <AvatarFallback className="text-xs bg-[#226F75] text-white">
              {request.title
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xs sm:text-sm md:text-base text-center md:text-left truncate">
              {request.title}
            </h3>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 flex-wrap justify-center md:justify-start">
              <User className="h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0" />
              <span className="truncate text-xs">{request.client?.name || 'Unknown Client'}</span>
              {isPending && request.hours_remaining !== undefined && (
                <Badge className="bg-orange-200 text-orange-800 text-[10px]">
                  ⏳ {request.hours_remaining}h left
                </Badge>
              )}
              {!isPending && (
                <Badge className="bg-green-200 text-green-800 text-[10px]">
                  ✓ Accepted
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm sm:text-base md:text-lg font-bold text-[#226F75]">
              {formatBudget(request.budget_min, request.budget_max)}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 line-clamp-2">
          {request.description}
        </p>

        {request.building_type && (
          <div className="mb-3">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1 w-fit">
              <Building2 className="h-3 w-3" />
              {request.building_type}
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
          <div className="flex justify-center items-center gap-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate text-xs font-medium text-gray-700">{request.location || 'Location TBD'}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate text-xs font-medium text-gray-700">{formatDuration(request.duration)}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <FaMoneyBill className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate text-xs font-medium text-[#226F75]">{formatBudget(request.budget_min, request.budget_max)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            size="sm"
            variant="outline"
            className="text-xs w-full sm:w-[33%]"
            onClick={() => navigate(`/project/${request.id}`)}
          >
            View Details
          </Button>
          {isPending ? (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs w-full sm:w-[33%]"
                onClick={() => handleAccept(request.id)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs w-full sm:w-[33%]"
                onClick={() => handleReject(request.id)}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="bg-[#226F75] hover:bg-[#226F75]/80 text-white text-xs w-full sm:flex-1"
              onClick={() => navigate("/active-projects")}
            >
              Go to Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openDeveloperSidebar(!isOpen))}
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
      <DeveloperSidebar active={"requests"} />

      <div className="flex-1 md:pl-64 w-full min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  Project Requests
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Review and respond to assigned project requests
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {pendingRequests.length > 0 && (
                <Badge className="bg-orange-600 text-xs">
                  {pendingRequests.length} Pending
                </Badge>
              )}
              {acceptedRequests.length > 0 && (
                <Badge className="bg-green-600 text-xs">
                  {acceptedRequests.length} Active
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {/* Loading State */}
          {isLoadingRequests && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#226F75] mb-4"></div>
                <p className="text-gray-600">Loading project requests...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoadingRequests && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">{error}</p>
                  <p className="text-red-600 text-sm">Please try refreshing the page.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoadingRequests && !error && pendingRequests.length === 0 && acceptedRequests.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <div className="text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium mb-1">No Project Requests</h3>
                  <p className="text-sm">
                    You don't have any project assignments yet. Check back soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Requests Section */}
          {!isLoadingRequests && pendingRequests.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-600 rounded"></span>
                Pending Requests ({pendingRequests.length})
              </h2>
              <div className="grid md:grid-cols-2 md:gap-5">
                {pendingRequests.map((request) => renderRequestCard(request, true))}
              </div>
            </div>
          )}

          {/* Accepted Requests Section */}
          {!isLoadingRequests && acceptedRequests.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded"></span>
                Active Projects ({acceptedRequests.length})
              </h2>
              <div className="grid md:grid-cols-2 md:gap-5">
                {acceptedRequests.map((request) => renderRequestCard(request, false))}
              </div>
            </div>
          )}
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() => dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default ProjectRequests;
