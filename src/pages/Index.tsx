import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart, Plus, Calendar, FileText, Activity } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CreateReportModal from '@/components/CreateReportModal';
import AIPreview from '@/components/AIPreview';
import { useReports } from '@/hooks/useReports';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const { createReport } = useReports();
  const location = useLocation();

  // Handle opening create modal from navigation state
  useEffect(() => {
    if (location.state?.openCreateModal) {
      setIsCreateModalOpen(true);
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCreateReport = async (reportData: any) => {
    try {
      await createReport(reportData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  // Enhanced data generation based on time range
  const getRevenueData = () => {
    const dataMap = {
      '7d': [
        { name: 'Mon', revenue: 8500 },
        { name: 'Tue', revenue: 9200 },
        { name: 'Wed', revenue: 7800 },
        { name: 'Thu', revenue: 10100 },
        { name: 'Fri', revenue: 9500 },
        { name: 'Sat', revenue: 11200 },
        { name: 'Sun', revenue: 8900 },
      ],
      '30d': [
        { name: 'Week 1', revenue: 45000 },
        { name: 'Week 2', revenue: 52000 },
        { name: 'Week 3', revenue: 48000 },
        { name: 'Week 4', revenue: 61000 },
      ],
      '90d': [
        { name: 'Month 1', revenue: 180000 },
        { name: 'Month 2', revenue: 220000 },
        { name: 'Month 3', revenue: 195000 },
      ],
      '6m': [
        { name: 'Jan', revenue: 120000 },
        { name: 'Feb', revenue: 140000 },
        { name: 'Mar', revenue: 180000 },
        { name: 'Apr', revenue: 220000 },
        { name: 'May', revenue: 280000 },
        { name: 'Jun', revenue: 350000 },
      ],
      '1y': [
        { name: 'Q1', revenue: 450000 },
        { name: 'Q2', revenue: 620000 },
        { name: 'Q3', revenue: 580000 },
        { name: 'Q4', revenue: 750000 },
      ],
      'all': [
        { name: '2022', revenue: 2100000 },
        { name: '2023', revenue: 2850000 },
        { name: '2024', revenue: 3200000 },
      ]
    };
    return dataMap[timeRange as keyof typeof dataMap] || dataMap['30d'];
  };

  const getTrafficData = () => {
    const baseData = [
      { name: 'Direct', value: 30, color: '#8884d8' },
      { name: 'Social Media', value: 35, color: '#82ca9d' },
      { name: 'Search', value: 25, color: '#ffc658' },
      { name: 'Email', value: 10, color: '#ff8042' },
    ];

    // Vary data slightly based on time range
    if (timeRange === '7d') {
      return baseData.map(item => ({ ...item, value: item.value + Math.floor(Math.random() * 10 - 5) }));
    }
    return baseData;
  };

  const conversionData = [
    { name: 'Week 1', rate: 2.4 },
    { name: 'Week 2', rate: 2.8 },
    { name: 'Week 3', rate: 3.1 },
    { name: 'Week 4', rate: 2.9 },
  ];

  const revenueData = getRevenueData();
  const trafficData = getTrafficData();

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,591</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,429</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+4.3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.4%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.1%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Conversion Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate New Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/integrations'}
            >
              <Activity className="w-4 h-4 mr-2" />
              Connect Data Source
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/reports'}
            >
              <FileText className="w-4 h-4 mr-2" />
              View All Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onCreateReport={() => setIsCreateModalOpen(true)} />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome back! Here's what's happening with your business.</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Report
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('ai-preview')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ai-preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Preview
            </button>
            <button
              onClick={() => setActiveTab('ai-insights')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ai-insights'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Insights
            </button>
            <button
              onClick={() => setActiveTab('collaboration')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'collaboration'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Collaboration
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'ai-preview' && <AIPreview timeRange={timeRange} />}
          {activeTab === 'ai-insights' && (
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced AI insights and recommendations will be displayed here based on your data patterns and business metrics.
                </p>
              </CardContent>
            </Card>
          )}
          {activeTab === 'collaboration' && (
            <Card>
              <CardHeader>
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Team collaboration features and shared reports will be available here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <CreateReportModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateReport}
        />
      </main>
    </div>
  );
};

export default Index;
