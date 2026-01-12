import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Key, Webhook, Shield, Lock, ArrowLeft, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

const AdminSettingsAPI = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    apiEnabled: true,
    rateLimitingEnabled: true,
    apiRateLimit: 1000,
    apiKeyExpiration: 365,
    webhookEnabled: true,
    webhookSecret: "",
    ipWhitelistEnabled: false,
    ipWhitelist: "",
    corsEnabled: true,
    corsOrigins: "*",
    apiVersion: "v1",
    documentationEnabled: true,
    loggingEnabled: true
  });

  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "Production API Key", key: "bt_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", created: "2024-01-01", expires: "2025-01-01", status: "active" },
    { id: 2, name: "Development API Key", key: "bt_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", created: "2024-01-01", expires: "2025-01-01", status: "active" }
  ]);

  const [webhooks, setWebhooks] = useState([
    { id: 1, url: "https://api.example.com/webhooks/payments", events: ["payment.completed", "payment.failed"], status: "active" },
    { id: 2, url: "https://api.example.com/webhooks/projects", events: ["project.created", "project.completed"], status: "active" }
  ]);

  const [showKeys, setShowKeys] = useState<{[key: number]: boolean}>({});

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving API settings:", settings);
    alert("API settings saved successfully!");
  };

  const toggleKeyVisibility = (id: number) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const generateNewApiKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      name: "New API Key",
      key: `bt_${Date.now().toString(36)}`,
      created: new Date().toISOString().split('T')[0],
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "active"
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const deleteApiKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
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
                <h1 className="text-2xl font-bold text-gray-900">API Settings</h1>
                <p className="text-sm text-gray-500">API keys, webhooks, and access control</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Key className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>API Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiEnabled" className="text-sm font-medium">API Enabled</Label>
                <Switch id="apiEnabled" checked={settings.apiEnabled} onCheckedChange={(checked) => handleSettingChange('apiEnabled', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="rateLimitingEnabled" className="text-sm font-medium">Rate Limiting</Label>
                <Switch id="rateLimitingEnabled" checked={settings.rateLimitingEnabled} onCheckedChange={(checked) => handleSettingChange('rateLimitingEnabled', checked)} />
              </div>
              {settings.rateLimitingEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                  <Label htmlFor="apiRateLimit" className="text-xs sm:text-right">Rate Limit (req/hour)</Label>
                  <Input id="apiRateLimit" type="number" value={settings.apiRateLimit} onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))} className="sm:col-span-3 text-xs md:text-sm" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="apiKeyExpiration" className="text-xs sm:text-right">Key Expiration (days)</Label>
                <Input id="apiKeyExpiration" type="number" value={settings.apiKeyExpiration} onChange={(e) => handleSettingChange('apiKeyExpiration', parseInt(e.target.value))} className="sm:col-span-3 text-xs md:text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="apiVersion" className="text-xs sm:text-right">API Version</Label>
                <Select value={settings.apiVersion} onValueChange={(value) => handleSettingChange('apiVersion', value)}>
                  <SelectTrigger className="sm:col-span-3 text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">v1 (Current)</SelectItem>
                    <SelectItem value="v2">v2 (Beta)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ipWhitelistEnabled" className="text-sm font-medium">IP Whitelist</Label>
                <Switch id="ipWhitelistEnabled" checked={settings.ipWhitelistEnabled} onCheckedChange={(checked) => handleSettingChange('ipWhitelistEnabled', checked)} />
              </div>
              {settings.ipWhitelistEnabled && (
                <Input placeholder="192.168.1.0/24, 10.0.0.1" value={settings.ipWhitelist} onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)} />
              )}
              <div className="flex items-center justify-between">
                <Label htmlFor="corsEnabled" className="text-sm font-medium">CORS Enabled</Label>
                <Switch id="corsEnabled" checked={settings.corsEnabled} onCheckedChange={(checked) => handleSettingChange('corsEnabled', checked)} />
              </div>
              {settings.corsEnabled && (
                <Input placeholder="*" value={settings.corsOrigins} onChange={(e) => handleSettingChange('corsOrigins', e.target.value)} />
              )}
              <div className="flex items-center justify-between">
                <Label htmlFor="loggingEnabled" className="text-sm font-medium">API Logging</Label>
                <Switch id="loggingEnabled" checked={settings.loggingEnabled} onCheckedChange={(checked) => handleSettingChange('loggingEnabled', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="documentationEnabled" className="text-sm font-medium">API Documentation</Label>
                <Switch id="documentationEnabled" checked={settings.documentationEnabled} onCheckedChange={(checked) => handleSettingChange('documentationEnabled', checked)} />
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>API Keys</span>
                </div>
                <Button onClick={generateNewApiKey} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{apiKey.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {apiKey.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="relative flex-1 max-w-md">
                          <Input
                            value={showKeys[apiKey.id] ? apiKey.key : '•'.repeat(apiKey.key.length)}
                            readOnly
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <span className="text-sm text-gray-500">Created: {apiKey.created}</span>
                        <span className="text-sm text-gray-500">Expires: {apiKey.expires}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => deleteApiKey(apiKey.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Webhooks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Webhook className="h-5 w-5" />
                <span>Webhooks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="webhookEnabled" className="text-sm font-medium">Webhooks Enabled</Label>
                <Switch id="webhookEnabled" checked={settings.webhookEnabled} onCheckedChange={(checked) => handleSettingChange('webhookEnabled', checked)} />
              </div>
              {settings.webhookEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                  <Label htmlFor="webhookSecret" className="text-xs sm:text-right">Webhook Secret</Label>
                  <Input id="webhookSecret" type="password" value={settings.webhookSecret} onChange={(e) => handleSettingChange('webhookSecret', e.target.value)} className="sm:col-span-3 text-xs md:text-sm" />
                </div>
              )}
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{webhook.url}</p>
                        <p className="text-sm text-gray-500">Events: {webhook.events.join(', ')}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          webhook.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {webhook.status}
                        </span>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700">
            Save API Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsAPI;