import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Shield,
  Mail,
  CreditCard,
  Database,
  Bell,
  Lock,
  Globe,
  FileText,
  AlertTriangle,
  ArrowLeft,
  ChevronRight
} from "lucide-react";

const AdminSettings = () => {
  const navigate = useNavigate();

  const settingsCategories = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Site configuration, localization, and basic platform settings',
      icon: Globe,
      path: '/admin/settings/general',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Authentication, access control, and data protection',
      icon: Shield,
      path: '/admin/settings/security',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'password',
      title: 'Change Password',
      description: 'Update administrator password and security credentials',
      icon: Lock,
      path: '/admin/settings/password',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'email',
      title: 'Email Configuration',
      description: 'SMTP settings, email templates, and notification preferences',
      icon: Mail,
      path: '/admin/settings/email',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'payment',
      title: 'Payment Settings',
      description: 'Payment gateways, escrow, fees, and transaction limits',
      icon: CreditCard,
      path: '/admin/settings/payment',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'System alerts, email/SMS/push notification configuration',
      icon: Bell,
      path: '/admin/settings/notifications',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'api',
      title: 'API Management',
      description: 'API keys, webhooks, rate limiting, and security',
      icon: Lock,
      path: '/admin/settings/api',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'database',
      title: 'Database Settings',
      description: 'Database configuration, backups, and maintenance',
      icon: Database,
      path: '/admin/settings/database',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'logs',
      title: 'System Logs',
      description: 'Activity monitoring, log management, and analytics',
      icon: FileText,
      path: '/admin/settings/logs',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Mode',
      description: 'Scheduled maintenance, downtime management, and user notifications',
      icon: AlertTriangle,
      path: '/admin/settings/maintenance',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const handleNavigateToSetting = (path: string) => {
    navigate(path);
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
                onClick={() => navigate('/super-admin-dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                <p className="text-sm text-gray-500">Configure and manage all platform settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Settings Categories</h2>
          <p className="text-sm text-gray-600">Choose a category to configure specific system settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer p-3 md:p-4"
                onClick={() => handleNavigateToSetting(category.path)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${category.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <CardTitle className="text-base md:text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <Button
                    variant="ghost"
                    className="mt-4 p-0 h-auto text-sm text-blue-600 hover:text-blue-800 w-full sm:w-auto text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToSetting(category.path);
                    }}
                  >
                    Configure Settings →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="justify-start w-full md:w-auto"
                  onClick={() => navigate('/admin/settings/maintenance')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Enable Maintenance Mode
                </Button>
                <Button
                  variant="outline"
                  className="justify-start w-full md:w-auto"
                  onClick={() => navigate('/admin/settings/logs')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View System Logs
                </Button>
                <Button
                  variant="outline"
                  className="justify-start w-full md:w-auto"
                  onClick={() => navigate('/admin/settings/database')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Database Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status Overview */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-xs md:text-sm text-gray-500">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">89</div>
                  <div className="text-sm text-gray-500">Active Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">23</div>
                  <div className="text-sm text-gray-500">Pending Payments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;