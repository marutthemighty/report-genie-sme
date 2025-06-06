
import { useState, useEffect } from 'react';
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
import { useUserSettings } from '@/hooks/useUserSettings';

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const { toast } = useToast();
  const { settings, loading, updateExportFormats, updateNotifications, updatePrivacySettings } = useUserSettings();
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    toast({
      title: "Preparing Data Export",
      description: "We're preparing your data for export. This may take a few minutes.",
    });

    // Simulate export process
    setTimeout(() => {
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
      
      // Update privacy settings to mark data export as used
      updatePrivacySettings({ dataExportEnabled: true });
      
      toast({
        title: "Data Export Complete",
        description: "Your data has been exported and downloaded successfully.",
      });
    }, 3000);
  };

  const handleViewPrivacySettings = () => {
    const currentSettings = settings.privacy_settings;
    
    const privacyWindow = window.open('', '_blank', 'width=800,height=600');
    if (privacyWindow) {
      privacyWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Privacy Settings</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .setting { margin: 20px 0; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa; }
            .setting h3 { margin-top: 0; color: #333; }
            .toggle { display: inline-block; margin-left: 10px; }
            button { background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-top: 20px; }
            button:hover { background: #2563eb; }
            label { display: block; margin: 10px 0; cursor: pointer; }
            input[type="checkbox"] { margin-right: 8px; }
            .saved-status { background: #d4edda; color: #155724; padding: 10px; border-radius: 4px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Privacy Settings</h1>
            <div class="setting">
              <h3>Data Collection</h3>
              <p>Control how we collect and use your data for analytics and service improvement.</p>
              <label><input type="checkbox" id="analytics" ${currentSettings.analytics ? 'checked' : ''}> Analytics tracking</label>
              <label><input type="checkbox" id="storage" ${currentSettings.storage ? 'checked' : ''}> Performance monitoring</label>
              <label><input type="checkbox" id="marketing" ${currentSettings.marketing ? 'checked' : ''}> Marketing communications</label>
            </div>
            <div class="setting">
              <h3>Cookie Preferences</h3>
              <p>Manage which cookies we can store on your device.</p>
              <label><input type="checkbox" checked disabled> Essential cookies (required)</label>
              <label><input type="checkbox" id="functional" checked> Functional cookies</label>
              <label><input type="checkbox" id="marketing-cookies" ${currentSettings.marketing ? 'checked' : ''}> Marketing cookies</label>
            </div>
            <div class="setting">
              <h3>Data Retention</h3>
              <p>Your data is retained for 2 years after account deletion, as required by law.</p>
              <button onclick="savePrivacySettings()">Save Privacy Settings</button>
              <div id="savedStatus" class="saved-status" style="display: none;">Settings saved successfully!</div>
            </div>
          </div>
          <script>
            function savePrivacySettings() {
              const analytics = document.getElementById('analytics').checked;
              const storage = document.getElementById('storage').checked;
              const marketing = document.getElementById('marketing').checked;
              
              // Save to parent window
              if (window.opener && window.opener.updatePrivacySettings) {
                window.opener.updatePrivacySettings({
                  analytics: analytics,
                  storage: storage,
                  marketing: marketing,
                  privacySettingsConfigured: true
                });
              }
              
              document.getElementById('savedStatus').style.display = 'block';
              setTimeout(() => {
                window.close();
              }, 1500);
            }
          </script>
        </body>
        </html>
      `);
      privacyWindow.document.close();
      
      // Make the function available to the popup
      (window as any).updatePrivacySettings = updatePrivacySettings;
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading settings...</div>
        </main>
      </div>
    );
  }

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

          {/* Data Integrations - Only show connected integrations */}
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
                  Connected data sources for report generation
                </p>
                <Button onClick={() => window.location.href = '/integrations'} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Integrations
                </Button>
              </div>
              
              <div className="space-y-3">
                {settings.connected_integrations.filter(int => int.status === 'connected').map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-gray-500">Last sync: {integration.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">connected</Badge>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/integrations'}>
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
                
                {settings.connected_integrations.filter(int => int.status === 'connected').length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No integrations connected yet</p>
                    <p className="text-sm">Visit the Integrations page to connect your data sources</p>
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
                  <Switch 
                    id="pdf-export" 
                    checked={settings.export_formats.pdf}
                    onCheckedChange={(checked) => updateExportFormats({ pdf: checked })}
                  />
                  <Label htmlFor="pdf-export">PDF Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="csv-export" 
                    checked={settings.export_formats.csv}
                    onCheckedChange={(checked) => updateExportFormats({ csv: checked })}
                  />
                  <Label htmlFor="csv-export">CSV Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="slides-export" 
                    checked={settings.export_formats.googleSlides}
                    onCheckedChange={(checked) => updateExportFormats({ googleSlides: checked })}
                  />
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
                    checked={settings.notification_email}
                    onCheckedChange={(checked) => updateNotifications({ email: checked })}
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
                    checked={settings.notification_push}
                    onCheckedChange={(checked) => updateNotifications({ push: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
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
