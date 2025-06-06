import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Plus, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { validateApiKey, getApiKeyFormat } from '@/utils/apiValidation';
import { useUserSettings } from '@/hooks/useUserSettings';

const Integrations = () => {
  const { toast } = useToast();
  const { settings, updateConnectedIntegrations } = useUserSettings();
  
  // Initialize integrations from settings or defaults
  const [integrations, setIntegrations] = useState(settings.connected_integrations.length > 0 ? 
    settings.connected_integrations.map(savedInt => ({
      id: parseInt(savedInt.id),
      name: savedInt.name,
      description: getIntegrationDescription(savedInt.name),
      status: savedInt.status,
      lastSync: savedInt.lastSync,
      enabled: savedInt.status === 'connected',
      apiKey: savedInt.apiKey,
      logo: getIntegrationLogo(savedInt.name),
      isConnecting: false,
      showApiKey: false
    })) :
    [
      {
        id: 1,
        name: 'Shopify',
        description: 'E-commerce platform for online stores and retail point-of-sale systems',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '🛍️',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 2,
        name: 'Google Analytics',
        description: 'Web analytics service for tracking website traffic and user behavior',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '📊',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 3,
        name: 'Amazon Seller Central',
        description: 'Platform for managing Amazon marketplace sales and inventory',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '📦',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 4,
        name: 'WooCommerce',
        description: 'WordPress e-commerce plugin for online stores',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '🛒',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 5,
        name: 'Facebook Ads',
        description: 'Social media advertising platform for targeted marketing campaigns',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '📘',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 6,
        name: 'Instagram',
        description: 'Social media platform for visual content and business engagement',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '📷',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 7,
        name: 'BigCommerce',
        description: 'E-commerce platform for growing and established businesses',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '🏪',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 8,
        name: 'Etsy',
        description: 'Marketplace for unique and creative goods',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '🎨',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 9,
        name: 'Square',
        description: 'Payment processing and point-of-sale solutions',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '⬜',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 10,
        name: 'Wix Commerce',
        description: 'Website builder with integrated e-commerce capabilities',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '🌐',
        isConnecting: false,
        showApiKey: false
      },
      {
        id: 11,
        name: 'Adobe Commerce',
        description: 'Enterprise e-commerce platform formerly known as Magento',
        status: 'disconnected',
        lastSync: 'Never',
        enabled: false,
        apiKey: '',
        logo: '🔺',
        isConnecting: false,
        showApiKey: false
      }
    ]
  );

  const [newIntegration, setNewIntegration] = useState({
    name: '',
    apiKey: '',
    webhookUrl: ''
  });

  function getIntegrationDescription(name: string): string {
    const descriptions: { [key: string]: string } = {
      'Shopify': 'E-commerce platform for online stores and retail point-of-sale systems',
      'Google Analytics': 'Web analytics service for tracking website traffic and user behavior',
      'Amazon Seller Central': 'Platform for managing Amazon marketplace sales and inventory',
      'WooCommerce': 'WordPress e-commerce plugin for online stores',
      'Facebook Ads': 'Social media advertising platform for targeted marketing campaigns',
      'Instagram': 'Social media platform for visual content and business engagement',
      'BigCommerce': 'E-commerce platform for growing and established businesses',
      'Etsy': 'Marketplace for unique and creative goods',
      'Square': 'Payment processing and point-of-sale solutions',
      'Wix Commerce': 'Website builder with integrated e-commerce capabilities',
      'Adobe Commerce': 'Enterprise e-commerce platform formerly known as Magento'
    };
    return descriptions[name] || 'Custom integration';
  }

  function getIntegrationLogo(name: string): string {
    const logos: { [key: string]: string } = {
      'Shopify': '🛍️',
      'Google Analytics': '📊',
      'Amazon Seller Central': '📦',
      'WooCommerce': '🛒',
      'Facebook Ads': '📘',
      'Instagram': '📷',
      'BigCommerce': '🏪',
      'Etsy': '🎨',
      'Square': '⬜',
      'Wix Commerce': '🌐',
      'Adobe Commerce': '🔺'
    };
    return logos[name] || '🔌';
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleConnect = async (id: number) => {
    const integration = integrations.find(int => int.id === id);
    if (!integration?.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key before connecting.",
        variant: "destructive"
      });
      return;
    }

    // Validate API key format
    const isValidKey = await validateApiKey(integration.name, integration.apiKey);
    if (!isValidKey) {
      toast({
        title: "Invalid API Key",
        description: `Invalid API key format for ${integration.name}. ${getApiKeyFormat(integration.name)}`,
        variant: "destructive"
      });
      return;
    }

    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, isConnecting: true }
          : integration
      )
    );

    // Simulate API validation call
    setTimeout(() => {
      const updatedIntegrations = integrations.map(integration =>
        integration.id === id
          ? { 
              ...integration, 
              status: 'connected', 
              lastSync: 'Just now',
              enabled: true,
              isConnecting: false
            }
          : integration
      );
      
      setIntegrations(updatedIntegrations);
      
      // Save to user settings
      const connectedIntegrations = updatedIntegrations
        .filter(int => int.status === 'connected')
        .map(int => ({
          id: int.id.toString(),
          name: int.name,
          status: int.status,
          apiKey: int.apiKey,
          lastSync: int.lastSync
        }));
      
      updateConnectedIntegrations(connectedIntegrations);
      
      toast({
        title: "Integration Connected",
        description: `${integration.name} has been successfully connected.`
      });
    }, 2000);
  };

  const handleDisconnect = (id: number) => {
    const updatedIntegrations = integrations.map(integration =>
      integration.id === id
        ? { 
            ...integration, 
            status: 'disconnected', 
            lastSync: 'Never', 
            enabled: false,
            apiKey: ''
          }
        : integration
    );
    
    setIntegrations(updatedIntegrations);
    
    // Update user settings
    const connectedIntegrations = updatedIntegrations
      .filter(int => int.status === 'connected')
      .map(int => ({
        id: int.id.toString(),
        name: int.name,
        status: int.status,
        apiKey: int.apiKey,
        lastSync: int.lastSync
      }));
    
    updateConnectedIntegrations(connectedIntegrations);
    
    toast({
      title: "Integration Disconnected",
      description: "The integration has been disconnected."
    });
  };

  const handleSync = async (id: number) => {
    const integration = integrations.find(int => int.id === id);
    toast({
      title: "Syncing Data",
      description: `Syncing data from ${integration?.name}...`
    });

    setTimeout(() => {
      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === id
            ? { ...integration, lastSync: 'Just now' }
            : integration
        )
      );
      toast({
        title: "Sync Complete",
        description: `Data from ${integration?.name} has been synced successfully.`
      });
    }, 3000);
  };

  const handleApiKeyChange = (id: number, value: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, apiKey: value }
          : integration
      )
    );
  };

  const toggleApiKeyVisibility = (id: number) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, showApiKey: !integration.showApiKey }
          : integration
      )
    );
  };

  const handleAddIntegration = () => {
    if (newIntegration.name && newIntegration.apiKey) {
      const newId = Math.max(...integrations.map(i => i.id)) + 1;
      setIntegrations(prev => [...prev, {
        id: newId,
        name: newIntegration.name,
        description: 'Custom integration',
        status: 'connected',
        lastSync: 'Just now',
        enabled: true,
        apiKey: newIntegration.apiKey,
        logo: '🔌',
        isConnecting: false,
        showApiKey: false
      }]);
      setNewIntegration({ name: '', apiKey: '', webhookUrl: '' });
      toast({
        title: "Integration Added",
        description: `${newIntegration.name} has been added successfully.`
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in the integration name and API key.",
        variant: "destructive"
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
            <Database className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
              <p className="text-gray-600 dark:text-gray-300">Connect your data sources and manage API integrations</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Available Integrations */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Available Integrations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id} className="h-fit">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.logo}</span>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusIcon(integration.status)}
                        <Badge className={`${getStatusColor(integration.status)} text-xs px-2 py-1 border`}>
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Last sync: {integration.lastSync}
                      </span>
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={(checked) => {
                          setIntegrations(prev =>
                            prev.map(int =>
                              int.id === integration.id ? { ...int, enabled: checked } : int
                            )
                          );
                        }}
                        disabled={integration.status !== 'connected'}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">API Key</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type={integration.showApiKey ? "text" : "password"}
                          value={integration.apiKey}
                          onChange={(e) => handleApiKeyChange(integration.id, e.target.value)}
                          placeholder="Enter your API key"
                          className="text-sm"
                          disabled={integration.status === 'connected'}
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleApiKeyVisibility(integration.id)}
                          className="px-3"
                        >
                          {integration.showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSync(integration.id)}
                            className="flex-1"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnect(integration.id)}
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(integration.id)}
                          className="w-full"
                          disabled={integration.isConnecting}
                        >
                          {integration.isConnecting ? 'Connecting...' : 'Connect'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add Custom Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Custom Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="integration-name">Integration Name</Label>
                  <Input
                    id="integration-name"
                    placeholder="e.g., Custom API"
                    value={newIntegration.name}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={newIntegration.apiKey}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-app.com/webhook"
                  value={newIntegration.webhookUrl}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, webhookUrl: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddIntegration} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Integrations;
