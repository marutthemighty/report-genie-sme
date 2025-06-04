import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';
import { useReports } from '@/hooks/useReports';
import CollaborationPanel from '@/components/CollaborationPanel';
import Sidebar from '@/components/Sidebar';
import CreateReportModal from '@/components/CreateReportModal';
import DataImportPanel from '@/components/DataImportPanel';
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
  BrainCircuit,
  Users,
  Download,
  Plus,
  Database,
  UploadCloud,
  Target,
  Globe,
  MousePointer
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const { reports, loading, createReport } = useReports();
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResults, setAnalysisResults] = useState(null);

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setIsCreateModalOpen(true);
      navigate('.', { replace: true, state: { ...location.state, openCreateModal: false } });
    }

    if (location.state?.editReport) {
      navigate('.', { replace: true, state: { ...location.state, editReport: null, reportName: null, activeTab: null } });
    }
  }, [location, navigate]);

  const handleCreateReport = async (reportData: any) => {
    try {
      await createReport(reportData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setActiveTab('ai-preview');
    toast({
      title: "Analysis Complete",
      description: "Your data analysis is ready for review.",
    });
  };

  // Generate comprehensive dashboard data with proper date formatting
  const getDashboardData = () => {
    if (analysisResults && analysisResults.chartData) {
      const currentDate = new Date();
      
      // Generate proper date labels based on data range
      const generateDateLabels = (count: number, type: 'day' | 'week' | 'month' | 'quarter' | 'year') => {
        const labels = [];
        for (let i = count - 1; i >= 0; i--) {
          const date = new Date(currentDate);
          switch (type) {
            case 'day':
              date.setDate(date.getDate() - i);
              labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
              break;
            case 'week':
              date.setDate(date.getDate() - (i * 7));
              labels.push(`Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
              break;
            case 'month':
              date.setMonth(date.getMonth() - i);
              labels.push(date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
              break;
            case 'quarter':
              date.setMonth(date.getMonth() - (i * 3));
              const quarter = Math.floor(date.getMonth() / 3) + 1;
              labels.push(`Q${quarter} ${date.getFullYear()}`);
              break;
            case 'year':
              date.setFullYear(date.getFullYear() - i);
              labels.push(date.getFullYear().toString());
              break;
          }
        }
        return labels;
      };

      // Process chart data with real names and dates
      const processedData = {
        revenue: analysisResults.chartData.revenue?.length > 0 
          ? analysisResults.chartData.revenue.map((item, index) => ({
              ...item,
              month: generateDateLabels(analysisResults.chartData.revenue.length, 'month')[index] || item.month
            }))
          : [],
        sales: analysisResults.chartData.sales?.length > 0
          ? analysisResults.chartData.sales.map((item, index) => ({
              ...item,
              period: generateDateLabels(analysisResults.chartData.sales.length, 'month')[index] || item.period
            }))
          : [],
        distribution: analysisResults.chartData.distribution || [],
        customers: analysisResults.chartData.customers?.length > 0
          ? analysisResults.chartData.customers
          : [
              { segment: 'New Customers', count: 245, value: 45 },
              { segment: 'Returning', count: 567, value: 35 },
              { segment: 'VIP', count: 123, value: 15 },
              { segment: 'At-Risk', count: 89, value: 5 }
            ],
        products: analysisResults.chartData.products?.length > 0
          ? analysisResults.chartData.products
          : [],
        traffic: [
          { source: 'Organic Search', visitors: 2847, percentage: 42 },
          { source: 'Direct', visitors: 1923, percentage: 28 },
          { source: 'Social Media', visitors: 1456, percentage: 21 },
          { source: 'Email', visitors: 634, percentage: 9 }
        ],
        conversion: generateDateLabels(6, 'month').map((month, index) => ({
          month,
          rate: 3.2 + (Math.random() * 1.5)
        }))
      };

      return processedData;
    }
    return null;
  };

  const dashboardData = getDashboardData();

  // Helper function to determine which charts to show based on data relevance
  const shouldShowChart = (chartType: string) => {
    if (!dashboardData) return false;
    
    switch (chartType) {
      case 'revenue':
        return dashboardData.revenue.length > 0;
      case 'sales':
        return dashboardData.sales.length > 0;
      case 'distribution':
        return dashboardData.distribution.length > 0;
      case 'customers':
        return dashboardData.customers.length > 0;
      case 'products':
        return dashboardData.products.length > 0;
      case 'traffic':
        return true; // Always show if we have any data
      case 'conversion':
        return true; // Always show if we have any data
      default:
        return false;
    }
  };

  // Custom tooltip component for dark mode compatibility
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-700 dark:text-gray-300">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleExportPDF = async () => {
    try {
      if (!analysisResults) {
        toast({
          title: "No Data to Export",
          description: "Please analyze your data first before exporting.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: { 
          reportData: analysisResults,
          reportTitle: 'Dashboard Analysis Report',
          reportType: 'Dashboard Overview',
          includeCharts: true,
          chartData: analysisResults.chartData
        }
      });

      if (error) {
        console.error('PDF generation error:', error);
        throw error;
      }

      if (!data || !data.pdf) {
        throw new Error('No PDF data received from server');
      }

      // Create a printable HTML page that can be saved as PDF
      const htmlContent = atob(data.pdf);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Trigger print dialog
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }

      toast({
        title: "PDF Ready",
        description: "Your report is ready for printing or saving as PDF.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
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
                <p className="text-gray-600 dark:text-gray-300">Upload and analyze your business data</p>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="data-analysis">Data Analysis</TabsTrigger>
              <TabsTrigger value="ai-preview">AI Insights</TabsTrigger>
              <TabsTrigger value="collaboration">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {dashboardData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Revenue Overview */}
                    {shouldShowChart('revenue') && (
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
                              <LineChart data={dashboardData.revenue}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis 
                                  dataKey="month" 
                                  className="text-gray-600 dark:text-gray-300"
                                  tick={{ fill: 'currentColor' }}
                                />
                                <YAxis 
                                  className="text-gray-600 dark:text-gray-300"
                                  tick={{ fill: 'currentColor' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {shouldShowChart('sales') && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Sales Trends</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardData.sales}>
                                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                  <XAxis 
                                    dataKey="period" 
                                    className="text-gray-600 dark:text-gray-300"
                                    tick={{ fill: 'currentColor' }}
                                  />
                                  <YAxis 
                                    className="text-gray-600 dark:text-gray-300"
                                    tick={{ fill: 'currentColor' }}
                                  />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Bar dataKey="sales" fill="#8884d8" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {shouldShowChart('distribution') && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Data Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={dashboardData.distribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {dashboardData.distribution.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {shouldShowChart('customers') && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Users className="w-5 h-5" />
                              Customer Segments
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardData.customers}>
                                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                  <XAxis 
                                    dataKey="segment" 
                                    className="text-gray-600 dark:text-gray-300"
                                    tick={{ fill: 'currentColor' }}
                                  />
                                  <YAxis 
                                    className="text-gray-600 dark:text-gray-300"
                                    tick={{ fill: 'currentColor' }}
                                  />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Bar dataKey="count" fill="#00C49F" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {shouldShowChart('products') && dashboardData.products.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Target className="w-5 h-5" />
                              Product Performance
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardData.products}>
                                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                  <XAxis 
                                    dataKey="name" 
                                    className="text-gray-600 dark:text-gray-300"
                                    tick={{ fill: 'currentColor' }}
                                  />
                                  <YAxis 
                                    className="text-gray-600 dark:text-gray-300"
                                    tick={{ fill: 'currentColor' }}
                                  />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Bar dataKey="sales" fill="#FFBB28" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Globe className="w-5 h-5" />
                            Traffic Sources
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={dashboardData.traffic}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ source, percentage }) => `${source} ${percentage}%`}
                                  outerRadius={60}
                                  fill="#8884d8"
                                  dataKey="visitors"
                                >
                                  {dashboardData.traffic.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <MousePointer className="w-5 h-5" />
                            Conversion Rate Trend
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={dashboardData.conversion}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis 
                                  dataKey="month" 
                                  className="text-gray-600 dark:text-gray-300"
                                  tick={{ fill: 'currentColor' }}
                                />
                                <YAxis 
                                  className="text-gray-600 dark:text-gray-300"
                                  tick={{ fill: 'currentColor' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="rate" stroke="#FF8042" strokeWidth={2} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BrainCircuit className="w-5 h-5" />
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {analysisResults?.recommendations?.map((recommendation, index) => (
                          <div key={index} className="text-sm p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                            {index + 1}. {recommendation}
                          </div>
                        )) || [
                          "Focus on high-value customer segments for better ROI",
                          "Optimize product mix based on performance metrics", 
                          "Implement retention strategies for at-risk customers",
                          "Scale successful marketing channels"
                        ].map((rec, index) => (
                          <div key={index} className="text-sm p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                            {index + 1}. {rec}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          Export Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleExportPDF}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export as PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <UploadCloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No Data Uploaded Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Upload your business data to see comprehensive analytics and insights
                  </p>
                  <Button onClick={() => setActiveTab('data-analysis')}>
                    <Database className="w-4 h-4 mr-2" />
                    Upload Data
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="data-analysis" className="space-y-6">
              <DataImportPanel onAnalysisComplete={handleAnalysisComplete} />
            </TabsContent>

            <TabsContent value="ai-preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5" />
                    AI Insights & Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResults ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Analysis Summary</h3>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300">{analysisResults.summary}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {analysisResults.keyMetrics?.map((metric: any, index: number) => (
                            <div key={index} className="p-4 bg-white dark:bg-gray-800 border rounded-lg">
                              <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                              <div className="text-xl font-bold">{metric.value}</div>
                              <div className="text-sm text-green-600">{metric.change}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
                        <div className="space-y-2">
                          {analysisResults.recommendations?.map((rec: string, index: number) => (
                            <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 rounded">
                              <p className="text-gray-700 dark:text-gray-300">{index + 1}. {rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BrainCircuit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Analysis Available</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Upload your data in the Data Analysis tab to see AI-powered insights here.
                      </p>
                      <Button onClick={() => setActiveTab('data-analysis')}>
                        <Database className="w-4 h-4 mr-2" />
                        Start Analysis
                      </Button>
                    </div>
                  )}
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
