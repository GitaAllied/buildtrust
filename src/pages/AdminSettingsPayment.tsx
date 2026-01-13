import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { CreditCard, DollarSign, Settings, Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";

const AdminSettingsPayment = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
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

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
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
                <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
                <p className="text-sm text-gray-500">Payment gateways and transaction configuration</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 hidden sm:block">
              <CreditCard className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="primaryGateway" className="text-right">
                  Primary Gateway
                </Label>
                <Select value={settings.primaryGateway} onValueChange={(value) => handleSettingChange('primaryGateway', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flutterwave">Flutterwave</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Currency
                </Label>
                <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="flutterwavePublicKey" className="text-right">
                  Public Key
                </Label>
                <Input
                  id="flutterwavePublicKey"
                  value={settings.flutterwavePublicKey}
                  onChange={(e) => handleSettingChange('flutterwavePublicKey', e.target.value)}
                  className="col-span-3"
                  placeholder="FLWPUBK-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-X"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="flutterwaveSecretKey" className="text-right">
                  Secret Key
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="flutterwaveSecretKey"
                    type={showKeys.flutterwaveSecret ? "text" : "password"}
                    value={settings.flutterwaveSecretKey}
                    onChange={(e) => handleSettingChange('flutterwaveSecretKey', e.target.value)}
                    placeholder="FLWSECK-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-X"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => toggleKeyVisibility('flutterwaveSecret')}
                  >
                    {showKeys.flutterwaveSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="flutterwaveEncryptionKey" className="text-right">
                  Encryption Key
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="flutterwaveEncryptionKey"
                    type={showKeys.flutterwaveEncryption ? "text" : "password"}
                    value={settings.flutterwaveEncryptionKey}
                    onChange={(e) => handleSettingChange('flutterwaveEncryptionKey', e.target.value)}
                    placeholder="FLWSECK_TESTXXXXXXXXXXXXXXXX"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => toggleKeyVisibility('flutterwaveEncryption')}
                  >
                    {showKeys.flutterwaveEncryption ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                <Label htmlFor="escrowEnabled" className="text-sm font-medium">
                  Escrow Enabled
                </Label>
                <Switch
                  id="escrowEnabled"
                  checked={settings.escrowEnabled}
                  onCheckedChange={(checked) => handleSettingChange('escrowEnabled', checked)}
                />
              </div>
              {settings.escrowEnabled && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="escrowPercentage" className="text-right">
                      Escrow Percentage (%)
                    </Label>
                    <Input
                      id="escrowPercentage"
                      type="number"
                      value={settings.escrowPercentage}
                      onChange={(e) => handleSettingChange('escrowPercentage', parseFloat(e.target.value))}
                      className="col-span-3"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoReleaseEscrow" className="text-sm font-medium">
                      Auto Release Escrow
                    </Label>
                    <Switch
                      id="autoReleaseEscrow"
                      checked={settings.autoReleaseEscrow}
                      onCheckedChange={(checked) => handleSettingChange('autoReleaseEscrow', checked)}
                    />
                  </div>
                  {settings.autoReleaseEscrow && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="escrowReleaseDays" className="text-right">
                        Release After (days)
                      </Label>
                      <Input
                        id="escrowReleaseDays"
                        type="number"
                        value={settings.escrowReleaseDays}
                        onChange={(e) => handleSettingChange('escrowReleaseDays', parseInt(e.target.value))}
                        className="col-span-3"
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platformFee" className="text-right">
                  Platform Fee (%)
                </Label>
                <Input
                  id="platformFee"
                  type="number"
                  value={settings.platformFee}
                  onChange={(e) => handleSettingChange('platformFee', parseFloat(e.target.value))}
                  className="col-span-3"
                  min="0"
                  max="50"
                  step="0.1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minimumProjectAmount" className="text-right">
                  Min Project Amount
                </Label>
                <Input
                  id="minimumProjectAmount"
                  type="number"
                  value={settings.minimumProjectAmount}
                  onChange={(e) => handleSettingChange('minimumProjectAmount', parseInt(e.target.value))}
                  className="col-span-3"
                  min="100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maximumProjectAmount" className="text-right">
                  Max Project Amount
                </Label>
                <Input
                  id="maximumProjectAmount"
                  type="number"
                  value={settings.maximumProjectAmount}
                  onChange={(e) => handleSettingChange('maximumProjectAmount', parseInt(e.target.value))}
                  className="col-span-3"
                  min="1000"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentRetries" className="text-right">
                  Payment Retries
                </Label>
                <Input
                  id="paymentRetries"
                  type="number"
                  value={settings.paymentRetries}
                  onChange={(e) => handleSettingChange('paymentRetries', parseInt(e.target.value))}
                  className="col-span-3"
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
                <h4 className="font-medium mb-3">PayPal Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="PayPal Client ID"
                    value={settings.paypalClientId}
                    onChange={(e) => handleSettingChange('paypalClientId', e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      type={showKeys.paypalSecret ? "text" : "password"}
                      placeholder="PayPal Client Secret"
                      value={settings.paypalClientSecret}
                      onChange={(e) => handleSettingChange('paypalClientSecret', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => toggleKeyVisibility('paypalSecret')}
                    >
                      {showKeys.paypalSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stripe */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Stripe Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Stripe Publishable Key"
                    value={settings.stripePublishableKey}
                    onChange={(e) => handleSettingChange('stripePublishableKey', e.target.value)}
                  />
                  <div className="relative">
                    <Input
                      type={showKeys.stripeSecret ? "text" : "password"}
                      placeholder="Stripe Secret Key"
                      value={settings.stripeSecretKey}
                      onChange={(e) => handleSettingChange('stripeSecretKey', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => toggleKeyVisibility('stripeSecret')}
                    >
                      {showKeys.stripeSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Webhook Settings */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Webhook Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type={showKeys.webhookSecret ? "text" : "password"}
                      placeholder="Webhook Secret"
                      value={settings.webhookSecret}
                      onChange={(e) => handleSettingChange('webhookSecret', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => toggleKeyVisibility('webhookSecret')}
                    >
                      {showKeys.webhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="disputeResolutionEnabled"
                      checked={settings.disputeResolutionEnabled}
                      onCheckedChange={(checked) => handleSettingChange('disputeResolutionEnabled', checked)}
                    />
                    <Label htmlFor="disputeResolutionEnabled" className="text-sm">
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
          <Button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700">
            Save Payment Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPayment;