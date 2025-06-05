import { useState, useEffect } from 'react';
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
  EyeOff,
  Info
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { validateAPIKey, getAPIKeyInstructions } from '@/utils/apiValidation';
import { useUserSettingsStore } from '@/stores/useUserSettingsStore';

const Integrations = () => {
  const { toast } = useToast();
  const { connectedIntegrations, addIntegration, removeIntegration, syncIntegration, loadFromDatabase } = useUserSettingsStore();
  
  const [availableIntegrations, setAvailableIntegrations] = useState([
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'E-commerce platform for online stores and retail point-of-sale systems',
      logo: '🛍️',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Web analytics service for tracking website traffic and user behavior',
      logo: '📊',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'amazon-seller-central',
      name: 'Amazon Seller Central',
      description: 'Platform for managing Amazon marketplace sales and inventory',
      logo: '📦',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      description: 'WordPress e-commerce plugin for online stores',
      logo: '🛒',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'facebook-ads',
      name: 'Facebook Ads',
      description: 'Social media advertising platform for targeted marketing campaigns',
      logo: '📘',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Social media platform for visual content and business engagement',
      logo: '📷',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'bigcommerce',
      name: 'BigCommerce',
      description: 'E-commerce platform for growing and established businesses',
      logo: '🏪',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'etsy',
      name: 'Etsy',
      description: 'Marketplace for unique and creative goods',
      logo: '🎨',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'square',
      name: 'Square',
      description: 'Payment processing and point-of-sale solutions',
      logo: '⬜',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'wix-commerce',
      name: 'Wix Commerce',
      description: 'Website builder with integrated e-commerce capabilities',
      logo: '🌐',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    },
    {
      id: 'adobe-commerce',
      name: 'Adobe Commerce',
      description: 'Enterprise e-commerce platform formerly known as Magento',
      logo: '🔺',
      apiKey: '',
      isConnecting: false,
      showApiKey: false,
      showInstructions: false
    }
  ]);

  const [newIntegration, setNewIntegration] = useState({
    name: '',
    apiKey: '',
    webhookUrl: ''
  });

  useEffect(() => {
    loadFromDatabase();
  }, [loadFromDatabase]);

  const isIntegrationConnected = (integrationId: string) => {
    return connectedIntegrations.some(int => int.id === integrationId && int.status === 'connected');
  };

  const getConnectedIntegration = (integrationId: string) => {
    return connectedIntegrations.find(int => int.id === integrationId);
  };

  const handleConnect = async (integrationId: string) => {
    const integration = availableIntegrations.find(int => int.id === integrationId);
    if (!integration?.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key before connecting.",
        variant: "destructive"
      });
      return;
    }

    setAvailableIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId ? { ...int, isConnecting: true } : int
      )
    );

    try {
      const validationResult = await validateAPIKey(integration.name, integration.apiKey);
      
      if (!validationResult.isValid) {
        toast({
          title: "Invalid API Key",
          description: validationResult.message,
          variant: "destructive"
        });
        return;
      }

      // Add to connected integrations
      addIntegration({
        id: integrationId,
        name: integration.name,
        status: 'connected',
        lastSync: 'Just now',
        apiKey: integration.apiKey,
        connectionData: validationResult.connectionData
      });

      toast({
        title: "Integration Connected",
        description: `${integration.name} has been successfully connected and validated.`
      });

      // Clear the API key from the form
      setAvailableIntegrations(prev =>
        prev.map(int =>
          int.id === integrationId ? { ...int, apiKey: '', showApiKey: false } : int
        )
      );
      
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to validate API key. Please check your key and try again.",
        variant: "destructive"
      });
    } finally {
      setAvailableIntegrations(prev =>
        prev.map(int =>
          int.id === integrationId ? { ...int, isConnecting: false } : int
        )
      );
    }
  };

  const handleDisconnect = (integrationId: string) => {
    const integration = getConnectedIntegration(integrationId);
    if (integration) {
      removeIntegration(integrationId);
      toast({
        title: "Integration Disconnected",
        description: `${integration.name} has been disconnected.`
      });
    }
  };

  const handleSync = async (integrationId: string) => {
    const integration = getConnectedIntegration(integrationId);
    if (!integration) return;

    toast({
      title: "Syncing Data",
      description: `Syncing data from ${integration.name}...`
    });

    setTimeout(() => {
      syncIntegration(integrationId);
      toast({
        title: "Sync Complete",
        description: `Data from ${integration.name} has been synced successfully.`
      });
    }, 3000);
  };

  const handleApiKeyChange = (integrationId: string, value: string) => {
    setAvailableIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId ? { ...int, apiKey: value } : int
      )
    );
  };

  const toggleApiKeyVisibility = (integrationId: string) => {
    setAvailableIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId ? { ...int, showApiKey: !int.showApiKey } : int
      )
    );
  };

  const toggleInstructions = (integrationId: string) => {
    setAvailableIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId ? { ...int, showInstructions: !int.showInstructions } : int
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
              <p className="text-gray-600 dark:text-gray-300">Connect your data sources with valid API credentials</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Connected Integrations */}
          {connectedIntegrations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connected Integrations</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {connectedIntegrations.map((integration) => (
                  <Card key={integration.id} className="border-green-200 dark:border-green-800">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {availableIntegrations.find(ai => ai.id === integration.id)?.logo || '🔌'}
                          </span>
                          <div>
                            <CardTitle className="text-lg text-green-700 dark:text-green-300">
                              {integration.name}
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              Last sync: {integration.lastSync}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200">
                          Connected
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
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
                          className="flex-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available Integrations */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Available Integrations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableIntegrations
                .filter(integration => !isIntegrationConnected(integration.id))
                .map((integration) => (
                <Card key={integration.id}>
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
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200">
                        Disconnected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">API Key *</Label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleInstructions(integration.id)}
                          className="h-6 px-2 text-xs"
                        >
                          <Info className="w-3 h-3 mr-1" />
                          Help
                        </Button>
                      </div>
                      
                      {integration.showInstructions && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            {getAPIKeyInstructions(integration.name)}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type={integration.showApiKey ? "text" : "password"}
                          value={integration.apiKey}
                          onChange={(e) => handleApiKeyChange(integration.id, e.target.value)}
                          placeholder="Enter your API key"
                          className="text-sm"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleApiKeyVisibility(integration.id)}
                          className="px-3 shrink-0"
                        >
                          {integration.showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleConnect(integration.id)}
                      className="w-full"
                      disabled={integration.isConnecting || !integration.apiKey.trim()}
                    >
                      {integration.isConnecting ? 'Validating...' : 'Connect & Validate'}
                    </Button>
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
