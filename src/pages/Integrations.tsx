
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Database, 
  Plus, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Trash2,
  RefreshCw
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const Integrations = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Shopify',
      description: 'E-commerce platform for online stores and retail point-of-sale systems',
      status: 'connected',
      lastSync: '2 hours ago',
      enabled: true,
      apiKey: 'sk_live_****1234',
      logo: '🛍️'
    },
    {
      id: 2,
      name: 'Google Analytics',
      description: 'Web analytics service for tracking website traffic and user behavior',
      status: 'disconnected',
      lastSync: 'Never',
      enabled: false,
      apiKey: '',
      logo: '📊'
    },
    {
      id: 3,
      name: 'Amazon Seller Central',
      description: 'Platform for managing Amazon marketplace sales and inventory',
      status: 'error',
      lastSync: '1 day ago',
      enabled: true,
      apiKey: 'amz_****5678',
      logo: '📦'
    },
    {
      id: 4,
      name: 'WooCommerce',
      description: 'WordPress e-commerce plugin for online stores',
      status: 'disconnected',
      lastSync: 'Never',
      enabled: false,
      apiKey: '',
      logo: '🛒'
    }
  ]);

  const [newIntegration, setNewIntegration] = useState({
    name: '',
    apiKey: '',
    webhookUrl: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleConnect = (id: number) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, status: 'connected', lastSync: 'Just now' }
          : integration
      )
    );
  };

  const handleDisconnect = (id: number) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, status: 'disconnected', lastSync: 'Never', enabled: false }
          : integration
      )
    );
  };

  const handleSync = (id: number) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, lastSync: 'Just now' }
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
        logo: '🔌'
      }]);
      setNewIntegration({ name: '', apiKey: '', webhookUrl: '' });
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.logo}</span>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <Badge className={getStatusColor(integration.status)}>
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
                      />
                    </div>

                    {integration.status === 'connected' && (
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-500">API Key</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={integration.apiKey}
                            disabled
                            className="text-sm"
                          />
                          <Button size="sm" variant="outline">
                            <Key className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSync(integration.id)}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnect(integration.id)}
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
                        >
                          Connect
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
