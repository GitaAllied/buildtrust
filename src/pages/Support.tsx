import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Logo from "../assets/Logo.png";
import {
  FaBriefcase,
  FaGear,
  FaMessage,
  FaMoneyBill,
  FaUpload,
  FaUser,
  FaDownload,
  FaDoorOpen,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";

const Support = () => {
  const [activeTab, setActiveTab] = useState("support");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [signOutModal, setSignOutModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [faqItems, setFaqItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // Fetch support categories and FAQ on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await apiClient.getCategories();
        setCategories(categoriesData || []);
        
        // Set first category as default if available
        if (categoriesData && categoriesData.length > 0) {
          setCategoryId(categoriesData[0].id);
        }
        
        // Fetch support settings for FAQ
        try {
          const settings = await apiClient.getSupportSettings();
          if (settings && settings.general_settings) {
            const generalSettings = JSON.parse(settings.general_settings);
            if (generalSettings.faq && Array.isArray(generalSettings.faq)) {
              setFaqItems(generalSettings.faq);
            }
          }
        } catch (e) {
          console.log('Using default FAQ');
        }
      } catch (err: any) {
        console.error('Error fetching support data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch tickets for developers
  useEffect(() => {
    const fetchTickets = async () => {
      if (user?.role === 'developer') {
        try {
          setTicketsLoading(true);
          const response = await apiClient.getTickets();
          // Handle both array response and paginated object response
          const ticketsData = Array.isArray(response) ? response : response?.tickets || [];
          setTickets(ticketsData || []);
        } catch (err: any) {
          console.error('Error fetching tickets:', err);
          toast({ 
            title: 'Error', 
            description: 'Failed to load support tickets', 
            variant: 'destructive' 
          });
        } finally {
          setTicketsLoading(false);
        }
      }
    };
    
    fetchTickets();
  }, [user?.role]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle ticket submission
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both subject and message",
        variant: "destructive",
      });
      return;
    }
    
    if (!categoryId) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (!user || !user.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      await apiClient.createTicket({
        user_id: user.id,
        subject: subject.trim(),
        description: message.trim(),
        category_id: categoryId,
      });
      
      // Success
      toast({
        title: "Success",
        description: "Support ticket created successfully. We'll get back to you soon.",
      });
      
      // Clear form
      setSubject("");
      setMessage("");
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
    } catch (err: any) {
      console.error('Error creating ticket:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create support ticket",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaUser />,
      active: true,
    },
    { id: "requests", label: "Project Requests", icon: <FaDownload /> },
    { id: "projects", label: "Active Projects", icon: <FaBriefcase /> },
    { id: "upload", label: "Upload Update", icon: <FaUpload /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
    { id: "profile", label: "Licenses & Profile", icon: <FaUser /> },
    { id: "support", label: "Support", icon: <FaGear /> },
  ];

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/developer-dashboard");
        break;
      case "requests":
        navigate("/project-requests");
        break;
      case "projects":
        navigate("/active-projects");
        break;
      case "upload":
        navigate("/upload-update");
        break;
      case "messages":
        navigate("/developer-messages");
        break;
      case "payments":
        navigate("/developer-payments");
        break;
      case "profile":
        navigate("/developer-liscences");
        break;
      case "support":
        navigate("/support");
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
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={'/'}><img src={Logo} alt="" /></Link>
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
                  Support Center
                </h1>
                <p className="text-gray-500">
                  Get help and support for your BuildTrust experience
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          {/* Support Tickets History - For Developers - Moved to Top */}
          {user?.role === "developer" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  My Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#253E44]"></div>
                  </div>
                ) : tickets && tickets.length > 0 ? (
                  <div className="space-y-4">
                    {tickets.slice(0, 3).map((ticket: any) => {
                      // Determine status color
                      const statusColors = {
                        'Open': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
                        'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700' },
                        'Resolved': { bg: 'bg-green-100', text: 'text-green-700' },
                        'Closed': { bg: 'bg-gray-100', text: 'text-gray-700' }
                      };
                      
                      const statusColor = statusColors[ticket.status as keyof typeof statusColors] || statusColors['Open'];
                      
                      // Format date
                      const createdDate = new Date(ticket.created_at);
                      const daysAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                      const dateStr = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

                      return (
                        <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-[#253E44]">{ticket.subject || ticket.title}</h3>
                                <span className={`px-2 py-1 ${statusColor.bg} ${statusColor.text} text-xs font-medium rounded`}>
                                  {ticket.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Category: {ticket.category_name || 'General'}</span>
                                <span>Opened: {dateStr}</span>
                                <span>Ticket #{ticket.id}</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/support/ticket/${ticket.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No support tickets yet</p>
                  </div>
                )}
              </CardContent>
              <div className="px-6 pb-4">
                {tickets && tickets.length > 3 && (
                  <Button 
                    className="w-full bg-[#253E44] hover:bg-[#253E44]/90"
                    onClick={() => navigate('/support')}
                  >
                    View All Tickets
                  </Button>
                )}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226F75]"
                      value={categoryId || ""}
                      onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                      disabled={loading}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      disabled={submitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#253E44] hover:bg-[#253E44]/70"
                    disabled={submitting || loading}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#253E44]" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">
                      +234 800 BUILD-TRUST
                    </p>
                    <p className="text-xs text-gray-500">
                      Mon-Fri, 9AM-6PM WAT
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#253E44]" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">
                      support@buildtrust.africa
                    </p>
                    <p className="text-xs text-gray-500">
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-[#253E44]" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-gray-600">
                      Available on website
                    </p>
                    <p className="text-xs text-gray-500">
                      Mon-Fri, 9AM-6PM WAT
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-[#226F75]" />
                  <span className="ml-2 text-gray-600">Loading FAQ...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqItems.length > 0 ? (
                    faqItems.map((item, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-medium mb-2">{item.question}</h3>
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">How do I submit a progress update?</h3>
                        <p className="text-sm text-gray-600">Go to 'Upload Update' in your dashboard, select your project, add description and upload photos/videos.</p>
                      </div>
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-2">When do I receive payments?</h3>
                        <p className="text-sm text-gray-600">Payments are released automatically when milestones are approved by the client.</p>
                      </div>
                      <div className="pb-4">
                        <h3 className="font-medium mb-2">How can I increase my trust score?</h3>
                        <p className="text-sm text-gray-600">Complete projects on time, maintain good communication, and collect positive reviews from clients.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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

export default Support;
