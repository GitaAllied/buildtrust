import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminSettingsMaintenance = () => {
  const navigate = useNavigate();

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
                <h1 className="text-2xl font-bold text-gray-900">Maintenance Mode (Removed)</h1>
                <p className="text-sm text-gray-500">This settings page has been removed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Removed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Maintenance controls have been removed from this interface. Use the 'Maintenance Mode' toggle under General Settings to control global maintenance behavior.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsMaintenance;

  const [scheduledMaintenance, setScheduledMaintenance] = useState([
    {
      id: 1,
      title: "Database Optimization",
      description: "Monthly database maintenance and optimization",
      startTime: "2024-01-15 02:00:00",
      endTime: "2024-01-15 04:00:00",
      status: "scheduled"
    },
    {
      id: 2,
      title: "Security Updates",
      description: "Critical security patches and updates",
      startTime: "2024-01-20 01:00:00",
      endTime: "2024-01-20 03:00:00",
      status: "scheduled"
    }
  ]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving maintenance settings:", settings);
    alert("Maintenance settings saved successfully!");
  };

  const handleToggleMaintenance = () => {
    const newMode = !settings.maintenanceMode;
    setSettings(prev => ({
      ...prev,
      maintenanceMode: newMode
    }));

    if (newMode) {
      alert("Maintenance mode enabled. The site is now in maintenance mode.");
    } else {
      alert("Maintenance mode disabled. The site is now live.");
    }
  };

  const handleScheduleMaintenance = () => {
    console.log("Scheduling maintenance...");
    alert("Maintenance scheduled successfully!");
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
                <h1 className="text-2xl font-bold text-gray-900">Maintenance Mode</h1>
                <p className="text-sm text-gray-500">Configure maintenance mode and scheduled maintenance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance Mode Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Maintenance Mode Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Maintenance Mode</h3>
                  <p className="text-sm text-gray-500">
                    {settings.maintenanceMode ? "Site is currently in maintenance mode" : "Site is live and operational"}
                  </p>
                </div>
                <Button
                  onClick={handleToggleMaintenance}
                  variant={settings.maintenanceMode ? "default" : "destructive"}
                  className={settings.maintenanceMode ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {settings.maintenanceMode ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume Site
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Enable Maintenance
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="maintenanceType" className="text-xs sm:text-right">Type</Label>
                <Select value={settings.maintenanceType} onValueChange={(value) => handleSettingChange('maintenanceType', value)}>
                  <SelectTrigger className="sm:col-span-3 text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="upgrade">System Upgrade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleSettingChange('maintenanceMessage', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Maintenance Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allowAdminAccess" className="text-sm font-medium">Allow Admin Access</Label>
                <Switch id="allowAdminAccess" checked={settings.allowAdminAccess} onCheckedChange={(checked) => handleSettingChange('allowAdminAccess', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showCountdown" className="text-sm font-medium">Show Countdown Timer</Label>
                <Switch id="showCountdown" checked={settings.showCountdown} onCheckedChange={(checked) => handleSettingChange('showCountdown', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyUsers" className="text-sm font-medium">Notify Users</Label>
                <Switch id="notifyUsers" checked={settings.notifyUsers} onCheckedChange={(checked) => handleSettingChange('notifyUsers', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoResume" className="text-sm font-medium">Auto Resume</Label>
                <Switch id="autoResume" checked={settings.autoResume} onCheckedChange={(checked) => handleSettingChange('autoResume', checked)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="redirectUrl" className="text-xs sm:text-right">Redirect URL</Label>
                <Input id="redirectUrl" value={settings.redirectUrl} onChange={(e) => handleSettingChange('redirectUrl', e.target.value)} className="sm:col-span-3 text-xs md:text-sm" placeholder="https://status.buildtrust.africa" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedIPs">Allowed IPs (one per line)</Label>
                <Textarea
                  id="allowedIPs"
                  value={settings.allowedIPs}
                  onChange={(e) => handleSettingChange('allowedIPs', e.target.value)}
                  placeholder="192.168.1.100&#10;10.0.0.1&#10;203.0.113.5"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Maintenance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Scheduled Maintenance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledMaintenance.map((maintenance) => (
                  <div key={maintenance.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{maintenance.title}</h4>
                      <p className="text-sm text-gray-600">{maintenance.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span>Start: {maintenance.startTime}</span>
                        <span>End: {maintenance.endTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-2 gap-2 sm:gap-0">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        maintenance.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        maintenance.status === 'active' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {maintenance.status}
                      </span>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Schedule New Maintenance</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Plan ahead for system maintenance windows
                  </p>
                  <Button onClick={handleScheduleMaintenance} className="mt-4">
                    Schedule Maintenance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Impact */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Maintenance Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1,247</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                  <div className="text-xs text-orange-600 mt-1">Will be affected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">89</div>
                  <div className="text-sm text-gray-500">Active Projects</div>
                  <div className="text-xs text-orange-600 mt-1">Will be paused</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-500">Pending Payments</div>
                  <div className="text-xs text-orange-600 mt-1">Will be delayed</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-orange-800">
                      Maintenance Notice
                    </h3>
                    <div className="mt-2 text-sm text-orange-700">
                      <p>
                        When maintenance mode is enabled, all user-facing features will be temporarily unavailable.
                        Only administrators will be able to access the system if "Allow Admin Access" is enabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700">
            Save Maintenance Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsMaintenance;