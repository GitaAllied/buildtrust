import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  X,
  Menu,
  Camera,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  Upload,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import DeveloperSidebar from "@/components/DeveloperSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openDeveloperSidebar, openSignoutModal } from "@/redux/action";

const DeveloperLiscences = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const dispatch = useDispatch()
  const isOpen = useSelector((state:any) => state.sidebar.developerSidebar)
    const signOutModal = useSelector((state:any) => state.signout) 


  // Account information state with additional fields
  const [accountInfo, setAccountInfo] = useState({
    accountId: "",
    memberSince: "",
    accountType: "",
    emailVerified: false,
    trustScore: 0,
    completedProjects: 0,
    rating: 0,
    totalReviews: 0,
    isActive: true,
    lastLogin: "",
  });
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Editable profile state
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    website: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    projectUpdates: true,
    paymentNotifications: true,
    messages: true,
    marketingUpdates: false,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [enabling2FA, setEnabling2FA] = useState(false);

  // Function to save notification preferences
  const saveNotificationPreferences = async (prefs: typeof notificationPreferences) => {
    try {
      localStorage.setItem('developer_notification_preferences', JSON.stringify(prefs));
      await apiClient.updateNotificationSettings(prefs);
      toast({
        title: 'Preferences saved',
        description: 'Your notification preferences have been updated.',
      });
    } catch (error) {
      console.error('Failed to save notification preferences', error);
      toast({
        title: 'Save failed',
        description: 'Unable to save preferences to the server. Your choices have been stored locally.',
        variant: 'destructive',
      });
    }
  };

  // Function to handle password change
  const handlePasswordChange = async () => {
    // Validation
    if (!passwordData.currentPassword.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your current password.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'New password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    if (!/[A-Z]/.test(passwordData.newPassword)) {
      toast({
        title: 'Validation Error',
        description: 'New password must contain at least one capital letter.',
        variant: 'destructive',
      });
      return;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword)) {
      toast({
        title: 'Validation Error',
        description: 'New password must contain at least one special character.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'New password and confirmation do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast({
        title: 'Validation Error',
        description: 'New password must be different from current password.',
        variant: 'destructive',
      });
      return;
    }

    setChangingPassword(true);
    try {
      await apiClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully changed.',
      });
    } catch (error: any) {
      console.error('Password change failed:', error);
      toast({
        title: 'Password Change Failed',
        description: error.message || 'Unable to change password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // Function to handle 2FA toggle
  const handleToggle2FA = async () => {
    setEnabling2FA(true);
    try {
      // For now, show a message that 2FA is coming soon
      toast({
        title: 'Coming Soon',
        description: 'Two-factor authentication will be available soon. Stay tuned!',
      });
    } catch (error) {
      console.error('2FA toggle failed:', error);
      toast({
        title: 'Error',
        description: 'Unable to update 2FA settings.',
        variant: 'destructive',
      });
    } finally {
      setEnabling2FA(false);
    }
  };
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null);
  // helper to create full URLs for profile images
  const constructImageUrl = (imgPath: string | null | undefined): string | null => {
    if (!imgPath || typeof imgPath !== 'string') return null;
    if (/^https?:\/\//i.test(imgPath) || /^data:/i.test(imgPath)) {
      return imgPath;
    }
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
    const base = apiUrl.toString().replace(/\/api.*$/i, '').replace(/\/$/, '');
    return imgPath.startsWith('/') ? `${base}${imgPath}` : `${base}/${imgPath}`;
  };

  // Load account data on mount
  useEffect(() => {
    const loadNotificationPreferences = () => {
      const stored = localStorage.getItem('developer_notification_preferences');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotificationPreferences((prev) => ({
            ...prev,
            ...parsed,
          }));
        } catch (error) {
          console.warn('Failed to parse saved notification preferences:', error);
        }
      }
    };

    loadNotificationPreferences();

    const loadAccountData = async () => {
      if (!user) {
        setAccountLoading(false);
        return;
      }

      try {
        setAccountError(null);
        const response = await apiClient.getCurrentUser();
        const fullUserData = response.user || response;

        // Validate required fields
        if (!fullUserData || typeof fullUserData !== 'object') {
          throw new Error('Invalid user data received from API');
        }

        // Generate Account ID from user ID and role with validation
        const userId = fullUserData.id;
        const userRole = fullUserData.role;
        let accountId = "";
        if (userId && typeof userId === 'number' && userId > 0) {
          const rolePrefix = userRole && typeof userRole === 'string'
            ? userRole.charAt(0).toUpperCase()
            : "U";
          accountId = `BT-${rolePrefix}-${String(userId).padStart(6, "0")}`;
        }

        // Format member since date with validation
        let memberSince = "";
        if (fullUserData.created_at) {
          try {
            const createdDate = new Date(fullUserData.created_at);
            if (!isNaN(createdDate.getTime())) {
              memberSince = createdDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              });
            }
          } catch (dateError) {
            console.warn('Invalid created_at date:', fullUserData.created_at);
          }
        }

        // Format account type from role with validation
        let accountType = "";
        if (userRole && typeof userRole === 'string' && userRole.length > 0) {
          accountType = `${userRole.charAt(0).toUpperCase()}${userRole.slice(1).toLowerCase()}`;
        }

        // Validate and extract additional account information
        const emailVerified = Boolean(fullUserData.email_verified);
        const trustScore = typeof fullUserData.trust_score === 'number' && fullUserData.trust_score >= 0
          ? fullUserData.trust_score
          : 0;
        const completedProjects = typeof fullUserData.completed_projects === 'number' && fullUserData.completed_projects >= 0
          ? fullUserData.completed_projects
          : 0;
        const rating = typeof fullUserData.rating === 'number' && fullUserData.rating >= 0 && fullUserData.rating <= 5
          ? fullUserData.rating
          : 0;
        const totalReviews = typeof fullUserData.total_reviews === 'number' && fullUserData.total_reviews >= 0
          ? fullUserData.total_reviews
          : 0;
        const isActive = fullUserData.is_active !== undefined ? Boolean(fullUserData.is_active) : true;

        // Format last login if available (assuming it's in the API response)
        let lastLogin = "";
        if (fullUserData.last_login) {
          try {
            const lastLoginDate = new Date(fullUserData.last_login);
            if (!isNaN(lastLoginDate.getTime())) {
              lastLogin = lastLoginDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            }
          } catch (dateError) {
            console.warn('Invalid last_login date:', fullUserData.last_login);
          }
        }

        // set profile image
        const imgPath = fullUserData.profile_image || fullUserData.profileImage || fullUserData.image;
        setProfileImageSrc(constructImageUrl(imgPath));

        setAccountInfo({
          accountId,
          memberSince,
          accountType,
          emailVerified,
          trustScore,
          completedProjects,
          rating,
          totalReviews,
          isActive,
          lastLogin,
        });

        // Populate editable profile with validation
        setProfile({
          first_name: (fullUserData.name && typeof fullUserData.name === 'string')
            ? fullUserData.name.split(" ")[0] || ""
            : "",
          last_name: (fullUserData.name && typeof fullUserData.name === 'string')
            ? fullUserData.name.split(" ").slice(1).join(" ") || ""
            : "",
          email: (fullUserData.email && typeof fullUserData.email === 'string')
            ? fullUserData.email
            : "",
          phone: (fullUserData.phone && typeof fullUserData.phone === 'string')
            ? fullUserData.phone
            : "",
          bio: (fullUserData.bio && typeof fullUserData.bio === 'string')
            ? fullUserData.bio
            : "",
          location: (fullUserData.location && typeof fullUserData.location === 'string')
            ? fullUserData.location
            : "",
          website: (fullUserData.website && typeof fullUserData.website === 'string')
            ? fullUserData.website
            : "",
        });
      } catch (error) {
        console.error("Failed to load account data:", error);
        setAccountError(error instanceof Error ? error.message : 'Failed to load account data');
        toast({
          title: "Error",
          description: "Failed to load account data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setAccountLoading(false);
      }
    };

    loadAccountData();
  }, [user]);

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
      <DeveloperSidebar active={"profile"} />

      {/* Main Content */}
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
                            try {
                              const resp = await apiClient.getCurrentUser();
                              const fu = resp.user || resp;
                              const img = fu.profile_image || fu.profileImage || fu.image;
                              if (img) {
                                const url = constructImageUrl(img);
                                setProfileImageSrc(url ? `${url}?t=${Date.now()}` : null);
                              }
                            } catch (e) {
                              console.error('Error fetching updated profile:', e);
                            }
                          } catch (err) {
                            console.error(err);
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
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.first_name}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              first_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.last_name}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              last_name: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <Button
                        className="bg-[#253E44] hover:bg-[#253E44]/70"
                        onClick={async () => {
                          if (!user) return;
                          setSaving(true);
                          try {
                            const payload: Record<string, unknown> = {
                              name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
                              phone: profile.phone || undefined,
                              bio: profile.bio || undefined,
                              location: profile.location || undefined,
                              website: profile.website || undefined,
                            };
                            await apiClient.updateProfile(payload);
                            toast({
                              title: "Saved",
                              description: "Profile updated successfully",
                            });
                            try {
                              await refreshUser();
                              // Refresh account data after profile update
                              const response = await apiClient.getCurrentUser();
                              const updatedUser = response.user || response;
                              
                              // Update account info with any changes
                              if (updatedUser.name) {
                                setAccountInfo(prev => ({
                                  ...prev,
                                  // Account info doesn't change with profile updates, but we could update rating/trust score if available
                                }));
                              }
                            } catch (refreshError) {
                              console.warn('Failed to refresh user data after profile update:', refreshError);
                            }
                          } catch (err) {
                            console.error("Save failed", err);
                            toast({
                              title: "Save failed",
                              description:
                                (err as any)?.message ||
                                "Could not save profile",
                              variant: "destructive",
                            });
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>

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
                      <Switch
                        checked={notificationPreferences.projectUpdates}
                        onCheckedChange={async (checked) => {
                          const newPrefs = {
                            ...notificationPreferences,
                            projectUpdates: Boolean(checked),
                          };
                          setNotificationPreferences(newPrefs);
                          await saveNotificationPreferences(newPrefs);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Payment Notifications</h4>
                        <p className="text-sm text-gray-500">
                          Alerts for payment requests and confirmations
                        </p>
                      </div>
                      <Switch
                        checked={notificationPreferences.paymentNotifications}
                        onCheckedChange={async (checked) => {
                          const newPrefs = {
                            ...notificationPreferences,
                            paymentNotifications: Boolean(checked),
                          };
                          setNotificationPreferences(newPrefs);
                          await saveNotificationPreferences(newPrefs);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Messages</h4>
                        <p className="text-sm text-gray-500">
                          New messages from developers
                        </p>
                      </div>
                      <Switch
                        checked={notificationPreferences.messages}
                        onCheckedChange={async (checked) => {
                          const newPrefs = {
                            ...notificationPreferences,
                            messages: Boolean(checked),
                          };
                          setNotificationPreferences(newPrefs);
                          await saveNotificationPreferences(newPrefs);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Updates</h4>
                        <p className="text-sm text-gray-500">
                          News and updates from BuildTrust
                        </p>
                      </div>
                      <Switch
                        checked={notificationPreferences.marketingUpdates}
                        onCheckedChange={async (checked) => {
                          const newPrefs = {
                            ...notificationPreferences,
                            marketingUpdates: Boolean(checked),
                          };
                          setNotificationPreferences(newPrefs);
                          await saveNotificationPreferences(newPrefs);
                        }}
                      />
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
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        placeholder="Enter your new password"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 6 characters with 1 capital letter and 1 special character
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm your new password"
                      />
                    </div>

                    <Button
                      className="bg-[#253E44] hover:bg-[#253E44]/70"
                      onClick={handlePasswordChange}
                      disabled={changingPassword}
                    >
                      {changingPassword ? 'Updating Password...' : 'Update Password'}
                    </Button>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleToggle2FA}
                          disabled={enabling2FA}
                        >
                          {enabling2FA ? 'Processing...' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </Button>
                      </div>
                      {!twoFactorEnabled && (
                        <p className="text-xs text-amber-600 mt-2">
                          ⚠️ Two-factor authentication is coming soon. This feature will be available in a future update.
                        </p>
                      )}
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

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              VISA
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">**** **** **** 1234</p>
                            <p className="text-sm text-gray-500">
                              Expires 12/26
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
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
                          onClick={() => {
                            // Navigate to support page and scroll to contact section
                            navigate('/support#contact');
                          }}
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
                          onClick={() => {
                            // Navigate to support page and scroll to FAQ section
                            navigate('/support#faq');
                          }}
                        >
                          Visit Help Center
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-2">Account Information</h4>
                      {accountError ? (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                          <p className="font-medium">Error loading account information</p>
                          <p>{accountError}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={async () => {
                              setAccountLoading(true);
                              setAccountError(null);
                              try {
                                const response = await apiClient.getCurrentUser();
                                const fullUserData = response.user || response;
                                
                                // Re-run the same validation logic as in loadAccountData
                                const userId = fullUserData.id;
                                const userRole = fullUserData.role;
                                let accountId = "";
                                if (userId && typeof userId === 'number' && userId > 0) {
                                  const rolePrefix = userRole && typeof userRole === 'string'
                                    ? userRole.charAt(0).toUpperCase()
                                    : "U";
                                  accountId = `BT-${rolePrefix}-${String(userId).padStart(6, "0")}`;
                                }

                                let memberSince = "";
                                if (fullUserData.created_at) {
                                  try {
                                    const createdDate = new Date(fullUserData.created_at);
                                    if (!isNaN(createdDate.getTime())) {
                                      memberSince = createdDate.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                      });
                                    }
                                  } catch (dateError) {
                                    console.warn('Invalid created_at date:', fullUserData.created_at);
                                  }
                                }

                                let accountType = "";
                                if (userRole && typeof userRole === 'string' && userRole.length > 0) {
                                  accountType = `${userRole.charAt(0).toUpperCase()}${userRole.slice(1).toLowerCase()}`;
                                }

                                const emailVerified = Boolean(fullUserData.email_verified);
                                const trustScore = typeof fullUserData.trust_score === 'number' && fullUserData.trust_score >= 0
                                  ? fullUserData.trust_score
                                  : 0;
                                const completedProjects = typeof fullUserData.completed_projects === 'number' && fullUserData.completed_projects >= 0
                                  ? fullUserData.completed_projects
                                  : 0;
                                const rating = typeof fullUserData.rating === 'number' && fullUserData.rating >= 0 && fullUserData.rating <= 5
                                  ? fullUserData.rating
                                  : 0;
                                const totalReviews = typeof fullUserData.total_reviews === 'number' && fullUserData.total_reviews >= 0
                                  ? fullUserData.total_reviews
                                  : 0;
                                const isActive = fullUserData.is_active !== undefined ? Boolean(fullUserData.is_active) : true;

                                setAccountInfo({
                                  accountId,
                                  memberSince,
                                  accountType,
                                  emailVerified,
                                  trustScore,
                                  completedProjects,
                                  rating,
                                  totalReviews,
                                  isActive,
                                  lastLogin: accountInfo.lastLogin, // Keep existing lastLogin
                                });
                                
                                toast({
                                  title: "Refreshed",
                                  description: "Account information has been updated.",
                                });
                              } catch (error) {
                                console.error('Failed to refresh account data:', error);
                                setAccountError(error instanceof Error ? error.message : 'Failed to refresh account data');
                                toast({
                                  title: "Refresh Failed",
                                  description: "Unable to refresh account information.",
                                  variant: "destructive",
                                });
                              } finally {
                                setAccountLoading(false);
                              }
                            }}
                          >
                            Retry
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-900">Account ID</p>
                              <p className="font-mono">
                                {accountLoading ? "Loading..." : accountInfo.accountId || "Not available"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Member Since</p>
                              <p>
                                {accountLoading ? "Loading..." : accountInfo.memberSince || "Not available"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Account Type</p>
                              <p>
                                {accountLoading ? "Loading..." : accountInfo.accountType || "Not available"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Account Status</p>
                              <p>
                                {accountLoading ? "Loading..." : (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    accountInfo.isActive
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {accountInfo.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Email Verified</p>
                              <p>
                                {accountLoading ? "Loading..." : (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    accountInfo.emailVerified
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {accountInfo.emailVerified ? 'Verified' : 'Unverified'}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Trust Score</p>
                              <p>
                                {accountLoading ? "Loading..." : (
                                  <span className={`font-semibold ${
                                    accountInfo.trustScore >= 80 ? 'text-green-600' :
                                    accountInfo.trustScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {accountInfo.trustScore}/100
                                  </span>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Completed Projects</p>
                              <p>
                                {accountLoading ? "Loading..." : accountInfo.completedProjects}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Rating</p>
                              <p>
                                {accountLoading ? "Loading..." : (
                                  <span className="flex items-center gap-1">
                                    <span className="font-semibold">{accountInfo.rating.toFixed(1)}</span>
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-gray-500">({accountInfo.totalReviews} reviews)</span>
                                  </span>
                                )}
                              </p>
                            </div>
                            {accountInfo.lastLogin && (
                              <div>
                                <p className="font-medium text-gray-900">Last Login</p>
                                <p>
                                  {accountLoading ? "Loading..." : accountInfo.lastLogin}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
          onClose={() =>dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default DeveloperLiscences;
