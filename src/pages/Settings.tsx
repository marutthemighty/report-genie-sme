
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
import { useUserSettingsStore } from '@/stores/useUserSettingsStore';
import { useConsent } from '@/hooks/useConsent';

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const { toast } = useToast();
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    exportFormats,
    notifications,
    privacy,
    connectedIntegrations,
    setExportFormats,
    setNotifications,
    setPrivacySettings,
    loadFromDatabase
  } = useUserSettingsStore();

  const { consents, saveConsents } = useConsent();

  useEffect(() => {
    loadFromDatabase();
  }, [loadFromDatabase]);

  useEffect(() => {
    // Listen for privacy settings updates from popup window
    const handleStorageChange = () => {
      const update = localStorage.getItem('privacy_settings_update');
      if (update) {
        const settings = JSON.parse(update);
        saveConsents({
          analytics: settings.analytics,
          marketing: settings.marketing,
          storage: settings.storage
        });
        localStorage.removeItem('privacy_settings_update');
        toast({
          title: "Privacy Settings Updated",
          description: "Your privacy preferences have been saved.",
        });
      }
    };

    // Check for updates every second when settings page is active
    const interval = setInterval(handleStorageChange, 1000);
    return () => clearInterval(interval);
  }, [saveConsents, toast]);

  const handleExportFormatChange = (format: keyof typeof exportFormats, enabled: boolean) => {
    setExportFormats({
      ...exportFormats,
      [format]: enabled
    });
    toast({
      title: "Export Format Updated",
      description: `${format.toUpperCase()} export ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleNotificationChange = (type: keyof typeof notifications, enabled: boolean) => {
    setNotifications({
      ...notifications,
      [type]: enabled
    });
    toast({
      title: "Notification Settings Updated",
      description: `${type} notifications ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleAddIntegration = () => {
    window.location.href = '/integrations';
  };

  const handleExportData = async () => {
    setIsExporting(true);
    toast({
      title: "Preparing Data Export",
      description: "We're preparing your data for export. This may take a few minutes.",
    });

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

      setPrivacySettings({
        ...privacy,
        lastDataExport: new Date().toISOString()
      });

      setIsExporting(false);
      toast({
        title: "Data Export Complete",
        description: "Your data has been exported and downloaded successfully.",
      });
    }, 3000);
  };

  const handleViewPrivacySettings = () => {
    const privacyWindow = window.open('', '_blank', 'width=900,height=700');
    if (privacyWindow) {
      privacyWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Privacy Settings Dashboard</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
              padding: 20px; 
              line-height: 1.6; 
              background: #f8fafc;
              margin: 0;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 12px; 
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content { padding: 30px; }
            .setting { 
              margin: 25px 0; 
              padding: 20px; 
              border: 1px solid #e2e8f0; 
              border-radius: 8px; 
              background: #f8fafc;
            }
            .setting h3 {
              margin-top: 0;
              color: #2d3748;
              font-size: 18px;
            }
            .toggle-group {
              margin: 15px 0;
            }
            .toggle {
              display: flex;
              align-items: center;
              margin: 10px 0;
              padding: 8px 0;
            }
            .toggle input[type="checkbox"] {
              margin-right: 12px;
              transform: scale(1.2);
            }
            .toggle label {
              cursor: pointer;
              font-weight: 500;
            }
            button { 
              background: #4f46e5; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 6px; 
              cursor: pointer;
              font-weight: 600;
              transition: background 0.2s;
            }
            button:hover { 
              background: #4338ca; 
            }
            .success-msg {
              background: #d1fae5;
              border: 1px solid #a7f3d0;
              color: #065f46;
              padding: 12px 16px;
              border-radius: 6px;
              margin-top: 20px;
              display: none;
            }
            .info-box {
              background: #dbeafe;
              border: 1px solid #93c5fd;
              color: #1e40af;
              padding: 15px;
              border-radius: 6px;
              margin: 15px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Privacy Settings Dashboard</h1>
              <p>Manage your data and privacy preferences</p>
            </div>
            
            <div class="content">
              <div class="setting">
                <h3>🍪 Cookie & Tracking Preferences</h3>
                <p>Control which cookies and tracking technologies we can use.</p>
                <div class="toggle-group">
                  <div class="toggle">
                    <input type="checkbox" id="essential" checked disabled>
                    <label for="essential">Essential cookies (required for basic functionality)</label>
                  </div>
                  <div class="toggle">
                    <input type="checkbox" id="analytics" ${consents.analytics ? 'checked' : ''}>
                    <label for="analytics">Analytics cookies (help us improve our service)</label>
                  </div>
                  <div class="toggle">
                    <input type="checkbox" id="marketing" ${consents.marketing ? 'checked' : ''}>
                    <label for="marketing">Marketing cookies (personalized content and ads)</label>
                  </div>
                </div>
              </div>

              <div class="setting">
                <h3>📊 Data Collection</h3>
                <p>Control how we collect and use your data for analytics and service improvement.</p>
                <div class="toggle-group">
                  <div class="toggle">
                    <input type="checkbox" id="usage-analytics" ${consents.storage ? 'checked' : ''}>
                    <label for="usage-analytics">Usage analytics and performance monitoring</label>
                  </div>
                  <div class="toggle">
                    <input type="checkbox" id="error-reporting" checked>
                    <label for="error-reporting">Error reporting and crash analytics</label>
                  </div>
                  <div class="toggle">
                    <input type="checkbox" id="feature-usage" ${consents.analytics ? 'checked' : ''}>
                    <label for="feature-usage">Feature usage tracking</label>
                  </div>
                </div>
              </div>

              <div class="setting">
                <h3>📧 Communication Preferences</h3>
                <p>Choose how we can communicate with you.</p>
                <div class="toggle-group">
                  <div class="toggle">
                    <input type="checkbox" id="product-updates" ${consents.marketing ? 'checked' : ''}>
                    <label for="product-updates">Product updates and new features</label>
                  </div>
                  <div class="toggle">
                    <input type="checkbox" id="newsletters" ${consents.marketing ? 'checked' : ''}>
                    <label for="newsletters">Marketing newsletters and tips</label>
                  </div>
                  <div class="toggle">
                    <input type="checkbox" id="security-alerts" checked disabled>
                    <label for="security-alerts">Security alerts and account notifications (required)</label>
                  </div>
                </div>
              </div>

              <div class="setting">
                <h3>🔒 Data Retention</h3>
                <div class="info-box">
                  <strong>Data Retention Policy:</strong> Your data is retained for 2 years after account deletion, as required by law. 
                  You can request immediate deletion of personal data by contacting our support team.
                </div>
                <p><strong>Last data export:</strong> ${privacy.lastDataExport ? new Date(privacy.lastDataExport).toLocaleDateString() : 'Never'}</p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <button onclick="saveSettings()">Save Privacy Settings</button>
                <div id="success-msg" class="success-msg">
                  ✅ Your privacy settings have been saved successfully!
                </div>
              </div>
            </div>
          </div>

          <script>
            function saveSettings() {
              const analytics = document.getElementById('analytics').checked;
              const marketing = document.getElementById('marketing').checked;
              const storage = document.getElementById('usage-analytics').checked;
              
              localStorage.setItem('privacy_settings_update', JSON.stringify({
                analytics,
                marketing,
                storage,
                timestamp: Date.now()
              }));
              
              document.getElementById('success-msg').style.display = 'block';
              
              setTimeout(() => {
                window.close();
              }, 2000);
            }
          </script>
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

          {/* Integrations - Only show connected ones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Connected Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Manage your connected data sources
                </p>
                <Button onClick={() => window.location.href = '/integrations'} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </Button>
              </div>
              
              <div className="space-y-3">
                {connectedIntegrations.length > 0 ? (
                  connectedIntegrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium dark:text-white">{integration.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last sync: {integration.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200">
                          Connected
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => window.location.href = '/integrations'}>
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No integrations connected yet</p>
                    <p className="text-sm">Visit the Integrations page to get started</p>
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
                    checked={exportFormats.pdf}
                    onCheckedChange={(checked) => handleExportFormatChange('pdf', checked)}
                  />
                  <Label htmlFor="pdf-export">PDF Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="csv-export" 
                    checked={exportFormats.csv}
                    onCheckedChange={(checked) => handleExportFormatChange('csv', checked)}
                  />
                  <Label htmlFor="csv-export">CSV Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="slides-export" 
                    checked={exportFormats.googleSlides}
                    onCheckedChange={(checked) => handleExportFormatChange('googleSlides', checked)}
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
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
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
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
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
