import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
import {
  FaBook,
  FaDoorOpen,
  FaGear,
  FaHandshake,
  FaMessage,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, Settings, TestTube, ArrowLeft, Eye, EyeOff, Database, MessageSquare, Smartphone, Shield, Mail, Bell, Lock, Globe, X, Menu, AlertTriangle, CreditCard, DollarSign, Key} from "lucide-react";
import { Link } from "react-router-dom";


const AdminSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
    { id: "users", label: "User Management", icon: <FaUsers /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "reports", label: "Reports", icon: <FaBook /> },
    {
      id: "settings",
      label: "Settings",
      icon: <FaGear />,
      active: true,
    },
    { id: "support", label: "Support", icon: <FaHandshake /> },
    { id: "logout", label: "Sign Out", action: "logout", icon: <FaDoorOpen /> },
  ];
  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate("/super-admin-dashboard");
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "messages":
        navigate("/admin/messages");
        break;
      case "reports":
        navigate("/admin/reports");
        break;
      case "settings":
        navigate("/admin/settings");
        break;
      case "support":
        navigate("/admin/support");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        navigate("/super-admin-dashboard");
    }
  };

  const settingsCategories = [
    {
      id: "general",
      label: "General",
      description:
        "Site configuration, localization, and basic platform settings",
      icon: Globe,
      path: "/admin/settings/general",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "security",
      label: "Security",
      description: "Authentication, access control, and data protection",
      icon: Shield,
      path: "/admin/settings/security",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "password",
      label: "Password",
      description: "Update administrator password and security credentials",
      icon: Lock,
      path: "/admin/settings/password",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "email",
      label: "Email",
      description:
        "SMTP settings, email templates, and notification preferences",
      icon: Mail,
      path: "/admin/settings/email",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "payment",
      label: "Payment",
      description: "Payment gateways, escrow, fees, and transaction limits",
      icon: CreditCard,
      path: "/admin/settings/payment",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "notifications",
      label: "Notification",
      description: "System alerts, email/SMS/push notification configuration",
      icon: Bell,
      path: "/admin/settings/notifications",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const handleNavigateToSetting = (path: string) => {
    navigate(path);
  };

  const [activeSection, setActiveSection] = useState("general");

  // GENERAL
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "BuildTrust Africa",
    siteDescription: "Connecting verified developers with clients across Africa",
    contactEmail: "admin@buildtrust.africa",
    supportEmail: "support@buildtrust.africa",
    companyAddress: "Lagos, Nigeria",
    phoneNumber: "+234 xxx xxx xxxx",
    timezone: "Africa/Lagos",
    language: "en",
    dateFormat: "DD/MM/YYYY",
    currency: "NGN",
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxProjectsPerUser: 10,
    maxFileSize: 50,
    sessionTimeout: 30
  });

  const handleGeneralSettingChange = (key: string, value: any) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGeneralSaveSettings = () => {
    // In a real app, this would save to backend
    console.log("Saving general settings:", settings);
    alert("General settings saved successfully!");
  };

  // SECURITY
  const [securitySettings, setSecuritySettings] = useState({
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSpecialChars: false,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      twoFactorRequired: false,
      sessionTimeout: 30,
      ipWhitelistEnabled: false,
      ipWhitelist: "",
      bruteForceProtection: true,
      rateLimitingEnabled: true,
      apiRateLimit: 100,
      encryptionMethod: "AES256",
      backupEncryption: true,
      auditLogging: true,
      suspiciousActivityAlerts: true
    });
  
    const [showSecurityPasswords, setShowSecurityPasswords] = useState({
      adminPassword: false,
      apiKey: false
    });
  
    const handleSecuritySettingChange = (key: string, value: any) => {
      setSecuritySettings(prev => ({
        ...prev,
        [key]: value
      }));
    };
  
    const handleSecuritySaveSettings = () => {
      // In a real app, this would save to backend
      console.log("Saving security settings:", settings);
      alert("Security settings saved successfully!");
    };
  
    const toggleSecurityPasswordVisibility = (field: string) => {
      setShowPasswords(prev => ({
        ...prev,
        [field]: !prev[field as keyof typeof prev]
      }));
    };

  // PASSWORD
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would make an API call to change the password
      console.log("Changing password:", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert("Password changed successfully! You will be logged out and need to log in with your new password.");

      // In a real app, you would log out the user here
      // navigate('/auth');

    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    if (!password) return { level: 0, text: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z\d]/.test(password)) score++;

    if (score <= 2) return { level: 1, text: "Weak", color: "text-red-600" };
    if (score <= 3) return { level: 2, text: "Fair", color: "text-yellow-600" };
    if (score <= 4) return { level: 3, text: "Good", color: "text-blue-600" };
    return { level: 4, text: "Strong", color: "text-green-600" };
  };

  const strength = passwordStrength(formData.newPassword);

  // EMAIL  
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    smtpEncryption: "tls",
    fromEmail: "noreply@buildtrust.africa",
    fromName: "BuildTrust Africa",
    replyToEmail: "support@buildtrust.africa",
    emailVerificationEnabled: true,
    welcomeEmailEnabled: true,
    passwordResetEnabled: true,
    projectNotificationsEnabled: true,
    paymentNotificationsEnabled: true,
    adminNotificationsEnabled: true,
    emailQueueEnabled: true,
    maxEmailsPerHour: 1000,
    bounceHandlingEnabled: true
  });

  const handleEmailSettingChange = (key: string, value: any) => {
    setEmailSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEmailSaveSettings = () => {
    // In a real app, this would save to backend
    console.log("Saving email settings:", settings);
    alert("Email settings saved successfully!");
  };
    const [showPassword, setShowPassword] = useState(false);
    const [testEmail, setTestEmail] = useState("");
  
    const handleTestEmail = () => {
      if (!testEmail) {
        alert("Please enter a test email address");
        return;
      }
      // In a real app, this would send a test email
      console.log("Sending test email to:", testEmail);
      alert(`Test email sent to ${testEmail}`);
    };

  // PAYMENT
  const [paymentSettings, setPaymentSettings] = useState({
    primaryGateway: "flutterwave",
    flutterwavePublicKey: "",
    flutterwaveSecretKey: "",
    flutterwaveEncryptionKey: "",
    paypalClientId: "",
    paypalClientSecret: "",
    stripePublishableKey: "",
    stripeSecretKey: "",
    escrowEnabled: true,
    escrowPercentage: 10,
    platformFee: 5,
    minimumProjectAmount: 1000,
    maximumProjectAmount: 1000000,
    currency: "NGN",
    autoReleaseEscrow: false,
    escrowReleaseDays: 7,
    disputeResolutionEnabled: true,
    refundPolicyEnabled: true,
    paymentRetries: 3,
    webhookSecret: ""
  });

  const [showKeys, setShowKeys] = useState({
    flutterwaveSecret: false,
    flutterwaveEncryption: false,
    paypalSecret: false,
    stripeSecret: false,
    webhookSecret: false
  });

  const handlePaymentSettingChange = (key: string, value: any) => {
    setPaymentSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePaymentSaveSettings = () => {
    // In a real app, this would save to backend
    console.log("Saving payment settings:", settings);
    alert("Payment settings saved successfully!");
  };

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  // NOTIFICATIONS
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newUserRegistration: true,
    projectCreated: true,
    paymentReceived: true,
    projectCompleted: true,
    disputeRaised: true,
    adminAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    systemAlerts: true,
    securityAlerts: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    twilioSid: "",
    twilioToken: "",
    fcmServerKey: ""
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving notification settings:", settings);
    alert("Notification settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
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
        <div className="p-4 sm:p-6 border-b border-white/20 hidden md:block">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full"
          >
            <Link to={'/'}><img src={Logo} alt="" className="w-[55%]" /></Link>
          </button>
        </div>
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
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="block">
                  <h1 className="md:text-2xl font-bold text-gray-900">
                    System Settings
                  </h1>
                  <p className="text-sm text-gray-500">
                    Configure and manage all platform settings
                  </p>
                </div>
              </div>
            </div>
        </div>
        <div className="w-full flex-1 min-h-screen bg-gray-50 flex flex-col">
          <div className="flex flex-col">
            {/* Sidebar */}
            <div className=" bg-[#226F75]/10 w-[95%] m-auto rounded-lg overflow-x-scroll scrollbar-custom my-5">
              <nav className="p-2 text-sm flex justify-around items-center gap-2">
                {settingsCategories.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 justify-center px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? "bg-[#226F75]/10 text-[#253E44] font-medium"
                          : "text-gray-600 hover:bg-[#226F75]/20"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full p-6">
              {/* GENERAL */}
              {activeSection === "general" && (
                <div className="min-h-screen bg-gray-50">
                  <div className=" mx-auto pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Site Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Globe className="h-5 w-5" />
                            <span>Site Information</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="siteName"
                              className="text-xs sm:text-right"
                            >
                              Site Name
                            </Label>
                            <Input
                              id="siteName"
                              value={generalSettings.siteName}
                              onChange={(e) =>
                                handleGeneralSettingChange("siteName", e.target.value)
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="siteDescription"
                              className="text-xs sm:text-right"
                            >
                              Description
                            </Label>
                            <Textarea
                              id="siteDescription"
                              value={generalSettings.siteDescription}
                              onChange={(e) =>
                                handleGeneralSettingChange(
                                  "siteDescription",
                                  e.target.value,
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="contactEmail"
                              className="text-xs sm:text-right"
                            >
                              Contact Email
                            </Label>
                            <Input
                              id="contactEmail"
                              type="email"
                              value={generalSettings.contactEmail}
                              onChange={(e) =>
                                handleGeneralSettingChange(
                                  "contactEmail",
                                  e.target.value,
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="supportEmail"
                              className="text-xs sm:text-right"
                            >
                              Support Email
                            </Label>
                            <Input
                              id="supportEmail"
                              type="email"
                              value={generalSettings.supportEmail}
                              onChange={(e) =>
                                handleGeneralSettingChange(
                                  "supportEmail",
                                  e.target.value,
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="phoneNumber"
                              className="text-xs sm:text-right"
                            >
                              Phone Number
                            </Label>
                            <Input
                              id="phoneNumber"
                              value={generalSettings.phoneNumber}
                              onChange={(e) =>
                                handleGeneralSettingChange(
                                  "phoneNumber",
                                  e.target.value,
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="companyAddress"
                              className="text-xs sm:text-right"
                            >
                              Address
                            </Label>
                            <Input
                              id="companyAddress"
                              value={generalSettings.companyAddress}
                              onChange={(e) =>
                                handleGeneralSettingChange(
                                  "companyAddress",
                                  e.target.value,
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* System Configuration */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Settings className="h-5 w-5" />
                            <span>System Configuration</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="timezone"
                              className="text-xs sm:text-right"
                            >
                              Timezone
                            </Label>
                            <Select
                              value={generalSettings.timezone}
                              onValueChange={(value) =>
                                handleGeneralSettingChange("timezone", value)
                              }
                            >
                              <SelectTrigger className="sm:col-span-3 text-xs md:text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Africa/Lagos">
                                  West Africa Time (WAT)
                                </SelectItem>
                                <SelectItem value="Africa/Nairobi">
                                  East Africa Time (EAT)
                                </SelectItem>
                                <SelectItem value="Africa/Johannesburg">
                                  South Africa Time (SAST)
                                </SelectItem>
                                <SelectItem value="UTC">UTC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="language" className="text-xs sm:text-right">
                              Language
                            </Label>
                            <Select
                              value={generalSettings.language}
                              onValueChange={(value) =>
                                handleGeneralSettingChange("language", value)
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="pt">Portuguese</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="dateFormat" className="text-xs sm:text-right">
                              Date Format
                            </Label>
                            <Select
                              value={generalSettings.dateFormat}
                              onValueChange={(value) =>
                                handleGeneralSettingChange("dateFormat", value)
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DD/MM/YYYY">
                                  DD/MM/YYYY
                                </SelectItem>
                                <SelectItem value="MM/DD/YYYY">
                                  MM/DD/YYYY
                                </SelectItem>
                                <SelectItem value="YYYY-MM-DD">
                                  YYYY-MM-DD
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="currency" className="text-xs sm:text-right">
                              Currency
                            </Label>
                            <Select
                              value={generalSettings.currency}
                              onValueChange={(value) =>
                                handleGeneralSettingChange("currency", value)
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NGN">
                                  Nigerian Naira (₦)
                                </SelectItem>
                                <SelectItem value="USD">
                                  US Dollar ($)
                                </SelectItem>
                                <SelectItem value="EUR">Euro (€)</SelectItem>
                                <SelectItem value="GBP">
                                  British Pound (£)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      {/* User Limits */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>User Limits & Security</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="maxProjectsPerUser"
                              className="text-xs sm:text-right"
                            >
                              Max Projects/User
                            </Label>
                            <Input
                              id="maxProjectsPerUser"
                              type="number"
                              value={generalSettings.maxProjectsPerUser}
                              onChange={(e) =>
                                handleGeneralSettingChange(
                                  "maxProjectsPerUser",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="maxFileSize" className="text-xs sm:text-right">
                              Max File Size (MB)
                            </Label>
                            <Input
                              id="maxFileSize"
                              type="number"
                              value={generalSettings.maxFileSize}
                              onChange={(e) =>
                                handleGeneralSettingChange(
                                  "maxFileSize",
                                  parseInt(e.target.value),
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="sessionTimeout"
                              className="text-xs sm:text-right"
                            >
                              Session Timeout (min)
                            </Label>
                            <Input
                              id="sessionTimeout"
                              type="number"
                              value={generalSettings.sessionTimeout}
                              onChange={(e) =>
                                handleGeneralSettingChange(
                                  "sessionTimeout",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* System Status */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Database className="h-5 w-5" />
                            <span>System Status</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="registrationEnabled"
                              className="text-sm font-medium"
                            >
                              User Registration
                            </Label>
                            <Switch
                              id="registrationEnabled"
                              checked={generalSettings.registrationEnabled}
                              onCheckedChange={(checked) =>
                                handleGeneralSettingChange(
                                  "registrationEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="emailVerificationRequired"
                              className="text-sm font-medium"
                            >
                              Email Verification Required
                            </Label>
                            <Switch
                              id="emailVerificationRequired"
                              checked={generalSettings.emailVerificationRequired}
                              onCheckedChange={(checked) =>
                                handleGeneralSettingChange(
                                  "emailVerificationRequired",
                                  checked,
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleGeneralSaveSettings}
                        className="bg-[#253E44] hover:bg-[#253E44]/70"
                      >
                        Save General Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {/* SECURITY */}
              {activeSection === "security" && (
                <div className="min-h-screen bg-gray-50">
                  <div className="mx-auto py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Password Policy */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Key className="h-5 w-5" />
                            <span>Password Policy</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="passwordMinLength"
                              className="text-xs sm:text-right"
                            >
                              Min Length
                            </Label>
                            <Input
                              id="passwordMinLength"
                              type="number"
                              value={securitySettings.passwordMinLength}
                              onChange={(e) =>
                                handleSecuritySettingChange(
                                  "passwordMinLength",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="6"
                              max="32"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="passwordRequireUppercase"
                              className="text-sm font-medium"
                            >
                              Require Uppercase Letters
                            </Label>
                            <Switch
                              id="passwordRequireUppercase"
                              checked={securitySettings.passwordRequireUppercase}
                              onCheckedChange={(checked) =>
                                handleSettingChange(
                                  "passwordRequireUppercase",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="passwordRequireLowercase"
                              className="text-sm font-medium"
                            >
                              Require Lowercase Letters
                            </Label>
                            <Switch
                              id="passwordRequireLowercase"
                              checked={securitySettings.passwordRequireLowercase}
                              onCheckedChange={(checked) =>
                                handleSettingChange(
                                  "passwordRequireLowercase",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="passwordRequireNumbers"
                              className="text-sm font-medium"
                            >
                              Require Numbers
                            </Label>
                            <Switch
                              id="passwordRequireNumbers"
                              checked={securitySettings.passwordRequireNumbers}
                              onCheckedChange={(checked) =>
                                handleSettingChange(
                                  "passwordRequireNumbers",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="passwordRequireSpecialChars"
                              className="text-sm font-medium"
                            >
                              Require Special Characters
                            </Label>
                            <Switch
                              id="passwordRequireSpecialChars"
                              checked={securitySettings.passwordRequireSpecialChars}
                              onCheckedChange={(checked) =>
                                handleSettingChange(
                                  "passwordRequireSpecialChars",
                                  checked,
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Login Security */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Lock className="h-5 w-5" />
                            <span>Login Security</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="maxLoginAttempts"
                              className="text-xs sm:text-right"
                            >
                              Max Login Attempts
                            </Label>
                            <Input
                              id="maxLoginAttempts"
                              type="number"
                              value={securitySettings.maxLoginAttempts}
                              onChange={(e) =>
                                handleSecuritySettingChange(
                                  "maxLoginAttempts",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="3"
                              max="10"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="lockoutDuration"
                              className="text-xs sm:text-right"
                            >
                              Lockout Duration (min)
                            </Label>
                            <Input
                              id="lockoutDuration"
                              type="number"
                              value={securitySettings.lockoutDuration}
                              onChange={(e) =>
                                handleSecuritySettingChange(
                                  "lockoutDuration",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="5"
                              max="1440"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="sessionTimeout"
                              className="text-xs sm:text-right"
                            >
                              Session Timeout (min)
                            </Label>
                            <Input
                              id="sessionTimeout"
                              type="number"
                              value={securitySettings.sessionTimeout}
                              onChange={(e) =>
                                handleSecuritySettingChange(
                                  "sessionTimeout",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="15"
                              max="480"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="twoFactorRequired"
                              className="text-sm font-medium"
                            >
                              Two-Factor Authentication Required
                            </Label>
                            <Switch
                              id="twoFactorRequired"
                              checked={securitySettings.twoFactorRequired}
                              onCheckedChange={(checked) =>
                                handleSecuritySettingChange(
                                  "twoFactorRequired",
                                  checked,
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Access Control */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Access Control</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="ipWhitelistEnabled"
                              className="text-sm font-medium"
                            >
                              IP Whitelist Enabled
                            </Label>
                            <Switch
                              id="ipWhitelistEnabled"
                              checked={securitySettings.ipWhitelistEnabled}
                              onCheckedChange={(checked) =>
                                handleSecuritySettingChange(
                                  "ipWhitelistEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                          {securitySettings.ipWhitelistEnabled && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="ipWhitelist"
                                className="text-right"
                              >
                                Allowed IPs
                              </Label>
                              <Textarea
                                id="ipWhitelist"
                                value={securitySettings.ipWhitelist}
                                onChange={(e) =>
                                  handleSecuritySettingChange(
                                    "ipWhitelist",
                                    e.target.value,
                                  )
                                }
                                className="col-span-3"
                                placeholder="192.168.1.0/24&#10;10.0.0.1&#10;203.0.113.5"
                                rows={3}
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="bruteForceProtection"
                              className="text-sm font-medium"
                            >
                              Brute Force Protection
                            </Label>
                            <Switch
                              id="bruteForceProtection"
                              checked={securitySettings.bruteForceProtection}
                              onCheckedChange={(checked) =>
                                handleSecuritySettingChange(
                                  "bruteForceProtection",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="rateLimitingEnabled"
                              className="text-sm font-medium"
                            >
                              Rate Limiting
                            </Label>
                            <Switch
                              id="rateLimitingEnabled"
                              checked={securitySettings.rateLimitingEnabled}
                              onCheckedChange={(checked) =>
                                handleSecuritySettingChange(
                                  "rateLimitingEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                          {securitySettings.rateLimitingEnabled && (
                            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                              <Label
                                htmlFor="apiRateLimit"
                                className="text-xs sm:text-right"
                              >
                                API Rate Limit (req/min)
                              </Label>
                              <Input
                                id="apiRateLimit"
                                type="number"
                                value={securitySettings.apiRateLimit}
                                onChange={(e) =>
                                  handleSecuritySettingChange(
                                    "apiRateLimit",
                                    parseInt(e.target.value),
                                  )
                                }
                                className="sm:col-span-3 text-xs md:text-sm"
                                min="10"
                                max="1000"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Data Protection */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5" />
                            <span>Data Protection</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="encryptionMethod"
                              className="text-xs sm:text-right"
                            >
                              Encryption Method
                            </Label>
                            <Select
                              value={securitySettings.encryptionMethod}
                              onValueChange={(value) =>
                                handleSecuritySettingChange("encryptionMethod", value)
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AES256">AES-256</SelectItem>
                                <SelectItem value="AES128">AES-128</SelectItem>
                                <SelectItem value="RSA2048">
                                  RSA-2048
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="backupEncryption"
                              className="text-sm font-medium"
                            >
                              Encrypt Backups
                            </Label>
                            <Switch
                              id="backupEncryption"
                              checked={securitySettings.backupEncryption}
                              onCheckedChange={(checked) =>
                                handleSecuritySettingChange("backupEncryption", checked)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="auditLogging"
                              className="text-sm font-medium"
                            >
                              Audit Logging
                            </Label>
                            <Switch
                              id="auditLogging"
                              checked={securitySettings.auditLogging}
                              onCheckedChange={(checked) =>
                                handleSecuritySettingChange("auditLogging", checked)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="suspiciousActivityAlerts"
                              className="text-sm font-medium"
                            >
                              Suspicious Activity Alerts
                            </Label>
                            <Switch
                              id="suspiciousActivityAlerts"
                              checked={securitySettings.suspiciousActivityAlerts}
                              onCheckedChange={(checked) =>
                                handleSecuritySettingChange(
                                  "suspiciousActivityAlerts",
                                  checked,
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleSecuritySaveSettings}
                        className="bg-[#253E44] hover:bg-[#253E44]/70"
                      >
                        Save Security Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {/* PASSWORD */}
              {activeSection === "password" && (
                <div className="min-h-screen bg-gray-50">
                  <div className=" mx-auto py-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Lock className="h-5 w-5" />
                          <span>Password Security</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Current Password */}
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">
                              Current Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={
                                  showPasswords.current ? "text" : "password"
                                }
                                value={formData.currentPassword}
                                onChange={(e) =>
                                  handleInputChange(
                                    "currentPassword",
                                    e.target.value,
                                  )
                                }
                                className={
                                  errors.currentPassword ? "border-red-500" : ""
                                }
                                placeholder="Enter your current password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  togglePasswordVisibility("current")
                                }
                              >
                                {showPasswords.current ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            {errors.currentPassword && (
                              <p className="text-sm text-red-600">
                                {errors.currentPassword}
                              </p>
                            )}
                          </div>

                          {/* New Password */}
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) =>
                                  handleInputChange(
                                    "newPassword",
                                    e.target.value,
                                  )
                                }
                                className={
                                  errors.newPassword ? "border-red-500" : ""
                                }
                                placeholder="Enter your new password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => togglePasswordVisibility("new")}
                              >
                                {showPasswords.new ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            {formData.newPassword && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Password Strength:</span>
                                  <span className={strength.color}>
                                    {strength.text}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      strength.level === 1
                                        ? "bg-red-500 w-1/4"
                                        : strength.level === 2
                                          ? "bg-yellow-500 w-2/4"
                                          : strength.level === 3
                                            ? "bg-blue-500 w-3/4"
                                            : "bg-green-500 w-full"
                                    }`}
                                  />
                                </div>
                              </div>
                            )}
                            {errors.newPassword && (
                              <p className="text-sm text-red-600">
                                {errors.newPassword}
                              </p>
                            )}
                          </div>

                          {/* Confirm Password */}
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirm New Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={
                                  showPasswords.confirm ? "text" : "password"
                                }
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                  handleInputChange(
                                    "confirmPassword",
                                    e.target.value,
                                  )
                                }
                                className={
                                  errors.confirmPassword ? "border-red-500" : ""
                                }
                                placeholder="Confirm your new password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  togglePasswordVisibility("confirm")
                                }
                              >
                                {showPasswords.confirm ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            {errors.confirmPassword && (
                              <p className="text-sm text-red-600">
                                {errors.confirmPassword}
                              </p>
                            )}
                          </div>

                          {/* Password Requirements */}
                          <div className="bg-[#226F75]/5 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">
                              Password Requirements:
                            </h4>
                            <ul className="text-sm text-[#253E44] space-y-1">
                              <li>• At least 8 characters long</li>
                              <li>• At least one uppercase letter</li>
                              <li>• At least one lowercase letter</li>
                              <li>• At least one number</li>
                              <li>• Different from current password</li>
                            </ul>
                          </div>

                          {/* Security Notice */}
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex">
                              <AlertTriangle className="h-5 w-5 text-yellow-400" />
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                  Security Notice
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                  <p>
                                    After changing your password, you will be
                                    automatically logged out and will need to
                                    log in again with your new password. Make
                                    sure to remember your new password or store
                                    it securely.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="flex justify-end space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => navigate("/admin/settings")}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className="bg-[#253E44] hover:bg-[#253E44]/70"
                            >
                              {isLoading
                                ? "Changing Password..."
                                : "Change Password"}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              {/* EMAIL */}
              {activeSection === "email" && (
                <div className="min-h-screen bg-gray-50">
                  <div className=" mx-auto py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* SMTP Configuration */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Settings className="h-5 w-5" />
                            <span>SMTP Configuration</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="smtpHost"
                              className="text-xs sm:text-right"
                            >
                              SMTP Host
                            </Label>
                            <Input
                              id="smtpHost"
                              value={emailSettings.smtpHost}
                              onChange={(e) =>
                                handleEmailSettingChange("smtpHost", e.target.value)
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              placeholder="smtp.example.com"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="smtpPort"
                              className="text-xs sm:text-right"
                            >
                              SMTP Port
                            </Label>
                            <Input
                              id="smtpPort"
                              type="number"
                              value={emailSettings.smtpPort}
                              onChange={(e) =>
                                handleEmailSettingChange(
                                  "smtpPort",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="1"
                              max="65535"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="smtpUsername"
                              className="text-xs sm:text-right"
                            >
                              Username
                            </Label>
                            <Input
                              id="smtpUsername"
                              value={emailSettings.smtpUsername}
                              onChange={(e) =>
                                handleEmailSettingChange(
                                  "smtpUsername",
                                  e.target.value,
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              placeholder="your-email@example.com"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="smtpPassword"
                              className="text-xs sm:text-right"
                            >
                              Password
                            </Label>
                            <div className="sm:col-span-3 relative">
                              <Input
                                id="smtpPassword"
                                type={showPassword ? "text" : "password"}
                                value={emailSettings.smtpPassword}
                                onChange={(e) =>
                                  handleEmailSettingChange(
                                    "smtpPassword",
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter SMTP password"
                                className="text-xs md:text-sm"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="smtpEncryption"
                              className="text-xs sm:text-right"
                            >
                              Encryption
                            </Label>
                            <Select
                              value={emailSettings.smtpEncryption}
                              onValueChange={(value) =>
                                handleEmailSettingChange("smtpEncryption", value)
                              }
                            >
                              <SelectTrigger className="sm:col-span-3 text-xs md:text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="ssl">SSL</SelectItem>
                                <SelectItem value="tls">TLS</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Email Configuration */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Mail className="h-5 w-5" />
                            <span>Email Configuration</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="fromEmail"
                              className="text-xs sm:text-right"
                            >
                              From Email
                            </Label>
                            <Input
                              id="fromEmail"
                              type="email"
                              value={emailSettings.fromEmail}
                              onChange={(e) =>
                                handleEmailSettingChange("fromEmail", e.target.value)
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="fromName" className="text-xs sm:text-right">
                              From Name
                            </Label>
                            <Input
                              id="fromName"
                              value={emailSettings.fromName}
                              onChange={(e) =>
                                handleEmailSettingChange("fromName", e.target.value)
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="replyToEmail"
                              className="text-xs sm:text-right"
                            >
                              Reply-To Email
                            </Label>
                            <Input
                              id="replyToEmail"
                              type="email"
                              value={emailSettings.replyToEmail}
                              onChange={(e) =>
                                handleEmailSettingChange(
                                  "replyToEmail",
                                  e.target.value,
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="maxEmailsPerHour"
                              className="text-xs sm:text-right"
                            >
                              Max Emails/Hour
                            </Label>
                            <Input
                              id="maxEmailsPerHour"
                              type="number"
                              value={emailSettings.maxEmailsPerHour}
                              onChange={(e) =>
                                handleEmailSettingChange(
                                  "maxEmailsPerHour",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="10"
                              max="10000"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Email Features */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Send className="h-5 w-5" />
                            <span>Email Features</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="emailVerificationEnabled"
                              className="text-sm font-medium"
                            >
                              Email Verification
                            </Label>
                            <Switch
                              id="emailVerificationEnabled"
                              checked={emailSettings.emailVerificationEnabled}
                              onCheckedChange={(checked) =>
                                handleEmailSettingChange(
                                  "emailVerificationEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="welcomeEmailEnabled"
                              className="text-sm font-medium"
                            >
                              Welcome Emails
                            </Label>
                            <Switch
                              id="welcomeEmailEnabled"
                              checked={emailSettings.welcomeEmailEnabled}
                              onCheckedChange={(checked) =>
                                handleEmailSettingChange(
                                  "welcomeEmailEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="passwordResetEnabled"
                              className="text-sm font-medium"
                            >
                              Password Reset Emails
                            </Label>
                            <Switch
                              id="passwordResetEnabled"
                              checked={emailSettings.passwordResetEnabled}
                              onCheckedChange={(checked) =>
                                handleEmailSettingChange(
                                  "passwordResetEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="projectNotificationsEnabled"
                              className="text-sm font-medium"
                            >
                              Project Notifications
                            </Label>
                            <Switch
                              id="projectNotificationsEnabled"
                              checked={emailSettings.projectNotificationsEnabled}
                              onCheckedChange={(checked) =>
                                handleEmailSettingChange(
                                  "projectNotificationsEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="paymentNotificationsEnabled"
                              className="text-sm font-medium"
                            >
                              Payment Notifications
                            </Label>
                            <Switch
                              id="paymentNotificationsEnabled"
                              checked={emailSettings.paymentNotificationsEnabled}
                              onCheckedChange={(checked) =>
                                handleEmailSettingChange(
                                  "paymentNotificationsEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="adminNotificationsEnabled"
                              className="text-sm font-medium"
                            >
                              Admin Notifications
                            </Label>
                            <Switch
                              id="adminNotificationsEnabled"
                              checked={emailSettings.adminNotificationsEnabled}
                              onCheckedChange={(checked) =>
                                handleEmailSettingChange(
                                  "adminNotificationsEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Email Testing & Advanced */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <TestTube className="h-5 w-5" />
                            <span>Testing & Advanced</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="testEmail"
                              className="text-sm font-medium"
                            >
                              Test Email Address
                            </Label>
                            <div className="flex space-x-2">
                              <Input
                                id="testEmail"
                                type="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                placeholder="test@example.com"
                                className="flex-1"
                              />
                              <Button
                                onClick={handleTestEmail}
                                variant="outline"
                              >
                                <TestTube className="h-4 w-4 mr-2" />
                                Test
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="emailQueueEnabled"
                              className="text-sm font-medium"
                            >
                              Email Queue Enabled
                            </Label>
                            <Switch
                              id="emailQueueEnabled"
                              checked={emailSettings.emailQueueEnabled}
                              onCheckedChange={(checked) =>
                                handleEmailSettingChange(
                                  "emailQueueEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="bounceHandlingEnabled"
                              className="text-sm font-medium"
                            >
                              Bounce Handling
                            </Label>
                            <Switch
                              id="bounceHandlingEnabled"
                              checked={emailSettings.bounceHandlingEnabled}
                              onCheckedChange={(checked) =>
                                handleEmailSettingChange(
                                  "bounceHandlingEnabled",
                                  checked,
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleEmailSaveSettings}
                        className="bg-[#253E44] hover:bg-[#253E44]/70"
                      >
                        Save Email Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {/* PAYMENT */}
              {activeSection === "payment" && (
                <div className="min-h-screen bg-gray-50">
                  <div className=" mx-auto py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Primary Gateway */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Settings className="h-5 w-5" />
                            <span>Primary Gateway</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="primaryGateway"
                              className="text-xs sm:text-right"
                            >
                              Primary Gateway
                            </Label>
                            <Select
                              value={paymentSettings.primaryGateway}
                              onValueChange={(value) =>
                                handlePaymentSettingChange("primaryGateway", value)
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="flutterwave">
                                  Flutterwave
                                </SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                                <SelectItem value="stripe">Stripe</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="currency" className="text-xs sm:text-right">
                              Currency
                            </Label>
                            <Select
                              value={paymentSettings.currency}
                              onValueChange={(value) =>
                                handlePaymentSettingChange("currency", value)
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NGN">
                                  Nigerian Naira (₦)
                                </SelectItem>
                                <SelectItem value="USD">
                                  US Dollar ($)
                                </SelectItem>
                                <SelectItem value="EUR">Euro (€)</SelectItem>
                                <SelectItem value="GBP">
                                  British Pound (£)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Flutterwave Configuration */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5" />
                            <span>Flutterwave Configuration</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="flutterwavePublicKey"
                              className="text-xs sm:text-right"
                            >
                              Public Key
                            </Label>
                            <Input
                              id="flutterwavePublicKey"
                              value={paymentSettings.flutterwavePublicKey}
                              onChange={(e) =>
                                handlePaymentSettingChange(
                                  "flutterwavePublicKey",
                                  e.target.value,
                                )
                              }
                              className="col-span-3"
                              placeholder="FLWPUBK-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-X"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="flutterwaveSecretKey"
                              className="text-xs sm:text-right"
                            >
                              Secret Key
                            </Label>
                            <div className="col-span-3 relative">
                              <Input
                                id="flutterwaveSecretKey"
                                type={
                                  showKeys.flutterwaveSecret
                                    ? "text"
                                    : "password"
                                }
                                value={paymentSettings.flutterwaveSecretKey}
                                onChange={(e) =>
                                  handlePaymentSettingChange(
                                    "flutterwaveSecretKey",
                                    e.target.value,
                                  )
                                }
                                placeholder="FLWSECK-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-X"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  toggleKeyVisibility("flutterwaveSecret")
                                }
                              >
                                {showKeys.flutterwaveSecret ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="flutterwaveEncryptionKey"
                              className="text-xs sm:text-right"
                            >
                              Encryption Key
                            </Label>
                            <div className="col-span-3 relative">
                              <Input
                                id="flutterwaveEncryptionKey"
                                type={
                                  showKeys.flutterwaveEncryption
                                    ? "text"
                                    : "password"
                                }
                                value={paymentSettings.flutterwaveEncryptionKey}
                                onChange={(e) =>
                                  handlePaymentSettingChange(
                                    "flutterwaveEncryptionKey",
                                    e.target.value,
                                  )
                                }
                                placeholder="FLWSECK_TESTXXXXXXXXXXXXXXXX"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  toggleKeyVisibility("flutterwaveEncryption")
                                }
                              >
                                {showKeys.flutterwaveEncryption ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Escrow Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Escrow Settings</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="escrowEnabled"
                              className="text-sm font-medium"
                            >
                              Escrow Enabled
                            </Label>
                            <Switch
                              id="escrowEnabled"
                              checked={paymentSettings.escrowEnabled}
                              onCheckedChange={(checked) =>
                                handlePaymentSettingChange("escrowEnabled", checked)
                              }
                            />
                          </div>
                          {paymentSettings.escrowEnabled && (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                                <Label
                                  htmlFor="escrowPercentage"
                                  className="text-xs sm:text-right"
                                >
                                  Escrow Percentage (%)
                                </Label>
                                <Input
                                  id="escrowPercentage"
                                  type="number"
                                  value={paymentSettings.escrowPercentage}
                                  onChange={(e) =>
                                    handlePaymentSettingChange(
                                      "escrowPercentage",
                                      parseFloat(e.target.value),
                                    )
                                  }
                                  className="sm:col-span-3 text-xs md:text-sm"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label
                                  htmlFor="autoReleaseEscrow"
                                  className="text-sm font-medium"
                                >
                                  Auto Release Escrow
                                </Label>
                                <Switch
                                  id="autoReleaseEscrow"
                                  checked={paymentSettings.autoReleaseEscrow}
                                  onCheckedChange={(checked) =>
                                    handlePaymentSettingChange(
                                      "autoReleaseEscrow",
                                      checked,
                                    )
                                  }
                                />
                              </div>
                              {paymentSettings.autoReleaseEscrow && (
                                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                                  <Label
                                    htmlFor="escrowReleaseDays"
                                    className="text-xs sm:text-right"
                                  >
                                    Release After (days)
                                  </Label>
                                  <Input
                                    id="escrowReleaseDays"
                                    type="number"
                                    value={paymentSettings.escrowReleaseDays}
                                    onChange={(e) =>
                                      handlePaymentSettingChange(
                                        "escrowReleaseDays",
                                        parseInt(e.target.value),
                                      )
                                    }
                                    className="sm:col-span-3 text-xs md:text-sm"
                                    min="1"
                                    max="90"
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>

                      {/* Fees & Limits */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5" />
                            <span>Fees & Limits</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="platformFee" className="text-xs sm:text-right">
                              Platform Fee (%)
                            </Label>
                            <Input
                              id="platformFee"
                              type="number"
                              value={paymentSettings.platformFee}
                              onChange={(e) =>
                                handlePaymentSettingChange(
                                  "platformFee",
                                  parseFloat(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="0"
                              max="50"
                              step="0.1"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="minimumProjectAmount"
                              className="text-xs sm:text-right"
                            >
                              Min Project Amount
                            </Label>
                            <Input
                              id="minimumProjectAmount"
                              type="number"
                              value={paymentSettings.minimumProjectAmount}
                              onChange={(e) =>
                                handlePaymentSettingChange(
                                  "minimumProjectAmount",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="100"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="maximumProjectAmount"
                              className="text-xs sm:text-right"
                            >
                              Max Project Amount
                            </Label>
                            <Input
                              id="maximumProjectAmount"
                              type="number"
                              value={paymentSettings.maximumProjectAmount}
                              onChange={(e) =>
                                handlePaymentSettingChange(
                                  "maximumProjectAmount",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="1000"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label
                              htmlFor="paymentRetries"
                              className="text-xs sm:text-right"
                            >
                              Payment Retries
                            </Label>
                            <Input
                              id="paymentRetries"
                              type="number"
                              value={paymentSettings.paymentRetries}
                              onChange={(e) =>
                                handlePaymentSettingChange(
                                  "paymentRetries",
                                  parseInt(e.target.value),
                                )
                              }
                              className="sm:col-span-3 text-xs md:text-sm"
                              min="0"
                              max="10"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Additional Gateways */}
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Settings className="h-5 w-5" />
                            <span>Additional Payment Gateways</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* PayPal */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">
                              PayPal Configuration
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                placeholder="PayPal Client ID"
                                value={paymentSettings.paypalClientId}
                                onChange={(e) =>
                                  handlePaymentSettingChange(
                                    "paypalClientId",
                                    e.target.value,
                                  )
                                }
                              />
                              <div className="relative">
                                <Input
                                  type={
                                    showKeys.paypalSecret ? "text" : "password"
                                  }
                                  placeholder="PayPal Client Secret"
                                  value={paymentSettings.paypalClientSecret}
                                  onChange={(e) =>
                                    handlePaymentSettingChange(
                                      "paypalClientSecret",
                                      e.target.value,
                                    )
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() =>
                                    toggleKeyVisibility("paypalSecret")
                                  }
                                >
                                  {showKeys.paypalSecret ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Stripe */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">
                              Stripe Configuration
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                placeholder="Stripe Publishable Key"
                                value={paymentSettings.stripePublishableKey}
                                onChange={(e) =>
                                  handlePaymentSettingChange(
                                    "stripePublishableKey",
                                    e.target.value,
                                  )
                                }
                              />
                              <div className="relative">
                                <Input
                                  type={
                                    showKeys.stripeSecret ? "text" : "password"
                                  }
                                  placeholder="Stripe Secret Key"
                                  value={paymentSettings.stripeSecretKey}
                                  onChange={(e) =>
                                    handlePaymentSettingChange(
                                      "stripeSecretKey",
                                      e.target.value,
                                    )
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() =>
                                    toggleKeyVisibility("stripeSecret")
                                  }
                                >
                                  {showKeys.stripeSecret ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Webhook Settings */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">
                              Webhook Configuration
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <Input
                                  type={
                                    showKeys.webhookSecret ? "text" : "password"
                                  }
                                  placeholder="Webhook Secret"
                                  value={paymentSettings.webhookSecret}
                                  onChange={(e) =>
                                    handlePaymentSettingChange(
                                      "webhookSecret",
                                      e.target.value,
                                    )
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() =>
                                    toggleKeyVisibility("webhookSecret")
                                  }
                                >
                                  {showKeys.webhookSecret ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="disputeResolutionEnabled"
                                  checked={paymentSettings.disputeResolutionEnabled}
                                  onCheckedChange={(checked) =>
                                    handlePaymentSettingChange(
                                      "disputeResolutionEnabled",
                                      checked,
                                    )
                                  }
                                />
                                <Label
                                  htmlFor="disputeResolutionEnabled"
                                  className="text-sm"
                                >
                                  Dispute Resolution
                                </Label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handlePaymentSaveSettings}
                        className="bg-[#253E44] hover:bg-[#253E44]/70"
                      >
                        Save Payment Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {/* NOTIFICATIONS */}
              {activeSection === "notifications" && (
              <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Bell className="h-5 w-5" />
                          <span>Notification Types</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="emailNotifications"
                            className="text-sm font-medium"
                          >
                            Email Notifications
                          </Label>
                          <Switch
                            id="emailNotifications"
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) =>
                              handleSettingChange("emailNotifications", checked)
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="smsNotifications"
                            className="text-sm font-medium"
                          >
                            SMS Notifications
                          </Label>
                          <Switch
                            id="smsNotifications"
                            checked={settings.smsNotifications}
                            onCheckedChange={(checked) =>
                              handleSettingChange("smsNotifications", checked)
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="pushNotifications"
                            className="text-sm font-medium"
                          >
                            Push Notifications
                          </Label>
                          <Switch
                            id="pushNotifications"
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) =>
                              handleSettingChange("pushNotifications", checked)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <MessageSquare className="h-5 w-5" />
                          <span>Event Notifications</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="newUserRegistration"
                            className="text-sm font-medium"
                          >
                            New User Registration
                          </Label>
                          <Switch
                            id="newUserRegistration"
                            checked={settings.newUserRegistration}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "newUserRegistration",
                                checked,
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="projectCreated"
                            className="text-sm font-medium"
                          >
                            Project Created
                          </Label>
                          <Switch
                            id="projectCreated"
                            checked={settings.projectCreated}
                            onCheckedChange={(checked) =>
                              handleSettingChange("projectCreated", checked)
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="paymentReceived"
                            className="text-sm font-medium"
                          >
                            Payment Received
                          </Label>
                          <Switch
                            id="paymentReceived"
                            checked={settings.paymentReceived}
                            onCheckedChange={(checked) =>
                              handleSettingChange("paymentReceived", checked)
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="projectCompleted"
                            className="text-sm font-medium"
                          >
                            Project Completed
                          </Label>
                          <Switch
                            id="projectCompleted"
                            checked={settings.projectCompleted}
                            onCheckedChange={(checked) =>
                              handleSettingChange("projectCompleted", checked)
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="disputeRaised"
                            className="text-sm font-medium"
                          >
                            Dispute Raised
                          </Label>
                          <Switch
                            id="disputeRaised"
                            checked={settings.disputeRaised}
                            onCheckedChange={(checked) =>
                              handleSettingChange("disputeRaised", checked)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Mail className="h-5 w-5" />
                          <span>SMTP Configuration</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                          <Label
                            htmlFor="smtpHost"
                            className="text-xs sm:text-right"
                          >
                            SMTP Host
                          </Label>
                          <Input
                            id="smtpHost"
                            value={settings.smtpHost}
                            onChange={(e) =>
                              handleSettingChange("smtpHost", e.target.value)
                            }
                            className="sm:col-span-3 text-xs md:text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                          <Label
                            htmlFor="smtpPort"
                            className="text-xs sm:text-right"
                          >
                            SMTP Port
                          </Label>
                          <Input
                            id="smtpPort"
                            type="number"
                            value={settings.smtpPort}
                            onChange={(e) =>
                              handleSettingChange(
                                "smtpPort",
                                parseInt(e.target.value),
                              )
                            }
                            className="sm:col-span-3 text-xs md:text-sm"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Smartphone className="h-5 w-5" />
                          <span>SMS & Push Configuration</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                          <Label
                            htmlFor="twilioSid"
                            className="text-xs sm:text-right"
                          >
                            Twilio SID
                          </Label>
                          <Input
                            id="twilioSid"
                            value={settings.twilioSid}
                            onChange={(e) =>
                              handleSettingChange("twilioSid", e.target.value)
                            }
                            className="sm:col-span-3 text-xs md:text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                          <Label htmlFor="twilioToken" className="text-xs sm:text-right">
                            Twilio Token
                          </Label>
                          <Input
                            id="twilioToken"
                            type="password"
                            value={settings.twilioToken}
                            onChange={(e) =>
                              handleSettingChange("twilioToken", e.target.value)
                            }
                            className="sm:col-span-3 text-xs md:text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                          <Label htmlFor="fcmServerKey" className="text-xs sm:text-right">
                            FCM Server Key
                          </Label>
                          <Input
                            id="fcmServerKey"
                            type="password"
                            value={settings.fcmServerKey}
                            onChange={(e) =>
                              handleSettingChange(
                                "fcmServerKey",
                                e.target.value,
                              )
                            }
                            className="sm:col-span-3 text-xs md:text-sm"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleSaveSettings}
                      className="bg-[#253E44] hover:bg-[#253E44]/70"
                    >
                      Save Notification Settings
                    </Button>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
