import { useState, useEffect } from "react";
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


  // Account information state
  const [accountInfo, setAccountInfo] = useState({
    accountId: "",
    memberSince: "",
    accountType: "",
  });
  const [accountLoading, setAccountLoading] = useState(true);

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
  const [documents, setDocuments] = useState<any[]>([]);

  // Load account data on mount
  useEffect(() => {
    const loadAccountData = async () => {
      if (!user) {
        setAccountLoading(false);
        return;
      }

      try {
        const response = await apiClient.getCurrentUser();
        const fullUserData = response.user || response;

        // Generate Account ID from user ID and role
        const accountId = fullUserData.id
          ? `BT-${fullUserData.role?.charAt(0).toUpperCase() || "U"}-${String(fullUserData.id).padStart(6, "0")}`
          : "";

        // Format member since date
        const memberSince = fullUserData.created_at
          ? new Date(fullUserData.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
          : "";

        // Format account type from role
        const accountType = fullUserData.role
          ? `${fullUserData.role.charAt(0).toUpperCase()}${fullUserData.role.slice(1)}`
          : "";

        setAccountInfo({
          accountId,
          memberSince,
          accountType,
        });

        // Populate editable profile
        setProfile({
          first_name: (fullUserData.name || "").split(" ")[0] || "",
          last_name:
            (fullUserData.name || "").split(" ").slice(1).join(" ") || "",
          email: fullUserData.email || "",
          phone: fullUserData.phone || "",
          bio: fullUserData.bio || "",
          location: fullUserData.location || "",
          website: fullUserData.website || "",
        });
        // Populate documents array (license, id, etc.)
        setDocuments(
          fullUserData.documents || fullUserData.user_documents || [],
        );
      } catch (error) {
        console.error("Failed to load account data:", error);
        toast({
          title: "Error",
          description: "Failed to load account data",
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
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                        <AvatarFallback>DN</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">
                        <Camera className="mr-2 h-4 w-4" />
                        Change Photo
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

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) =>
                          setProfile({ ...profile, website: e.target.value })
                        }
                      />
                    </div>

                    {/* <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-2"> */}
                      {/* Existing license preview */}
                      {/* <div className="w-full md:w-48">
                        {(() => {
                          const license = (documents || []).find((d: any) => {
                            const t = (d.type || "").toLowerCase();
                            const f = (d.filename || "").toLowerCase();
                            return t === "license" || f.includes("license");
                          });

                          if (!license) {
                            return (
                              <div className="p-3 border rounded-lg bg-white">
                                <p className="text-sm text-gray-600">
                                  No license on file
                                </p>
                                <p className="text-xs text-gray-400">
                                  Upload below to add your professional license
                                  (existing license remains until replaced).
                                </p>
                              </div>
                            );
                          }

                          const url =
                            license.url ||
                            license.path ||
                            license.file_url ||
                            license.download_url ||
                            license.filename ||
                            "";

                          return (
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                              <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                {url &&
                                (url.endsWith(".pdf") ||
                                  url.endsWith(".PDF")) ? (
                                  <svg
                                    className="w-8 h-8 text-gray-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                  </svg>
                                ) : (
                                  <img
                                    src={url}
                                    alt={license.filename || "license"}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium truncate">
                                    {license.filename ||
                                      license.name ||
                                      "License"}
                                  </p>
                                  {license.verified === 1 ||
                                  license.verified === true ? (
                                    <span className="text-xs text-green-600">
                                      Verified
                                    </span>
                                  ) : (
                                    <span className="text-xs text-yellow-600">
                                      Pending
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  {url ? (
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs text-[#226F75] hover:underline"
                                    >
                                      View
                                    </a>
                                  ) : null}
                                  <a
                                    href={url || "#"}
                                    download
                                    className="text-xs text-gray-600 hover:text-gray-800"
                                  >
                                    Download
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div> */}

                      {/* Upload control */}
                      {/* <div className="flex items-center gap-3">
                        <label
                          htmlFor="licenseFile"
                          className="text-sm text-gray-600"
                        >
                          Upload new license (optional):
                        </label>
                        <input
                          id="licenseFile"
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file || !user) return;
                            try {
                              setUploading(true);
                              await apiClient.uploadDocument(
                                user.id,
                                "license",
                                file,
                              );
                              toast({
                                title: "Uploaded",
                                description: "License uploaded successfully",
                              });
                              // Refresh user to pick up new documents
                              try {
                                await refreshUser();
                              } catch {}
                            } catch (err) {
                              console.error(err);
                              toast({
                                title: "Upload failed",
                                description:
                                  (err as any)?.message ||
                                  "Could not upload file",
                                variant: "destructive",
                              });
                            } finally {
                              setUploading(false);
                              // clear the file input
                              (e.target as HTMLInputElement).value = "";
                            }
                          }}
                        />
                        <Button
                          disabled={uploading}
                          variant="outline"
                          size="sm"
                        >
                          {uploading ? "Uploading..." : "Upload"}
                        </Button>
                      </div> */}
                    {/* </div> */}

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/60 transition-colors cursor-pointer">
                      <label htmlFor="" className="cursor-pointer block w-full">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          Upload Documents
                        </div>
                        <div className="text-xs text-gray-500">
                          Click to upload or drag and drop
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          PDF, JPG, PNG up to 10MB each
                        </div>
                      </label>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        aria-label={`Upload`}
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
                            } catch {}
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
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" />
                    </div>

                    <Button className="bg-[#253E44] hover:bg-[#253E44]/70">
                      Update Password
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
                        <Button variant="outline" className="w-full">
                          Contact Us
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Help Center</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Browse our knowledge base and FAQs
                        </p>
                        <Button variant="outline" className="w-full">
                          Visit Help Center
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-2">Account Information</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          Account ID:{" "}
                          {accountLoading
                            ? "Loading..."
                            : accountInfo.accountId || "N/A"}
                        </p>
                        <p>
                          Member since:{" "}
                          {accountLoading
                            ? "Loading..."
                            : accountInfo.memberSince || "N/A"}
                        </p>
                        <p>
                          Account type:{" "}
                          {accountLoading
                            ? "Loading..."
                            : accountInfo.accountType || "N/A"}
                        </p>
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
          onClose={() =>dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default DeveloperLiscences;
