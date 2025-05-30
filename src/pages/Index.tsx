import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CreateReportModal from '@/components/CreateReportModal';
import AIPreview from '@/components/AIPreview';
import AIInsightsDashboard from '@/components/AIInsightsDashboard';
import CollaborationPanel from '@/components/CollaborationPanel';
import ConsentModal from '@/components/ConsentModal';
import { useReports } from '@/hooks/useReports';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('6m');
  
  const { reports, createReport } = useReports();

  // Sample data that changes based on time range
  const getRevenueData = (range: string) => {
    const now = new Date();
    let dataPoints: any[] = [];
    
    switch (range) {
      case '7d':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { weekday: 'short' }),
            revenue: Math.round(42000 + Math.random() * 20000),
            orders: Math.round(145 + Math.random() * 50)
          });
        }
        break;
      case '30d':
        for (let i = 29; i >= 0; i -= 3) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
            revenue: Math.round(42000 + Math.random() * 20000),
            orders: Math.round(145 + Math.random() * 50)
          });
        }
        break;
      case '90d':
        for (let i = 2; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { month: 'short' }),
            revenue: Math.round(42000 + Math.random() * 20000),
            orders: Math.round(145 + Math.random() * 50)
          });
        }
        break;
      case '1y':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { month: 'short' }),
            revenue: Math.round(42000 + Math.random() * 20000),
            orders: Math.round(145 + Math.random() * 50)
          });
        }
        break;
      case 'all':
        for (let i = 23; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { month: 'short', year: '2-digit' }),
            revenue: Math.round(42000 + Math.random() * 20000),
            orders: Math.round(145 + Math.random() * 50)
          });
        }
        break;
      default: // 6m
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        dataPoints = months.map(month => ({
          month,
          revenue: Math.round(42000 + Math.random() * 20000),
          orders: Math.round(145 + Math.random() * 50)
        }));
    }
    
    return dataPoints;
  };

  const getTrafficData = (range: string) => {
    // Create different data patterns based on time range
    const basePatterns = {
      '7d': { multiplier: 1, variance: 0.3 },
      '30d': { multiplier: 7, variance: 0.2 },
      '90d': { multiplier: 21, variance: 0.15 },
      '6m': { multiplier: 90, variance: 0.1 },
      '1y': { multiplier: 365, variance: 0.08 },
      'all': { multiplier: 730, variance: 0.05 }
    };

    const pattern = basePatterns[range as keyof typeof basePatterns] || basePatterns['6m'];
    
    return [
      { 
        source: 'Organic Search', 
        visitors: Math.round(1200 * pattern.multiplier * (1 + (Math.random() - 0.5) * pattern.variance)), 
        percentage: 40 + Math.round((Math.random() - 0.5) * 10) 
      },
      { 
        source: 'Direct', 
        visitors: Math.round(900 * pattern.multiplier * (1 + (Math.random() - 0.5) * pattern.variance)), 
        percentage: 30 + Math.round((Math.random() - 0.5) * 8) 
      },
      { 
        source: 'Social Media', 
        visitors: Math.round(600 * pattern.multiplier * (1 + (Math.random() - 0.5) * pattern.variance)), 
        percentage: 20 + Math.round((Math.random() - 0.5) * 6) 
      },
      { 
        source: 'Referrals', 
        visitors: Math.round(300 * pattern.multiplier * (1 + (Math.random() - 0.5) * pattern.variance)), 
        percentage: 10 + Math.round((Math.random() - 0.5) * 4) 
      },
    ];
  };

  const revenueData = getRevenueData(timeRange);
  const trafficData = getTrafficData(timeRange);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last 1 year' },
    { value: 'all', label: 'All time' }
  ];

  const handleCreateReport = async (reportData: any) => {
    try {
      await createReport(reportData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onCreateReport={() => setIsCreateModalOpen(true)} />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome back! Here's what's happening with your data.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Report
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai-preview">AI Preview</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="inline w-3 h-3 mr-1" />
                      +12.5% from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {revenueData.reduce((sum, item) => sum + item.orders, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="inline w-3 h-3 mr-1" />
                      +8.3% from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Website Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {trafficData.reduce((sum, item) => sum + item.visitors, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingDown className="inline w-3 h-3 mr-1" />
                      -2.1% from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="inline w-3 h-3 mr-1" />
                      +0.4% from last period
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend ({timeRangeOptions.find(opt => opt.value === timeRange)?.label})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']} />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources ({timeRangeOptions.find(opt => opt.value === timeRange)?.label})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={trafficData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ source, percentage }) => `${source} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="visitors"
                        >
                          {trafficData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value?.toLocaleString(), 'Visitors']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.slice(0, 4).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="default">
                            {report.status}
                          </Badge>
                          <div>
                            <p className="font-medium">Report generated: {report.name}</p>
                            <p className="text-sm text-gray-500">{report.report_type}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {reports.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No reports created yet. Create your first report to see activity here.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-preview">
              <AIPreview timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="ai-insights">
              <AIInsightsDashboard />
            </TabsContent>

            <TabsContent value="collaboration">
              <CollaborationPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <CreateReportModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReport}
      />
      <ConsentModal 
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
      />
    </div>
  );
};

export default Index;
