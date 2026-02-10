import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Download,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
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
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";

interface Milestone {
  name: string;
  amount: number;
  status: "paid" | "pending" | "upcoming";
  date: string;
}

interface Project {
  id: number;
  title: string;
  totalAmount: number;
  paidAmount: number;
  milestones: Milestone[];
}

interface Transaction {
  id: number;
  project: string;
  milestone: string;
  amount: number;
  date: string;
  status: string;
  method: string;
}

const Payments = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const [signOutModal, setSignOutModal] = useState(false);
  
  // Mock data for fallback
  const mockProjects: Project[] = [
    {
      id: 1,
      title: "Modern Duplex in Lekki",
      totalAmount: 8500000,
      paidAmount: 4300000,
      milestones: [
        { name: "Foundation", amount: 2800000, status: "paid", date: "2024-10-15" },
        { name: "Block Work", amount: 1500000, status: "paid", date: "2024-11-02" },
        { name: "Roofing", amount: 3200000, status: "pending", date: "2024-12-01" },
        { name: "Finishing", amount: 1000000, status: "upcoming", date: "2025-01-15" },
      ],
    },
    {
      id: 2,
      title: "Commercial Plaza",
      totalAmount: 25000000,
      paidAmount: 5000000,
      milestones: [
        { name: "Site Preparation", amount: 5000000, status: "paid", date: "2024-11-10" },
        { name: "Foundation", amount: 8000000, status: "pending", date: "2024-12-15" },
        { name: "Structure", amount: 12000000, status: "upcoming", date: "2025-03-01" },
      ],
    },
  ];

  const mockTransactions: Transaction[] = [
    { id: 1, project: "Modern Duplex", milestone: "Block Work", amount: 1500000, date: "2024-11-02", status: "completed", method: "Bank Transfer" },
    { id: 2, project: "Modern Duplex", milestone: "Foundation", amount: 2800000, date: "2024-10-15", status: "completed", method: "Bank Transfer" },
    { id: 3, project: "Commercial Plaza", milestone: "Site Preparation", amount: 5000000, date: "2024-11-10", status: "completed", method: "Wire Transfer" },
  ];

  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [loading, setLoading] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  
  // Payment method modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentMethodsList, setPaymentMethodsList] = useState<any[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string,string>>({});
  const [editingMethodId, setEditingMethodId] = useState<number | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Load projects data on mount
  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        setLoading(true);
        setIsUsingMockData(false);
        
        console.log('📊 Fetching payment data from API...');
        
        // Try to fetch from payments endpoint first
        try {
          const paymentResponse = await apiClient.getPaymentsSummary();
          
          if (paymentResponse && paymentResponse.projects && Array.isArray(paymentResponse.projects)) {
            console.log(`✅ Loaded ${paymentResponse.projects.length} projects from payments API`);
            
            setProjects(paymentResponse.projects);
            
            // Use transactions from API or generate from projects
            if (paymentResponse.transactions && Array.isArray(paymentResponse.transactions)) {
              setTransactions(paymentResponse.transactions);
            } else {
              // Generate transactions from project data
              const generatedTransactions: Transaction[] = paymentResponse.projects.flatMap(proj =>
                proj.milestones
                  .filter((m: any) => m.status === 'paid')
                  .map((m: any, idx: number) => ({
                    id: proj.id * 1000 + idx,
                    project: proj.title,
                    milestone: m.name,
                    amount: m.amount,
                    date: m.date,
                    status: 'completed',
                    method: idx % 2 === 0 ? 'Bank Transfer' : 'Wire Transfer',
                  }))
              );
              setTransactions(generatedTransactions);
            }
            
            // Use summary from API or calculate
            if (paymentResponse.summary) {
              setTotalInvested(paymentResponse.summary.totalInvested);
              setPendingPayments(paymentResponse.summary.pendingPayments);
            } else {
              const { total, pending } = calculateTotals(paymentResponse.projects);
              setTotalInvested(total);
              setPendingPayments(pending);
            }
            
            return;
          }
        } catch (paymentError) {
          console.log('⚠️ Payments endpoint not available, trying projects endpoint...');
        }
        
        // Fallback to projects endpoint
        const projectsResponse = await apiClient.getClientProjects();
        
        // Check if API returned valid data
        if (!projectsResponse || !Array.isArray(projectsResponse) || projectsResponse.length === 0) {
          console.log('⚠️ No projects from API, using mock data');
          setIsUsingMockData(true);
          setProjects(mockProjects);
          setTransactions(mockTransactions);
          const { total, pending } = calculateTotals(mockProjects);
          setTotalInvested(total);
          setPendingPayments(pending);
          setLoading(false);
          return;
        }
        
        // Transform API response to match our interface
        const projectsData: Project[] = projectsResponse.map((proj: any) => {
          const totalAmount = proj.budget || proj.total_amount || 0;
          const paidAmount = proj.amount_paid || proj.paid_amount || 0;
          
          // Parse milestones if they exist
          let milestones: Milestone[] = [];
          if (proj.milestones) {
            try {
              const parsedMilestones = typeof proj.milestones === 'string' 
                ? JSON.parse(proj.milestones)
                : proj.milestones;
              
              if (Array.isArray(parsedMilestones)) {
                milestones = parsedMilestones.map((m: any) => ({
                  name: m.name || 'Milestone',
                  amount: m.amount || 0,
                  status: m.status === 'completed' ? 'paid' : m.status === 'in_progress' ? 'pending' : 'upcoming',
                  date: m.date || new Date().toISOString().split('T')[0],
                }));
              }
            } catch (e) {
              console.error('❌ Error parsing milestones:', e);
            }
          }
          
          return {
            id: proj.id,
            title: proj.title || 'Untitled Project',
            totalAmount,
            paidAmount,
            milestones: milestones.length > 0 ? milestones : [
              { name: 'Initial Payment', amount: totalAmount * 0.3, status: 'paid' as const, date: proj.created_at?.split('T')[0] || new Date().toISOString().split('T')[0] },
              { name: 'Mid-way Payment', amount: totalAmount * 0.4, status: 'pending' as const, date: new Date().toISOString().split('T')[0] },
              { name: 'Final Payment', amount: totalAmount * 0.3, status: 'upcoming' as const, date: new Date().toISOString().split('T')[0] },
            ],
          };
        });
        
        console.log(`✅ Loaded ${projectsData.length} projects from projects endpoint`);
        setProjects(projectsData);
        
        // Calculate totals
        const { total, pending } = calculateTotals(projectsData);
        setTotalInvested(total);
        setPendingPayments(pending);
        
        // Create transactions from project data
        const generatedTransactions: Transaction[] = projectsData.flatMap(proj =>
          proj.milestones
            .filter(m => m.status === 'paid')
            .map((m, idx) => ({
              id: proj.id * 1000 + idx,
              project: proj.title,
              milestone: m.name,
              amount: m.amount,
              date: m.date,
              status: 'completed',
              method: idx % 2 === 0 ? 'Bank Transfer' : 'Wire Transfer',
            }))
        );
        setTransactions(generatedTransactions);
        
      } catch (error) {
        console.error('❌ Error loading payment data:', error);
        console.log('📦 Falling back to mock data due to API error');
        
        // Use mock data as fallback
        setIsUsingMockData(true);
        setProjects(mockProjects);
        setTransactions(mockTransactions);
        const { total, pending } = calculateTotals(mockProjects);
        setTotalInvested(total);
        setPendingPayments(pending);
        
        toast({
          title: 'Using Demo Data',
          description: 'Could not fetch live data. Showing sample information.',
          variant: 'default',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadPaymentData();

      // Fetch saved payment methods for the user
      (async () => {
        try {
          const res = await apiClient.getPaymentMethods();
          if (res && res.methods) setPaymentMethodsList(res.methods);
        } catch (e) {
          console.warn('Could not load payment methods', e);
        }
      })();
    }
  }, [user, toast]);

  // Helper function to calculate totals
  const calculateTotals = (projectsData: Project[]) => {
    const total = projectsData.reduce((sum, proj) => sum + proj.paidAmount, 0);
    const pending = projectsData.reduce((sum, proj) => {
      return sum + proj.milestones
        .filter(m => m.status === 'pending')
        .reduce((mSum, m) => mSum + m.amount, 0);
    }, 0);
    return { total, pending };
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleAddPaymentMethod = async () => {
    // client-side validation with inline errors
    const errors: Record<string,string> = {};
    const digits = paymentMethod.cardNumber.replace(/\D/g, '');
    
    if (!paymentMethod.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
    
    // Only validate card details when adding new method, not when editing
    if (!editingMethodId) {
      if (!digits || digits.length < 13) errors.cardNumber = 'Valid card number is required';
      if (!paymentMethod.expiryDate.match(/^\d{2}\/\d{2}$/)) errors.expiryDate = 'Expiry date must be MM/YY format';
      if (!paymentMethod.cvv || paymentMethod.cvv.length < 3) errors.cvv = 'Valid CVV is required';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmittingPayment(true);
    try {
      if (editingMethodId) {
        // Update existing method (only cardholder name supported)
        const res = await apiClient.updatePaymentMethod(editingMethodId, { cardholderName: paymentMethod.cardholderName });
        toast({ title: 'Success', description: 'Payment method updated' });
        setEditingMethodId(null);
      } else {
        // Add new method via API
        await apiClient.addPaymentMethod({
          cardholderName: paymentMethod.cardholderName,
          cardNumber: digits,
          expiryDate: paymentMethod.expiryDate,
          cvv: paymentMethod.cvv,
        });
        toast({ title: 'Success', description: `Payment method added for ${paymentMethod.cardholderName}` });
      }

      // Refresh list
      try {
        const methodsRes = await apiClient.getPaymentMethods();
        if (methodsRes && methodsRes.methods) setPaymentMethodsList(methodsRes.methods);
      } catch (e) {
        console.warn('Could not refresh methods after add/update', e);
      }

      // Reset form
      setPaymentMethod({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });
      setFormErrors({});
      setShowPaymentModal(false);
    } catch (error: any) {
      console.error('Error adding/updating payment method', error);
      toast({ title: 'Error', description: error?.message || 'Failed to add payment method', variant: 'destructive' });
    } finally {
      setSubmittingPayment(false);
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                    Payments & Escrow
                  </h1>
                  {isUsingMockData && (
                    <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800 text-xs">
                      Demo Data
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                  {isUsingMockData ? "Sample information for demonstration" : "Manage your project payments and milestones"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === "overview"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("transactions")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === "transactions"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveSection("methods")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === "methods"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Payment Methods
            </button>
          </div>

          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-600">
                      Total Invested
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "Loading..." : formatAmount(totalInvested)}
                    </p>
                    <p className="text-sm text-green-600">
                      Across {projects.length} project{projects.length !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-600">
                      Pending Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">
                      {loading ? "Loading..." : formatAmount(pendingPayments)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {projects.reduce((count, proj) => 
                        count + proj.milestones.filter(m => m.status === 'pending').length, 0
                      )} milestone{projects.reduce((count, proj) => 
                        count + proj.milestones.filter(m => m.status === 'pending').length, 0) !== 1 ? 's' : ''} due
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-600">
                      Active Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {projects.length}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatAmount(projects.reduce((sum, p) => sum + p.totalAmount, 0))} total value
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Project Payment Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Project Payment Status
                </h2>
                {loading ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">Loading projects...</p>
                    </CardContent>
                  </Card>
                ) : projects.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No projects yet</p>
                      <Button className="mt-4 bg-[#253E44]" onClick={() => navigate("/projects")}>
                        View Projects
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {project.title}
                          </CardTitle>
                          <Badge variant="outline">
                            {Math.round(
                              (project.paidAmount / project.totalAmount) * 100
                            )}
                            % Complete
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>
                            Progress: {formatAmount(project.paidAmount)} of{" "}
                            {formatAmount(project.totalAmount)}
                          </span>
                          <span>
                            {Math.round(
                              (project.paidAmount / project.totalAmount) * 100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={(project.paidAmount / project.totalAmount) * 100}
                          className="h-2"
                        />

                        <div className="space-y-2">
                          {project.milestones.map((milestone, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                {milestone.status === "paid" && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                                {milestone.status === "pending" && (
                                  <Clock className="h-5 w-5 text-orange-500" />
                                )}
                                {milestone.status === "upcoming" && (
                                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                )}
                                <div>
                                  <p className="font-medium">{milestone.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {milestone.date}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {formatAmount(milestone.amount)}
                                </p>
                                <Badge
                                  variant={
                                    milestone.status === "paid"
                                      ? "default"
                                      : milestone.status === "pending"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className={
                                    milestone.status === "paid"
                                      ? "bg-green-600"
                                      : ""
                                  }
                                >
                                  {milestone.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSection === "transactions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Create CSV from transactions
                    const csv = [
                      ['Date', 'Project', 'Milestone', 'Amount', 'Method', 'Status'],
                      ...transactions.map(t => [
                        t.date,
                        t.project,
                        t.milestone,
                        t.amount.toString(),
                        t.method,
                        t.status
                      ])
                    ].map(row => row.join(',')).join('\n');
                    
                    // Create download link
                    const element = document.createElement('a');
                    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                    element.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    
                    toast({
                      title: 'Success',
                      description: 'Transactions exported successfully',
                    });
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    {loading ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>Loading transactions...</p>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>No transactions yet</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Project
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Milestone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Method
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {transaction.date}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {transaction.project}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {transaction.milestone}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {formatAmount(transaction.amount)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {transaction.method}
                              </td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-600">
                                  {transaction.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "methods" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Saved Payment Methods</h2>
                <Button 
                  className="bg-[#253E44] hover:bg-[#253E44]/90"
                  onClick={() => {
                    setEditingMethodId(null);
                    setPaymentMethod({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });
                    setFormErrors({});
                    setShowPaymentModal(true);
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>

              {paymentMethodsList.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 mb-4">No payment methods saved yet</p>
                    <Button 
                      className="bg-[#253E44] hover:bg-[#253E44]/90"
                      onClick={() => {
                        setEditingMethodId(null);
                        setPaymentMethod({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });
                        setFormErrors({});
                        setShowPaymentModal(true);
                      }}
                    >
                      Add Your First Payment Method
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethodsList.map((method) => (
                    <Card key={method.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            {method.cardholder_name}
                          </CardTitle>
                          {method.is_default ? (
                            <Badge className="bg-green-600">Default</Badge>
                          ) : null}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">Card Number</p>
                          <p className="text-sm font-mono">•••• •••• •••• {method.last4}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Expires</p>
                            <p className="text-sm">{String(method.exp_month).padStart(2, '0')}/{String(method.exp_year).slice(-2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Added</p>
                            <p className="text-sm">{new Date(method.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setEditingMethodId(method.id);
                              setPaymentMethod({ cardholderName: method.cardholder_name, cardNumber: '', expiryDate: '', cvv: '' });
                              setFormErrors({});
                              setShowPaymentModal(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:text-red-700"
                            onClick={async () => {
                              if (confirm('Delete this payment method?')) {
                                try {
                                  await apiClient.deletePaymentMethod(method.id);
                                  toast({ title: 'Success', description: 'Payment method deleted' });
                                  const methodsRes = await apiClient.getPaymentMethods();
                                  if (methodsRes && methodsRes.methods) setPaymentMethodsList(methodsRes.methods);
                                } catch (e: any) {
                                  toast({ title: 'Error', description: e?.message || 'Failed to delete', variant: 'destructive' });
                                }
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {editingMethodId ? 'Edit Payment Method' : 'Add Payment Method'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={paymentMethod.cardholderName}
                  onChange={(e) =>
                    setPaymentMethod({
                      ...paymentMethod,
                      cardholderName: e.target.value,
                    })
                  }
                  disabled={submittingPayment}
                />
                {formErrors.cardholderName && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.cardholderName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentMethod.cardNumber}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\s/g, '');
                    value = value.replace(/(\d{4})/g, '$1 ').trim();
                    setPaymentMethod({
                      ...paymentMethod,
                      cardNumber: value,
                    });
                  }}
                  disabled={submittingPayment || !!editingMethodId}
                  maxLength={19}
                />
                {formErrors.cardNumber && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry (MM/YY)</Label>
                  <Input
                    id="expiryDate"
                    placeholder="12/25"
                    value={paymentMethod.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setPaymentMethod({
                        ...paymentMethod,
                        expiryDate: value,
                      });
                    }}
                    disabled={submittingPayment || !!editingMethodId}
                    maxLength={5}
                  />
                  {formErrors.expiryDate && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={paymentMethod.cvv}
                    onChange={(e) =>
                      setPaymentMethod({
                        ...paymentMethod,
                        cvv: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    disabled={submittingPayment || !!editingMethodId}
                    maxLength={4}
                  />
                  {formErrors.cvv && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.cvv}</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500">
                🔒 Your payment information is secure and encrypted
              </p>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={submittingPayment}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPaymentMethod}
                  disabled={submittingPayment}
                  className="flex-1 bg-[#253E44] hover:bg-[#253E44]/90"
                >
                  {submittingPayment ? (editingMethodId ? 'Updating...' : 'Adding...') : (editingMethodId ? 'Update Method' : 'Add Payment Method')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sign Out Modal */}
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() => setSignOutModal(false)}
        />
      )}
    </div>
  );
};

export default Payments;
