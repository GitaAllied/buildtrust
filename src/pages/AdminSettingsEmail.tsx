import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Mail, Send, Settings, TestTube, ArrowLeft, Eye, EyeOff } from "lucide-react";

const AdminSettingsEmail = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
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

  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log("Saving email settings:", settings);
    alert("Email settings saved successfully!");
  };

  const handleTestEmail = () => {
    if (!testEmail) {
      alert("Please enter a test email address");
      return;
    }
    // In a real app, this would send a test email
    console.log("Sending test email to:", testEmail);
    alert(`Test email sent to ${testEmail}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/settings')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Settings</span>
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">Email Settings</h1>
                <p className="text-sm text-gray-500">SMTP configuration and email templates</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <Label htmlFor="smtpHost" className="text-xs sm:text-right">
                  SMTP Host
                </Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                  className="sm:col-span-3 text-xs md:text-sm"
                  placeholder="smtp.example.com"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="smtpPort" className="text-xs sm:text-right">
                  SMTP Port
                </Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
                  className="sm:col-span-3 text-xs md:text-sm"
                  min="1"
                  max="65535"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="smtpUsername" className="text-xs sm:text-right">
                  Username
                </Label>
                <Input
                  id="smtpUsername"
                  value={settings.smtpUsername}
                  onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                  className="sm:col-span-3 text-xs md:text-sm"
                  placeholder="your-email@example.com"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="smtpPassword" className="text-xs sm:text-right">
                  Password
                </Label>
                <div className="sm:col-span-3 relative">
                  <Input
                    id="smtpPassword"
                    type={showPassword ? "text" : "password"}
                    value={settings.smtpPassword}
                    onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="smtpEncryption" className="text-xs sm:text-right">
                  Encryption
                </Label>
                <Select value={settings.smtpEncryption} onValueChange={(value) => handleSettingChange('smtpEncryption', value)}>
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
                <Label htmlFor="fromEmail" className="text-xs sm:text-right">
                  From Email
                </Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={settings.fromEmail}
                  onChange={(e) => handleSettingChange('fromEmail', e.target.value)}
                  className="sm:col-span-3 text-xs md:text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fromName" className="text-right">
                  From Name
                </Label>
                <Input
                  id="fromName"
                  value={settings.fromName}
                  onChange={(e) => handleSettingChange('fromName', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="replyToEmail" className="text-right">
                  Reply-To Email
                </Label>
                <Input
                  id="replyToEmail"
                  type="email"
                  value={settings.replyToEmail}
                  onChange={(e) => handleSettingChange('replyToEmail', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="maxEmailsPerHour" className="text-xs sm:text-right">
                  Max Emails/Hour
                </Label>
                <Input
                  id="maxEmailsPerHour"
                  type="number"
                  value={settings.maxEmailsPerHour}
                  onChange={(e) => handleSettingChange('maxEmailsPerHour', parseInt(e.target.value))}
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
                <Label htmlFor="emailVerificationEnabled" className="text-sm font-medium">
                  Email Verification
                </Label>
                <Switch
                  id="emailVerificationEnabled"
                  checked={settings.emailVerificationEnabled}
                  onCheckedChange={(checked) => handleSettingChange('emailVerificationEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="welcomeEmailEnabled" className="text-sm font-medium">
                  Welcome Emails
                </Label>
                <Switch
                  id="welcomeEmailEnabled"
                  checked={settings.welcomeEmailEnabled}
                  onCheckedChange={(checked) => handleSettingChange('welcomeEmailEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="passwordResetEnabled" className="text-sm font-medium">
                  Password Reset Emails
                </Label>
                <Switch
                  id="passwordResetEnabled"
                  checked={settings.passwordResetEnabled}
                  onCheckedChange={(checked) => handleSettingChange('passwordResetEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="projectNotificationsEnabled" className="text-sm font-medium">
                  Project Notifications
                </Label>
                <Switch
                  id="projectNotificationsEnabled"
                  checked={settings.projectNotificationsEnabled}
                  onCheckedChange={(checked) => handleSettingChange('projectNotificationsEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="paymentNotificationsEnabled" className="text-sm font-medium">
                  Payment Notifications
                </Label>
                <Switch
                  id="paymentNotificationsEnabled"
                  checked={settings.paymentNotificationsEnabled}
                  onCheckedChange={(checked) => handleSettingChange('paymentNotificationsEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="adminNotificationsEnabled" className="text-sm font-medium">
                  Admin Notifications
                </Label>
                <Switch
                  id="adminNotificationsEnabled"
                  checked={settings.adminNotificationsEnabled}
                  onCheckedChange={(checked) => handleSettingChange('adminNotificationsEnabled', checked)}
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
                <Label htmlFor="testEmail" className="text-sm font-medium">
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
                  <Button onClick={handleTestEmail} variant="outline">
                    <TestTube className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="emailQueueEnabled" className="text-sm font-medium">
                  Email Queue Enabled
                </Label>
                <Switch
                  id="emailQueueEnabled"
                  checked={settings.emailQueueEnabled}
                  onCheckedChange={(checked) => handleSettingChange('emailQueueEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="bounceHandlingEnabled" className="text-sm font-medium">
                  Bounce Handling
                </Label>
                <Switch
                  id="bounceHandlingEnabled"
                  checked={settings.bounceHandlingEnabled}
                  onCheckedChange={(checked) => handleSettingChange('bounceHandlingEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700">
            Save Email Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsEmail;