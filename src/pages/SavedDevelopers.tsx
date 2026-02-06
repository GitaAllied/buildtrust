import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MessageSquare, Heart, Menu, X, Loader2 } from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaDoorOpen,
  FaFileContract,
  FaGear,
  FaMessage,
  FaMoneyBill,
  FaUser,
  FaUserGear,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import { apiClient } from "@/lib/api";

const SavedDevelopers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("saved");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [signOutModal, setSignOutModal] = useState(false);
  const [savedDevelopers, setSavedDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Fetch saved developers on mount
  useEffect(() => {
    const fetchSavedDevelopers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getSavedDevelopers();
        setSavedDevelopers(data || []);
      } catch (err: any) {
        console.error('Error fetching saved developers:', err);
        setError(err.message || 'Failed to load saved developers');
        toast({
          title: "Error",
          description: "Failed to load saved developers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDevelopers();
  }, [toast]);

  // Handle unsave developer
  const handleUnsave = async (developerId: number) => {
    try {
      setRemovingId(developerId);
      await apiClient.unsaveDeveloper(developerId);
      setSavedDevelopers(prev => prev.filter(dev => dev.developer_id !== developerId));
      toast({
        title: "Removed",
        description: "Developer removed from your saved list",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to remove developer",
        variant: "destructive",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
    { id: "projects", label: "Projects", icon: <FaBriefcase /> },
    { id: "payments", label: "Payments", icon: <FaMoneyBill />, active: true },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "contracts", label: "Contracts", icon: <FaFileContract /> },
    { id: "saved", label: "Saved Developers", icon: <FaUserGear /> },
    { id: "settings", label: "Settings", icon: <FaGear /> },
  ];

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/client-dashboard");
        break;
      case "projects":
        navigate("/projects");
        break;
      case "payments":
        navigate("/payments");
        break;
      case "messages":
        navigate("/messages");
        break;
      case "contracts":
        navigate("/contracts");
        break;
      case "saved":
        navigate("/saved-developers");
        break;
      case "settings":
        navigate("/settings");
        break;
        case "logout":
        handleLogout();
        break;
      default:
        navigate("/browse");
    }
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <Link to={'/'}><img src={Logo} alt="Build Trust Africa Logo" /></Link>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-[#226F75]" />
          ) : (
            <Menu className="h-5 w-5 text-[#226F75]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed top-14 md:top-0 left-0 right-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}
      >
        <div className=" h-full flex flex-col justify-start md:justify-between">
          <div>
            {/* logo */}
            <div className="p-4 sm:pb-2 sm:p-6 hidden md:block">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
              >
                <Link to={"/"}>
                  <img src={Logo} alt="" className="w-[55%]" />
                </Link>
              </button>
            </div>
            {/* nav links */}
            <nav className="p-3 sm:p-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavigation(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 text-[#226F75] border-[#226F75]"
                      : "text-gray-600 hover:bg-[#226F75]/5 hover:text-[#226F75]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Signout Button */}
          <div className="p-3 sm:p-4">
            <button
              onClick={() => {
                setSignOutModal(true);
              }}
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center text-red-500"
            >
              <FaDoorOpen />
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="md:text-2xl font-bold text-gray-900">
                  Saved Developers
                </h1>
                <p className="text-gray-500">
                  Your favorite developers for future projects
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#226F75] mb-4" />
              <p className="text-gray-600">Loading your saved developers...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-[#226F75] hover:bg-[#226F75]/70"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && savedDevelopers.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Saved Developers Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start exploring developers and save your favorites for future projects
                </p>
                <Button
                  className="bg-[#226F75] hover:bg-[#226F75]/70"
                  onClick={() => navigate("/browse")}
                >
                  Browse Developers
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Saved Developers List */}
          {!loading && !error && savedDevelopers.length > 0 && (
            <div className="grid gap-6">
              {savedDevelopers.map((developer) => (
                <Card
                  key={developer.developer_id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6 md:flex md:gap-4">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src={developer.avatar} />
                      <AvatarFallback>
                        {developer.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-start space-x-4 w-full mt-4 md:mt-0">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">
                            {developer.name}
                          </h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={removingId === developer.developer_id}
                            onClick={() => handleUnsave(developer.developer_id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            {removingId === developer.developer_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Heart className="h-4 w-4 fill-current" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          {developer.location || "Location not specified"}
                        </p>

                        <div className="flex items-center space-x-4 mb-4 flex-wrap gap-2">
                          {developer.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {developer.rating}
                              </span>
                            </div>
                          )}
                          {developer.completed_projects && (
                            <span className="text-sm text-gray-500">
                              {developer.completed_projects} projects completed
                            </span>
                          )}
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            className="bg-[#226F75] hover:bg-[#226F75]/70"
                            onClick={() => navigate(`/developer/${developer.developer_id}`)}
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate("/messages")}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() => setSignOutModal(false)}
        />
      )}
    </div>
  );
};

export default SavedDevelopers;
