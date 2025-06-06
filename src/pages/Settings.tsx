
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Database, 
  Download, 
  Bell, 
  Shield, 
  User, 
  Trash2,
  Plus,
  Key
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ConsentModal from '@/components/ConsentModal';
import { useThemeStore } from '@/stores/useThemeStore';

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Realistic integration states - all start as disconnected
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Shopify', status: 'disconnected', lastSync: 'Never', apiKey: '' },
    { id: 2, name: 'Google Analytics', status: 'disconnected', lastSync: 'Never', apiKey: '' },
  ]);

  const handleAddIntegration = () => {
    // Navigate to integrations page or open integration modal
    window.location.href = '/integrations';
  };

  const handleExportData = async () => {
    setIsExporting(true);
    toast({
      title: "Preparing Data Export",
      description: "We're preparing your data for export. This may take a few minutes.",
    });

    // Simulate export process
    setTimeout(() => {
      // Create a sample CSV file
      const csvContent = `Date,Report Type,Status,Created By
${new Date().toISOString().split('T')[0]},Sales Performance,Completed,User
${new Date().toISOString().split('T')[0]},Customer Analysis,Completed,User
${new Date().toISOString().split('T')[0]},Product Performance,Completed,User`;

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsExporting(false);
      toast({
        title: "Data Export Complete",
        description: "Your data has been exported and downloaded successfully.",
      });
    }, 3000);
  };

  const handleViewPrivacySettings = () => {
    toast({
      title: "Privacy Settings",
      description: "Opening privacy dashboard...",
    });
    
    // Create a simple privacy settings modal/page
    const privacyWindow = window.open('', '_blank', 'width=800,height=600');
    if (privacyWindow) {
      privacyWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Privacy Settings</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; }
            .setting { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .toggle { display: inline-block; margin-left: 10px; }
            button { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
            button:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Privacy Settings</h1>
            <div class="setting">
              <h3>Data Collection</h3>
              <p>Control how we collect and use your data for analytics and service improvement.</p>
              <label><input type="checkbox" checked> Analytics tracking</label><br>
              <label><input type="checkbox" checked> Performance monitoring</label><br>
              <label><input type="checkbox"> Marketing communications</label>
            </div>
            <div class="setting">
              <h3>Cookie Preferences</h3>
              <p>Manage which cookies we can store on your device.</p>
              <label><input type="checkbox" checked disabled> Essential cookies (required)</label><br>
              <label><input type="checkbox" checked> Functional cookies</label><br>
              <label><input type="checkbox"> Marketing cookies</label>
            </div>
            <div class="setting">
              <h3>Data Retention</h3>
              <p>Your data is retained for 2 years after account deletion, as required by law.</p>
              <button onclick="alert('Settings saved!')">Save Privacy Settings</button>
            </div>
          </div>
        </body>
        </html>
      `);
      privacyWindow.document.close();
    }
  };

  const handleManageConsent = () => {
    setIsConsentModalOpen(true);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: "Account Deletion Initiated",
        description: "We've started the account deletion process. You'll receive a confirmation email within 24 hours.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Manage your account preferences and integrations</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred theme or sync with your system
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Connect your data sources to generate comprehensive reports
                </p>
                <Button onClick={handleAddIntegration} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </Button>
              </div>
              
              <div className="space-y-3">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-gray-500">Last sync: {integration.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={handleAddIntegration}>
                        {integration.status === 'connected' ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
                
                {integrations.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No integrations connected yet</p>
                    <p className="text-sm">Click "Add Integration" to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Export Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Formats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="pdf-export" defaultChecked />
                  <Label htmlFor="pdf-export">PDF Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="csv-export" defaultChecked />
                  <Label htmlFor="csv-export">CSV Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="slides-export" />
                  <Label htmlFor="slides-export">Google Slides</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive email updates about your reports
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get push notifications for important updates
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GDPR/CCPA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleExportData}
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Preparing Export...' : 'Export My Data'}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleViewPrivacySettings}>
                  <User className="w-4 h-4 mr-2" />
                  View Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleManageConsent}>
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Consent Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="pt-4">
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <ConsentModal 
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
      />
    </div>
  );
};

export default Settings;
