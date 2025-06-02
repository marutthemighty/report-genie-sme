
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
import AIInsightsDashboard from '@/components/AIInsightsDashboard';
import CollaborationPanel from '@/components/CollaborationPanel';
import DataImportPanel from '@/components/DataImportPanel';
import { useReports } from '@/hooks/useReports';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
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

  // Enhanced data generation with real dates based on time range
  const getRevenueData = () => {
    const now = new Date();
    
    const dataMap = {
      '7d': Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return {
          name: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          revenue: 8000 + Math.random() * 4000
        };
      }),
      '30d': Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - ((3 - i) * 7));
        return {
          name: `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          revenue: 40000 + Math.random() * 20000
        };
      }),
      '90d': Array.from({ length: 3 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (2 - i));
        return {
          name: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          revenue: 150000 + Math.random() * 70000
        };
      }),
      '6m': Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (5 - i));
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: 100000 + Math.random() * 150000
        };
      }),
      '1y': Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - ((3 - i) * 3));
        return {
          name: `Q${4 - (3 - i)} ${date.getFullYear()}`,
          revenue: 400000 + Math.random() * 350000
        };
      }),
      'all': Array.from({ length: 3 }, (_, i) => {
        const year = now.getFullYear() - (2 - i);
        return {
          name: year.toString(),
          revenue: 2000000 + Math.random() * 1200000
        };
      })
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

  const getConversionData = () => {
    const now = new Date();
    
    if (timeRange === '7d') {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return {
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          rate: 2.0 + Math.random() * 1.5
        };
      });
    } else if (timeRange === '30d') {
      return Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - ((3 - i) * 7));
        return {
          name: `Week ${i + 1}`,
          rate: 2.4 + Math.random() * 0.7
        };
      });
    } else {
      return Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (3 - i));
        return {
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          rate: 2.4 + Math.random() * 0.7
        };
      });
    }
  };

  const revenueData = getRevenueData();
  const trafficData = getTrafficData();
  const conversionData = getConversionData();

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

      {/* Charts and Data Import */}
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

        <DataImportPanel onAnalysisComplete={setAnalysisResults} />
      </div>

      {/* Analysis Results Section - Only show when analysis is complete */}
      {analysisResults ? (
        <div className="space-y-6">
          {/* Analysis Results Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Analysis Results and Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Analysis Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{analysisResults.analysisType} Results</span>
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm">
                      Analysis Complete
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{analysisResults.summary}</p>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {analysisResults.keyMetrics?.map((metric: any, index: number) => (
                      <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                        <div className={`text-xs ${metric.change?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Charts - Fixed layout: 2 on top, 1 below */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResults.charts?.revenue && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Revenue Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysisResults.charts.revenue.slice(0, 5).map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded">
                                  <div 
                                    className="h-full bg-blue-500 rounded"
                                    style={{ 
                                      width: `${(item.value / Math.max(...analysisResults.charts.revenue.map((d: any) => d.value))) * 100}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-right w-12">
                                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {analysisResults.charts?.customers && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Customer Segments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysisResults.charts.customers.slice(0, 5).map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded">
                                  <div 
                                    className="h-full bg-green-500 rounded"
                                    style={{ 
                                      width: `${(item.value / Math.max(...analysisResults.charts.customers.map((d: any) => d.value))) * 100}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-right w-12">
                                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Third chart below the first two */}
                {analysisResults.charts?.products && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Product Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysisResults.charts.products.slice(0, 5).map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded">
                                <div 
                                  className="h-full bg-orange-500 rounded"
                                  style={{ 
                                    width: `${(item.value / Math.max(...analysisResults.charts.products.map((d: any) => d.value))) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-right w-12">
                                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Column - Recommendations and Export */}
            <div className="space-y-6">
              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResults.recommendations?.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1 text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Export Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        const content = `Analysis Report: ${analysisResults.analysisType}\n\nSummary:\n${analysisResults.summary}\n\nKey Metrics:\n${analysisResults.keyMetrics?.map((m: any) => `${m.label}: ${m.value} (${m.change})`).join('\n')}\n\nRecommendations:\n${analysisResults.recommendations?.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${analysisResults.analysisType.replace(' ', '_')}_analysis.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Export PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        let csvContent = `Analysis Type,${analysisResults.analysisType}\n\nKey Metrics\nMetric,Value,Change\n`;
                        analysisResults.keyMetrics?.forEach((metric: any) => {
                          csvContent += `"${metric.label}","${metric.value}","${metric.change}"\n`;
                        });
                        csvContent += "\nRecommendations\n";
                        analysisResults.recommendations?.forEach((rec: string, idx: number) => {
                          csvContent += `"${idx + 1}","${rec}"\n`;
                        });
                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${analysisResults.analysisType.replace(' ', '_')}_analysis.csv`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Export Excel
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        const jsonData = {
                          analysisType: analysisResults.analysisType,
                          timestamp: new Date().toISOString(),
                          ...analysisResults
                        };
                        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${analysisResults.analysisType.replace(' ', '_')}_analysis.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Export JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* Original Bottom Section - Only show when no analysis results */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>
      )}
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
          {activeTab === 'ai-insights' && <AIInsightsDashboard />}
          {activeTab === 'collaboration' && <CollaborationPanel />}
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
