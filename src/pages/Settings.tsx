import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import {
  ArrowLeft,
  Camera,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
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
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const { signOut } = useAuth();
  const [signOutModal, setSignOutModal] = useState(false);
  const { toast } = useToast();

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Account information state
  const [accountInfo, setAccountInfo] = useState({
    accountId: "",
    memberSince: "",
    accountType: "",
  });

  // Validation state
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

  // Payment methods state
  const [paymentMethodsList, setPaymentMethodsList] = useState<any[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(false);

  // Helper function to construct full image URL from path
  const constructImageUrl = (imgPath: string | null | undefined): string | null => {
    if (!imgPath || typeof imgPath !== 'string') return null;
    
    // Already a full URL or data URL
    if (/^https?:\/\//i.test(imgPath) || /^data:/i.test(imgPath)) {
      return imgPath;
    }
    
    // Get the base URL (remove /api suffix if present)
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
    const base = apiUrl.toString().replace(/\/api.*$/i, '').replace(/\/$/, '');
    
    // Construct full URL
    return imgPath.startsWith('/') ? `${base}${imgPath}` : `${base}/${imgPath}`;
  };

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (user) {
        setLoadingMethods(true);
        try {
          const res = await apiClient.getPaymentMethods();
          if (res && res.methods) setPaymentMethodsList(res.methods);
        } catch (e) {
          console.warn('Could not load payment methods', e);
        } finally {
          setLoadingMethods(false);
        }
      }
    };
    loadPaymentMethods();
  }, [user]);

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (user) {
        setLoadingMethods(true);
        try {
          const res = await apiClient.getPaymentMethods();
          if (res && res.methods) setPaymentMethodsList(res.methods);
        } catch (e) {
          console.warn('Could not load payment methods', e);
        } finally {
          setLoadingMethods(false);
        }
      }
    };
    loadPaymentMethods();
  }, [user]);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Fetch full user data from API to ensure all fields are included
          const response = await apiClient.getCurrentUser();

          // Extract user object from response (API returns {user: {...}})
          const fullUserData = response.user || response;

          const nameParts = fullUserData.name ? fullUserData.name.split(" ") : ["", ""];
          const phoneValue = fullUserData.phone && String(fullUserData.phone).trim() !== '' ? String(fullUserData.phone).trim() : '';
          const newProfileData = {
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: fullUserData.email || "",
            phone: phoneValue,
          };
          setProfileData(newProfileData);

          // Set account information from API data
          const accountId = fullUserData.id ? `BT-${fullUserData.role?.charAt(0).toUpperCase() || 'U'}-${String(fullUserData.id).padStart(6, '0')}` : "";
          const memberSince = fullUserData.created_at ? new Date(fullUserData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "";
          const accountType = fullUserData.role ? `${fullUserData.role.charAt(0).toUpperCase()}${fullUserData.role.slice(1)}` : "";

          setAccountInfo({
            accountId,
            memberSince,
            accountType,
          });

          // Set profile image from API data
          const imgPath = fullUserData.profile_image || fullUserData.profileImage || fullUserData.image;
          setProfileImageSrc(constructImageUrl(imgPath));
        } catch (error) {
          // Fallback to auth context user data if API call fails
          const nameParts = user.name ? user.name.split(" ") : ["", ""];
          const phoneValue = user.phone && String(user.phone).trim() !== '' ? String(user.phone).trim() : '';
          setProfileData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: user.email || "",
            phone: phoneValue,
          });

          // Set fallback account info
          setAccountInfo({
            accountId: "",
            memberSince: "",
            accountType: "",
          });

          // Fallback: derive image from auth user object
          const fallbackImg = user && ((user as any).profile_image || (user as any).profileImage || (user as any).image);
          setProfileImageSrc(constructImageUrl(fallbackImg));
        }
      }
    };

    loadUserData();
  }, [user]);

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate profile form
  const validateProfileForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Check required fields
    if (!profileData.firstName || !profileData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!profileData.lastName || !profileData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!profileData.email || !profileData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = "Invalid email format";
    }
    if (profileData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(profileData.phone)) {
      errors.phone = "Invalid phone number format";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate password form
  const validatePasswordForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one capital letter";
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one special character";
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      toast({ title: 'Validation Error', description: 'Please fix the errors below', variant: 'destructive' });
      return;
    }

    if (!user) {
      setProfileMessage({
        type: "error",
        text: "User not authenticated",
      });
      return;
    }

    setProfileLoading(true);
    setProfileMessage(null);

    try {
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();

      await apiClient.updateProfile({
        name: fullName,
        email: profileData.email,
        phone: profileData.phone,
      });

      // Refresh user in auth context
      await refreshUser();

      // Reload fresh user data from API to populate form with latest values
      const response = await apiClient.getCurrentUser();
      const fullUserData = response.user || response;
      
      const nameParts = fullUserData.name ? fullUserData.name.split(" ") : ["", ""];
      const phoneValue = fullUserData.phone && String(fullUserData.phone).trim() !== '' ? String(fullUserData.phone).trim() : '';
      setProfileData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: fullUserData.email || "",
        phone: phoneValue,
      });

      setProfileMessage({
        type: "success",
        text: "Profile updated successfully",
      });
      toast({ title: 'Success', description: 'Profile updated successfully' });

      setTimeout(() => {
        setProfileMessage(null);
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      setProfileMessage({
        type: "error",
        text: message,
      });
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswordForm()) {
      toast({ title: 'Validation Error', description: 'Please fix the errors below', variant: 'destructive' });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage(null);

    try {
      await apiClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordMessage({
        type: "success",
        text: "Password updated successfully",
      });
      toast({ title: 'Success', description: 'Password updated successfully' });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setPasswordMessage(null);
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update password";
      setPasswordMessage({
        type: "error",
        text: message,
      });
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setPasswordLoading(false);
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
    { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
    { id: "messages", label: "Messages", icon: <FaMessage /> },
    { id: "contracts", label: "Contracts", icon: <FaFileContract /> },
    { id: "saved", label: "Saved Developers", icon: <FaUserGear /> },
    { id: "settings", label: "Settings", icon: <FaGear />, active: true },
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

  const settingSections = [
    { id: "profile", label: "Profile", icon: Camera },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "support", label: "Support", icon: HelpCircle },
  ];

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
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50 flex flex-col gap-5">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="md:text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-500">Manage your account preferences</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Sidebar */}
          <div className=" bg-[#226F75]/10 w-[95%] m-auto rounded-lg overflow-x-scroll scrollbar-custom">
            <nav className="p-2 text-sm flex justify-around items-center gap-2">
              {settingSections.map((section) => {
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
          <div className="flex-1 p-6">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        {previewUrl ? (
                          <AvatarImage src={previewUrl} />
                        ) : profileImageSrc ? (
                          <AvatarImage src={profileImageSrc} />
                        ) : (
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                        )}
                        <AvatarFallback>DN</AvatarFallback>
                      </Avatar>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f || !user) return;
                          setPreviewUrl(URL.createObjectURL(f));
                          setUploading(true);
                          try {
                            await apiClient.uploadProfileImage(user.id, f);
                            await refreshUser();
                            // Fetch and set the uploaded image URL so it persists after page reload
                            try {
                              const resp = await apiClient.getCurrentUser();
                              const fu = resp.user || resp;
                              const img = fu.profile_image || fu.profileImage || fu.image;
                              if (img) {
                                // Add cache-buster only after upload to force browser to fetch new file
                                const url = constructImageUrl(img);
                                setProfileImageSrc(url ? `${url}?t=${Date.now()}` : null);
                              }
                            } catch (e) {
                              console.error('Error fetching updated profile:', e);
                            }
                            const successMsg = 'Profile photo updated';
                            setProfileMessage({ type: 'success', text: successMsg });
                            toast({ title: 'Success', description: successMsg });
                            setTimeout(() => setProfileMessage(null), 3000);
                          } catch (err) {
                            const errMsg = err instanceof Error ? err.message : 'Upload failed';
                            setProfileMessage({ type: 'error', text: errMsg });
                            toast({ title: 'Error', description: errMsg, variant: 'destructive' });
                          } finally {
                            setUploading(false);
                          }
                        }}
                      />
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        <Camera className="mr-2 h-4 w-4" />
                        {uploading ? 'Uploading...' : 'Change Photo'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className={profileErrors.firstName ? 'text-red-600' : ''}>First Name {!profileErrors.firstName && <span className="text-red-500">*</span>}</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) =>
                            handleProfileInputChange("firstName", e.target.value)
                          }
                          disabled={profileLoading}
                          className={profileErrors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                          placeholder="Enter your first name"
                        />
                        {profileErrors.firstName && (
                          <p className="text-red-600 text-sm mt-1">{profileErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName" className={profileErrors.lastName ? 'text-red-600' : ''}>Last Name {!profileErrors.lastName && <span className="text-red-500">*</span>}</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) =>
                            handleProfileInputChange("lastName", e.target.value)
                          }
                          disabled={profileLoading}
                          className={profileErrors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                          placeholder="Enter your last name"
                        />
                        {profileErrors.lastName && (
                          <p className="text-red-600 text-sm mt-1">{profileErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className={profileErrors.email ? 'text-red-600' : ''}>Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleProfileInputChange("email", e.target.value)
                        }
                        disabled={true}
                        className={profileErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        placeholder="your@email.com"
                      />
                      {profileErrors.email && (
                        <p className="text-red-600 text-sm mt-1">{profileErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className={profileErrors.phone ? 'text-red-600' : ''}>Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleProfileInputChange("phone", e.target.value)
                        }
                        disabled={profileLoading}
                        className={profileErrors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        placeholder="+1 (555) 000-0000"
                      />
                      {profileErrors.phone && (
                        <p className="text-red-600 text-sm mt-1">{profileErrors.phone}</p>
                      )}
                    </div>

                    {profileMessage && (
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          profileMessage.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {profileMessage.text}
                      </div>
                    )}

                    <Button
                      onClick={handleSaveProfile}
                      disabled={profileLoading}
                      className="bg-[#253E44] hover:bg-[#253E44]/70"
                    >
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Project Updates</h4>
                        <p className="text-sm text-gray-500">
                          Get notified about project milestones
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Payment Notifications</h4>
                        <p className="text-sm text-gray-500">
                          Alerts for payment requests and confirmations
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Messages</h4>
                        <p className="text-sm text-gray-500">
                          New messages from developers
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Updates</h4>
                        <p className="text-sm text-gray-500">
                          News and updates from BuildTrust
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="currentPassword" className={passwordErrors.currentPassword ? 'text-red-600' : ''}>Current Password <span className="text-red-500">*</span></Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          handlePasswordInputChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                        disabled={passwordLoading}
                        className={passwordErrors.currentPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        placeholder="Enter your current password"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-red-600 text-sm mt-1">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="newPassword" className={passwordErrors.newPassword ? 'text-red-600' : ''}>New Password <span className="text-red-500">*</span></Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordInputChange("newPassword", e.target.value)
                        }
                        disabled={passwordLoading}
                        className={passwordErrors.newPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        placeholder="Enter your new password"
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-red-600 text-sm mt-1">{passwordErrors.newPassword}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-2">
                        Password must be at least 6 characters, contain one capital letter and one special character
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className={passwordErrors.confirmPassword ? 'text-red-600' : ''}>
                        Confirm New Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordInputChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        disabled={passwordLoading}
                        className={passwordErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        placeholder="Confirm your new password"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>

                    {passwordMessage && (
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          passwordMessage.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {passwordMessage.text}
                      </div>
                    )}

                    <Button
                      onClick={handleUpdatePassword}
                      disabled={passwordLoading}
                      className="bg-[#253E44] hover:bg-[#253E44]/70"
                    >
                      {passwordLoading ? "Updating..." : "Update Password"}
                    </Button>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security
                          </p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "billing" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-600">
                      Manage your payment methods and billing preferences for
                      project payments.
                    </p>

                    {loadingMethods ? (
                      <div className="text-center py-4 text-gray-500">Loading payment methods...</div>
                    ) : paymentMethodsList.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <p className="mb-4">No payment methods saved yet</p>
                        <Button 
                          onClick={() => navigate('/payments?tab=payment-methods')}
                          className="bg-[#253E44] hover:bg-[#253E44]/90"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Add Payment Method
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {paymentMethodsList.map((method) => {
                            const brandColor = method.card_brand?.toLowerCase() === 'visa' ? 'bg-blue-600' : 
                                             method.card_brand?.toLowerCase() === 'mastercard' ? 'bg-red-600' : 
                                             'bg-gray-600';
                            const brandText = method.card_brand || 'CARD';
                            return (
                              <div 
                                key={method.id} 
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                  method.is_default ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                                }`}
                                onClick={async () => {
                                  if (!method.is_default) {
                                    try {
                                      await apiClient.updatePaymentMethod(method.id, { isDefault: true });
                                      toast({ title: 'Success', description: 'Default payment method updated' });
                                      const methodsRes = await apiClient.getPaymentMethods();
                                      if (methodsRes && methodsRes.methods) setPaymentMethodsList(methodsRes.methods);
                                    } catch (e: any) {
                                      toast({ title: 'Error', description: e?.message || 'Failed to update', variant: 'destructive' });
                                    }
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 flex-1">
                                    <div className={`w-10 h-6 ${brandColor} rounded flex items-center justify-center`}>
                                      <span className="text-white text-xs font-bold">
                                        {brandText.slice(0, 4)}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">{method.cardholder_name}</p>
                                      <p className="text-sm text-gray-500">
                                        •••• •••• •••• {method.last4} • Expires {String(method.exp_month).padStart(2, '0')}/{String(method.exp_year).slice(-2)}
                                      </p>
                                    </div>
                                  </div>
                                  {method.is_default && (
                                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded font-medium">Selected for Billing</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "support" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Support & Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Contact Support</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Get help with your account or projects
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/messages')}
                        >
                          Contact Us
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Help Center</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Browse our knowledge base and FAQs
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/#faq')}
                        >
                          Visit Help Center
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-2">Account Information</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Account ID: {accountInfo.accountId || 'Loading...'}</p>
                        <p>Member since: {accountInfo.memberSince || 'Loading...'}</p>
                        <p>Account type: {accountInfo.accountType || 'Loading...'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
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

export default Settings;
