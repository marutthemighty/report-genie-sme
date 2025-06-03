
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast';
import { useReports } from '@/hooks/useReports';
import CollaborationPanel from '@/components/CollaborationPanel';
import Sidebar from '@/components/Sidebar';
import CreateReportModal from '@/components/CreateReportModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  FileText,
  TrendingUp,
  SlidersHorizontal,
  BrainCircuit,
  Users,
  Download,
  Plus,
  Edit,
  Trash2,
  Database,
  Calendar,
  TrendingDown
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const { reports, loading, createReport } = useReports();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editReport, setEditReport] = useState(null);
  const [reportName, setReportName] = useState('');

  useEffect(() => {
    // Check if the location state contains the 'openCreateModal' flag
    if (location.state?.openCreateModal) {
      setIsCreateModalOpen(true);
      // Clear the flag from the location state to prevent re-triggering
      navigate('.', { replace: true, state: { ...location.state, openCreateModal: false } });
    }

    if (location.state?.editReport) {
      setEditReport(location.state.editReport);
      setReportName(location.state.reportName);
      setActiveTab(location.state.activeTab || 'ai-preview');
      navigate('.', { replace: true, state: { ...location.state, editReport: null, reportName: null, activeTab: null } });
    }
  }, [location, navigate]);

  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 2000 },
    { month: 'Apr', revenue: 2780 },
    { month: 'May', revenue: 1890 },
    { month: 'Jun', revenue: 2390 },
    { month: 'Jul', revenue: 3490 },
    { month: 'Aug', revenue: 3000 },
    { month: 'Sep', revenue: 2000 },
    { month: 'Oct', revenue: 2780 },
    { month: 'Nov', revenue: 1890 },
    { month: 'Dec', revenue: 2390 },
  ];

  const customerSegments = [
    { name: 'New Visitors', value: 400 },
    { name: 'Returning Customers', value: 300 },
    { name: 'Loyal Members', value: 300 },
    { name: 'Inactive Users', value: 200 },
  ];

  const productPerformance = [
    { product: 'Product A', sales: 4000 },
    { product: 'Product B', sales: 3000 },
    { product: 'Product C', sales: 2000 },
    { product: 'Product D', sales: 2780 },
    { product: 'Product E', sales: 1890 },
    { product: 'Product F', sales: 2390 },
  ];

  const trafficSources = [
    { name: 'Direct', value: 400 },
    { name: 'Referral', value: 300 },
    { name: 'Organic Search', value: 300 },
    { name: 'Paid Ads', value: 200 },
  ];

  const conversionData = [
    { month: 'Jan', rate: 2.4 },
    { month: 'Feb', rate: 3.1 },
    { month: 'Mar', rate: 2.8 },
    { month: 'Apr', rate: 3.5 },
    { month: 'May', rate: 4.1 },
    { month: 'Jun', rate: 3.8 },
  ];

  const aiRecommendations = [
    "Optimize website loading speed to improve user experience and SEO rankings.",
    "Personalize email marketing campaigns based on customer behavior to increase conversion rates.",
    "Implement a customer loyalty program to reward repeat purchases and build brand loyalty.",
    "Use social media analytics to identify trending topics and engage with customers in real-time.",
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
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Overview of key metrics and insights</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="data-import">Data Import</TabsTrigger>
              <TabsTrigger value="ai-preview">AI Preview</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Revenue Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Sales Analysis Results */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Revenue Trends and Customer Segments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Revenue Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData.slice(0, 6)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="revenue" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Customer Segments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={customerSegments}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {customerSegments.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Product Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={productPerformance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="product" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Traffic Sources and Conversion Rate */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Traffic Sources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={trafficSources}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {trafficSources.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Conversion Rate Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={conversionData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="rate" stroke="#ff7300" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* AI Recommendations and Export Results */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5" />
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {aiRecommendations.map((recommendation, index) => (
                        <div key={index} className="text-sm">
                          {index + 1}. {recommendation}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Export Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export as PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data-import" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Data Import Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dataSource">Data Source</Label>
                    <Input id="dataSource" placeholder="Enter data source URL" />
                  </div>
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input id="apiKey" type="password" placeholder="Enter API Key" />
                  </div>
                  <Button>Import Data</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5" />
                    AI Report Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="aiSummary">AI Summary</Label>
                    <Textarea
                      id="aiSummary"
                      placeholder="AI-generated summary will appear here..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aiPredictions">AI Predictions</Label>
                    <Textarea
                      id="aiPredictions"
                      placeholder="AI predictions and recommendations will appear here..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="collaboration" className="space-y-6">
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
    </div>
  );
};

export default Index;
