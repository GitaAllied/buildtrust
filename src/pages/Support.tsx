import { useState } from "react";
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
} from "lucide-react";
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

const Support = () => {
  const [activeTab, setActiveTab] = useState("support");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
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

  const faqItems = [
    {
      question: "How do I submit a progress update?",
      answer:
        "Go to 'Upload Update' in your dashboard, select your project, add description and upload photos/videos.",
    },
    {
      question: "When do I receive payments?",
      answer:
        "Payments are released automatically when milestones are approved by the client.",
    },
    {
      question: "How can I increase my trust score?",
      answer:
        "Complete projects on time, maintain good communication, and collect positive reviews from clients.",
    },
  ];

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
        <div className=" h-full flex flex-col justify-between">
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
                handleLogout();
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
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
                  />
                </div>

                <Button className="w-full bg-[#253E44] hover:bg-[#253E44]/70">
                  Send Message
                </Button>
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
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-medium mb-2">{item.question}</h3>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
