import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Bell, Clock, Mail, MessageSquare, Shield, Save, AlertTriangle } from "lucide-react";

const AdminSupportSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // General Settings
    supportEmail: "support@buildtrust.com",
    supportPhone: "+1 (555) 123-4567",
    businessHours: "Mon-Fri 9AM-6PM EST",
    autoResponseEnabled: true,
    autoResponseMessage: "Thank you for contacting BuildTrust support. We have received your message and will respond within 24 hours.",

    // Ticket Settings
    autoAssignTickets: true,
    maxTicketsPerAgent: 10,
    ticketEscalationHours: 48,
    requireTicketApproval: false,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    slackNotifications: true,
    webhookUrl: "",

    // SLA Settings
    urgentResponseTime: 1, // hours
    highResponseTime: 4, // hours
    mediumResponseTime: 24, // hours
    lowResponseTime: 72, // hours

    // Security Settings
    requireAuthentication: true,
    allowFileUploads: true,
    maxFileSize: 10, // MB
    allowedFileTypes: ".pdf,.doc,.docx,.jpg,.png",

    // Advanced Settings
    enableChatbot: false,
    enableKnowledgeBase: true,
    enableTicketTemplates: true,
    enableAnalytics: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      // In a real app, this would make an API call
      console.log("Saving support settings:", settings);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
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
                onClick={() => navigate('/admin/support')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Support</span>
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">Support Settings</h1>
                <p className="text-sm text-gray-500">Configure support system settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleSaveSettings}
                className="bg-red-600 hover:bg-red-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessHours">Business Hours</Label>
                <Input
                  id="businessHours"
                  value={settings.businessHours}
                  onChange={(e) => handleInputChange('businessHours', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoResponse">Auto Response</Label>
                  <Switch
                    id="autoResponse"
                    checked={settings.autoResponseEnabled}
                    onCheckedChange={(checked) => handleInputChange('autoResponseEnabled', checked)}
                  />
                </div>
                {settings.autoResponseEnabled && (
                  <Textarea
                    value={settings.autoResponseMessage}
                    onChange={(e) => handleInputChange('autoResponseMessage', e.target.value)}
                    placeholder="Auto response message"
                    rows={3}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Ticket Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoAssign">Auto Assign Tickets</Label>
                    <Switch
                      id="autoAssign"
                      checked={settings.autoAssignTickets}
                      onCheckedChange={(checked) => handleInputChange('autoAssignTickets', checked)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireApproval">Require Ticket Approval</Label>
                    <Switch
                      id="requireApproval"
                      checked={settings.requireTicketApproval}
                      onCheckedChange={(checked) => handleInputChange('requireTicketApproval', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxTickets">Max Tickets per Agent</Label>
                  <Input
                    id="maxTickets"
                    type="number"
                    value={settings.maxTicketsPerAgent}
                    onChange={(e) => handleInputChange('maxTicketsPerAgent', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escalationHours">Escalation Hours</Label>
                  <Input
                    id="escalationHours"
                    type="number"
                    value={settings.ticketEscalationHours}
                    onChange={(e) => handleInputChange('ticketEscalationHours', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SLA Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>SLA Settings (Response Time in Hours)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="urgentResponse">Urgent Priority</Label>
                  <Input
                    id="urgentResponse"
                    type="number"
                    value={settings.urgentResponseTime}
                    onChange={(e) => handleInputChange('urgentResponseTime', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highResponse">High Priority</Label>
                  <Input
                    id="highResponse"
                    type="number"
                    value={settings.highResponseTime}
                    onChange={(e) => handleInputChange('highResponseTime', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mediumResponse">Medium Priority</Label>
                  <Input
                    id="mediumResponse"
                    type="number"
                    value={settings.mediumResponseTime}
                    onChange={(e) => handleInputChange('mediumResponseTime', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowResponse">Low Priority</Label>
                  <Input
                    id="lowResponse"
                    type="number"
                    value={settings.lowResponseTime}
                    onChange={(e) => handleInputChange('lowResponseTime', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotif">Email Notifications</Label>
                  <Switch
                    id="emailNotif"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotif">SMS Notifications</Label>
                  <Switch
                    id="smsNotif"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="slackNotif">Slack Notifications</Label>
                  <Switch
                    id="slackNotif"
                    checked={settings.slackNotifications}
                    onCheckedChange={(checked) => handleInputChange('slackNotifications', checked)}
                  />
                </div>
              </div>

              {settings.slackNotifications && (
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Slack Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={settings.webhookUrl}
                    onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireAuth">Require Authentication</Label>
                  <Switch
                    id="requireAuth"
                    checked={settings.requireAuthentication}
                    onCheckedChange={(checked) => handleInputChange('requireAuthentication', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowUploads">Allow File Uploads</Label>
                  <Switch
                    id="allowUploads"
                    checked={settings.allowFileUploads}
                    onCheckedChange={(checked) => handleInputChange('allowFileUploads', checked)}
                  />
                </div>
              </div>

              {settings.allowFileUploads && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowedTypes">Allowed File Types</Label>
                    <Input
                      id="allowedTypes"
                      value={settings.allowedFileTypes}
                      onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                      placeholder=".pdf,.doc,.jpg,..."
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Advanced Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableChatbot">Enable Chatbot</Label>
                  <Switch
                    id="enableChatbot"
                    checked={settings.enableChatbot}
                    onCheckedChange={(checked) => handleInputChange('enableChatbot', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableKB">Enable Knowledge Base</Label>
                  <Switch
                    id="enableKB"
                    checked={settings.enableKnowledgeBase}
                    onCheckedChange={(checked) => handleInputChange('enableKnowledgeBase', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableTemplates">Enable Ticket Templates</Label>
                  <Switch
                    id="enableTemplates"
                    checked={settings.enableTicketTemplates}
                    onCheckedChange={(checked) => handleInputChange('enableTicketTemplates', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                  <Switch
                    id="enableAnalytics"
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportSettings;