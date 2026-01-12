import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Database, HardDrive, Archive, Settings, ArrowLeft, Play, Square } from "lucide-react";

const AdminSettingsDatabase = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    databaseHost: "localhost",
    databasePort: 3306,
    databaseName: "buildtrust",
    databaseUser: "root",
    backupEnabled: true,
    backupFrequency: "daily",
    backupRetention: 30,
    backupLocation: "/var/backups/buildtrust",
    autoOptimize: true,
    queryLogging: false,
    slowQueryThreshold: 2,
    maxConnections: 100,
    connectionTimeout: 30,
    maintenanceEnabled: true,
    maintenanceSchedule: "weekly"
  });

  const [backupHistory, setBackupHistory] = useState([
    { id: 1, date: "2024-01-09 02:00:00", size: "2.3 GB", status: "completed", type: "automatic" },
    { id: 2, date: "2024-01-08 02:00:00", size: "2.2 GB", status: "completed", type: "automatic" },
    { id: 3, date: "2024-01-07 14:30:00", size: "1.8 GB", status: "completed", type: "manual" }
  ]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving database settings:", settings);
    alert("Database settings saved successfully!");
  };

  const handleManualBackup = () => {
    console.log("Starting manual backup...");
    alert("Manual backup started. This may take a few minutes.");
  };

  const handleOptimizeDatabase = () => {
    console.log("Optimizing database...");
    alert("Database optimization started.");
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
                <h1 className="text-2xl font-bold text-gray-900">Database Settings</h1>
                <p className="text-sm text-gray-500">Database configuration and maintenance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Database Connection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="databaseHost" className="text-xs sm:text-right">Host</Label>
                <Input id="databaseHost" value={settings.databaseHost} onChange={(e) => handleSettingChange('databaseHost', e.target.value)} className="sm:col-span-3 text-xs md:text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="databasePort" className="text-xs sm:text-right">Port</Label>
                <Input id="databasePort" type="number" value={settings.databasePort} onChange={(e) => handleSettingChange('databasePort', parseInt(e.target.value))} className="sm:col-span-3 text-xs md:text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="databaseName" className="text-xs sm:text-right">Database Name</Label>
                <Input id="databaseName" value={settings.databaseName} onChange={(e) => handleSettingChange('databaseName', e.target.value)} className="sm:col-span-3 text-xs md:text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="databaseUser" className="text-xs sm:text-right">Username</Label>
                <Input id="databaseUser" value={settings.databaseUser} onChange={(e) => handleSettingChange('databaseUser', e.target.value)} className="sm:col-span-3 text-xs md:text-sm" />
              </div>
            </CardContent>
          </Card>

          {/* Connection Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Connection Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="maxConnections" className="text-xs sm:text-right">Max Connections</Label>
                <Input id="maxConnections" type="number" value={settings.maxConnections} onChange={(e) => handleSettingChange('maxConnections', parseInt(e.target.value))} className="sm:col-span-3 text-xs md:text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="connectionTimeout" className="text-xs sm:text-right">Timeout (sec)</Label>
                <Input id="connectionTimeout" type="number" value={settings.connectionTimeout} onChange={(e) => handleSettingChange('connectionTimeout', parseInt(e.target.value))} className="sm:col-span-3 text-xs md:text-sm" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="queryLogging" className="text-sm font-medium">Query Logging</Label>
                <Switch id="queryLogging" checked={settings.queryLogging} onCheckedChange={(checked) => handleSettingChange('queryLogging', checked)} />
              </div>
              {settings.queryLogging && (
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                  <Label htmlFor="slowQueryThreshold" className="text-xs sm:text-right">Slow Query (sec)</Label>
                  <Input id="slowQueryThreshold" type="number" value={settings.slowQueryThreshold} onChange={(e) => handleSettingChange('slowQueryThreshold', parseFloat(e.target.value))} className="sm:col-span-3 text-xs md:text-sm" step="0.1" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Archive className="h-5 w-5" />
                <span>Backup Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="backupEnabled" className="text-sm font-medium">Automatic Backups</Label>
                <Switch id="backupEnabled" checked={settings.backupEnabled} onCheckedChange={(checked) => handleSettingChange('backupEnabled', checked)} />
              </div>
              {settings.backupEnabled && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <Label htmlFor="backupFrequency" className="text-xs sm:text-right">Frequency</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                      <SelectTrigger className="sm:col-span-3 text-xs md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                    <Label htmlFor="backupRetention" className="text-xs sm:text-right">Retention (days)</Label>
                    <Input id="backupRetention" type="number" value={settings.backupRetention} onChange={(e) => handleSettingChange('backupRetention', parseInt(e.target.value))} className="sm:col-span-3 text-xs md:text-sm" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="backupLocation" className="text-right">Backup Location</Label>
                    <Input id="backupLocation" value={settings.backupLocation} onChange={(e) => handleSettingChange('backupLocation', e.target.value)} className="col-span-3" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5" />
                <span>Maintenance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoOptimize" className="text-sm font-medium">Auto Optimize</Label>
                <Switch id="autoOptimize" checked={settings.autoOptimize} onCheckedChange={(checked) => handleSettingChange('autoOptimize', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenanceEnabled" className="text-sm font-medium">Scheduled Maintenance</Label>
                <Switch id="maintenanceEnabled" checked={settings.maintenanceEnabled} onCheckedChange={(checked) => handleSettingChange('maintenanceEnabled', checked)} />
              </div>
              {settings.maintenanceEnabled && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maintenanceSchedule" className="text-right">Schedule</Label>
                  <Select value={settings.maintenanceSchedule} onValueChange={(value) => handleSettingChange('maintenanceSchedule', value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex space-x-2">
                <Button onClick={handleManualBackup} className="flex-1">
                  <Archive className="h-4 w-4 mr-2" />
                  Manual Backup
                </Button>
                <Button onClick={handleOptimizeDatabase} variant="outline" className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Optimize DB
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Archive className="h-5 w-5" />
                <span>Backup History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupHistory.map((backup) => (
                  <div key={backup.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                    <div className="flex items-start sm:items-center space-x-4">
                      <Archive className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{backup.date}</p>
                        <p className="text-sm text-gray-500">Size: {backup.size} • Type: {backup.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        backup.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {backup.status}
                      </span>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700">
            Save Database Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsDatabase;