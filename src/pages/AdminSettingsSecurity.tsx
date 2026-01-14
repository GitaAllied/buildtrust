import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Lock, Shield, Key, Eye, EyeOff, ArrowLeft, AlertTriangle } from "lucide-react";

const AdminSettingsSecurity = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
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

  const [showPasswords, setShowPasswords] = useState({
    adminPassword: false,
    apiKey: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log("Saving security settings:", settings);
    alert("Security settings saved successfully!");
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
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
                onClick={() => navigate('/admin/settings')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Settings</span>
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
                <p className="text-sm text-gray-500">Authentication and access control</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 hidden sm:block">
              <Shield className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="passwordMinLength" className="text-right">
                  Min Length
                </Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                  className="col-span-3"
                  min="6"
                  max="32"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="passwordRequireUppercase" className="text-sm font-medium">
                  Require Uppercase Letters
                </Label>
                <Switch
                  id="passwordRequireUppercase"
                  checked={settings.passwordRequireUppercase}
                  onCheckedChange={(checked) => handleSettingChange('passwordRequireUppercase', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="passwordRequireLowercase" className="text-sm font-medium">
                  Require Lowercase Letters
                </Label>
                <Switch
                  id="passwordRequireLowercase"
                  checked={settings.passwordRequireLowercase}
                  onCheckedChange={(checked) => handleSettingChange('passwordRequireLowercase', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="passwordRequireNumbers" className="text-sm font-medium">
                  Require Numbers
                </Label>
                <Switch
                  id="passwordRequireNumbers"
                  checked={settings.passwordRequireNumbers}
                  onCheckedChange={(checked) => handleSettingChange('passwordRequireNumbers', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="passwordRequireSpecialChars" className="text-sm font-medium">
                  Require Special Characters
                </Label>
                <Switch
                  id="passwordRequireSpecialChars"
                  checked={settings.passwordRequireSpecialChars}
                  onCheckedChange={(checked) => handleSettingChange('passwordRequireSpecialChars', checked)}
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxLoginAttempts" className="text-right">
                  Max Login Attempts
                </Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="col-span-3"
                  min="3"
                  max="10"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lockoutDuration" className="text-right">
                  Lockout Duration (min)
                </Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  value={settings.lockoutDuration}
                  onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value))}
                  className="col-span-3"
                  min="5"
                  max="1440"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sessionTimeout" className="text-right">
                  Session Timeout (min)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="col-span-3"
                  min="15"
                  max="480"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="twoFactorRequired" className="text-sm font-medium">
                  Two-Factor Authentication Required
                </Label>
                <Switch
                  id="twoFactorRequired"
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorRequired', checked)}
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
                <Label htmlFor="ipWhitelistEnabled" className="text-sm font-medium">
                  IP Whitelist Enabled
                </Label>
                <Switch
                  id="ipWhitelistEnabled"
                  checked={settings.ipWhitelistEnabled}
                  onCheckedChange={(checked) => handleSettingChange('ipWhitelistEnabled', checked)}
                />
              </div>
              {settings.ipWhitelistEnabled && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ipWhitelist" className="text-right">
                    Allowed IPs
                  </Label>
                  <Textarea
                    id="ipWhitelist"
                    value={settings.ipWhitelist}
                    onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
                    className="col-span-3"
                    placeholder="192.168.1.0/24&#10;10.0.0.1&#10;203.0.113.5"
                    rows={3}
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <Label htmlFor="bruteForceProtection" className="text-sm font-medium">
                  Brute Force Protection
                </Label>
                <Switch
                  id="bruteForceProtection"
                  checked={settings.bruteForceProtection}
                  onCheckedChange={(checked) => handleSettingChange('bruteForceProtection', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="rateLimitingEnabled" className="text-sm font-medium">
                  Rate Limiting
                </Label>
                <Switch
                  id="rateLimitingEnabled"
                  checked={settings.rateLimitingEnabled}
                  onCheckedChange={(checked) => handleSettingChange('rateLimitingEnabled', checked)}
                />
              </div>
              {settings.rateLimitingEnabled && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apiRateLimit" className="text-right">
                    API Rate Limit (req/min)
                  </Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
                    className="col-span-3"
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="encryptionMethod" className="text-right">
                  Encryption Method
                </Label>
                <Select value={settings.encryptionMethod} onValueChange={(value) => handleSettingChange('encryptionMethod', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AES256">AES-256</SelectItem>
                    <SelectItem value="AES128">AES-128</SelectItem>
                    <SelectItem value="RSA2048">RSA-2048</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="backupEncryption" className="text-sm font-medium">
                  Encrypt Backups
                </Label>
                <Switch
                  id="backupEncryption"
                  checked={settings.backupEncryption}
                  onCheckedChange={(checked) => handleSettingChange('backupEncryption', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auditLogging" className="text-sm font-medium">
                  Audit Logging
                </Label>
                <Switch
                  id="auditLogging"
                  checked={settings.auditLogging}
                  onCheckedChange={(checked) => handleSettingChange('auditLogging', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="suspiciousActivityAlerts" className="text-sm font-medium">
                  Suspicious Activity Alerts
                </Label>
                <Switch
                  id="suspiciousActivityAlerts"
                  checked={settings.suspiciousActivityAlerts}
                  onCheckedChange={(checked) => handleSettingChange('suspiciousActivityAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700">
            Save Security Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsSecurity;