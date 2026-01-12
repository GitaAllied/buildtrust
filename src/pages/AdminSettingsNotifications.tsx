import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Bell, Mail, MessageSquare, Smartphone, ArrowLeft } from "lucide-react";

const AdminSettingsNotifications = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
                <p className="text-sm text-gray-500">Configure system notifications and alerts</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

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
                <Label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</Label>
                <Switch id="emailNotifications" checked={settings.emailNotifications} onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications" className="text-sm font-medium">SMS Notifications</Label>
                <Switch id="smsNotifications" checked={settings.smsNotifications} onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications" className="text-sm font-medium">Push Notifications</Label>
                <Switch id="pushNotifications" checked={settings.pushNotifications} onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)} />
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
                <Label htmlFor="newUserRegistration" className="text-sm font-medium">New User Registration</Label>
                <Switch id="newUserRegistration" checked={settings.newUserRegistration} onCheckedChange={(checked) => handleSettingChange('newUserRegistration', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="projectCreated" className="text-sm font-medium">Project Created</Label>
                <Switch id="projectCreated" checked={settings.projectCreated} onCheckedChange={(checked) => handleSettingChange('projectCreated', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="paymentReceived" className="text-sm font-medium">Payment Received</Label>
                <Switch id="paymentReceived" checked={settings.paymentReceived} onCheckedChange={(checked) => handleSettingChange('paymentReceived', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="projectCompleted" className="text-sm font-medium">Project Completed</Label>
                <Switch id="projectCompleted" checked={settings.projectCompleted} onCheckedChange={(checked) => handleSettingChange('projectCompleted', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="disputeRaised" className="text-sm font-medium">Dispute Raised</Label>
                <Switch id="disputeRaised" checked={settings.disputeRaised} onCheckedChange={(checked) => handleSettingChange('disputeRaised', checked)} />
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
                <Label htmlFor="smtpHost" className="text-xs sm:text-right">SMTP Host</Label>
                <Input id="smtpHost" value={settings.smtpHost} onChange={(e) => handleSettingChange('smtpHost', e.target.value)} className="sm:col-span-3 text-xs md:text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="smtpPort" className="text-xs sm:text-right">SMTP Port</Label>
                <Input id="smtpPort" type="number" value={settings.smtpPort} onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))} className="sm:col-span-3 text-xs md:text-sm" />
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
                <Label htmlFor="twilioSid" className="text-xs sm:text-right">Twilio SID</Label>
                <Input id="twilioSid" value={settings.twilioSid} onChange={(e) => handleSettingChange('twilioSid', e.target.value)} className="sm:col-span-3 text-xs md:text-sm" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="twilioToken" className="text-right">Twilio Token</Label>
                <Input id="twilioToken" type="password" value={settings.twilioToken} onChange={(e) => handleSettingChange('twilioToken', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fcmServerKey" className="text-right">FCM Server Key</Label>
                <Input id="fcmServerKey" type="password" value={settings.fcmServerKey} onChange={(e) => handleSettingChange('fcmServerKey', e.target.value)} className="col-span-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700">
            Save Notification Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsNotifications;