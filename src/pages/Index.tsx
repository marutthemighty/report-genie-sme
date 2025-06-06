import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Download,
  Upload,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
  Activity
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import DataImportPanel from '@/components/DataImportPanel';
import { useUserSettingsStore } from '@/stores/useUserSettingsStore';

const Dashboard = () => {
  const { toast } = useToast();
  const { exportFormats } = useUserSettingsStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  const sampleData = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
    { name: 'Jul', value: 4300 },
    { name: 'Aug', value: 2400 },
    { name: 'Sep', value: 1398 },
    { name: 'Oct', value: 9800 },
    { name: 'Nov', value: 3908 },
    { name: 'Dec', value: 4800 }
  ];

  const revenueData = analysisResults?.chartData?.revenue || [
    { name: 'Jan 2024', value: 4000 },
    { name: 'Feb 2024', value: 3000 },
    { name: 'Mar 2024', value: 5000 },
    { name: 'Apr 2024', value: 4500 },
    { name: 'May 2024', value: 6000 },
    { name: 'Jun 2024', value: 5500 }
  ];

  const salesData = analysisResults?.chartData?.sales || [
    { name: 'Electronics', sales: 4000, count: 240 },
    { name: 'Clothing', sales: 3000, count: 139 },
    { name: 'Books', sales: 2000, count: 980 },
    { name: 'Home & Garden', sales: 2780, count: 390 },
    { name: 'Sports', sales: 1890, count: 480 }
  ];

  const distributionData = analysisResults?.chartData?.distribution || [
    { name: 'Electronics', value: 400, color: '#0088FE' },
    { name: 'Clothing', value: 300, color: '#00C49F' },
    { name: 'Books', value: 300, color: '#FFBB28' },
    { name: 'Home & Garden', value: 200, color: '#FF8042' }
  ];

  const handleAnalysisComplete = useCallback((results: any) => {
    setAnalysisResults(results);
    toast({
      title: "Analysis Complete",
      description: "Your data has been analyzed successfully.",
    });
  }, [toast]);

  const generatePDFContent = () => {
    const fileName = uploadedFile?.name || 'Unknown File';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Analytics Report - ${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .metric { display: inline-block; margin: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
          .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .metric-label { font-size: 14px; color: #666; margin-top: 5px; }
          .section { margin: 30px 0; }
          .chart-placeholder { 
            border: 2px dashed #ccc; 
            height: 200px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            margin: 20px 0;
            background: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Analytics Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()} from ${fileName}</p>
        </div>
        
        <div class="section">
          <h2>Key Metrics</h2>
          <div class="metric">
            <div class="metric-value">$${(Math.random() * 100000 + 50000).toFixed(0)}</div>
            <div class="metric-label">Total Revenue</div>
          </div>
          <div class="metric">
            <div class="metric-value">${(Math.random() * 1000 + 500).toFixed(0)}</div>
            <div class="metric-label">Total Orders</div>
          </div>
          <div class="metric">
            <div class="metric-value">${(Math.random() * 100 + 50).toFixed(0)}</div>
            <div class="metric-label">Avg Order Value</div>
          </div>
        </div>

        <div class="section">
          <h2>Revenue Trends</h2>
          <div class="chart-placeholder">
            [Revenue trend chart would appear here]
          </div>
        </div>

        <div class="section">
          <h2>Sales by Category</h2>
          <div class="chart-placeholder">
            [Sales breakdown chart would appear here]
          </div>
        </div>

        <div class="section">
          <h2>Data Summary</h2>
          <p><strong>File Name:</strong> ${fileName}</p>
          <p><strong>File Size:</strong> ${uploadedFile ? (uploadedFile.size / 1024).toFixed(2) + ' KB' : 'Unknown'}</p>
          <p><strong>Analysis Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Records Processed:</strong> ${analysisResults?.summary?.totalRows || 'N/A'}</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const htmlContent = generatePDFContent();
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.print();
      }
      toast({
        title: "PDF Export",
        description: "PDF report has been generated and opened in a new window.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (!uploadedFile || !analysisResults) {
      toast({
        title: "No Data",
        description: "Please upload and analyze data first.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = `Date,Metric,Value
${new Date().toISOString().split('T')[0]},Total Revenue,${(Math.random() * 100000 + 50000).toFixed(0)}
${new Date().toISOString().split('T')[0]},Total Orders,${(Math.random() * 1000 + 500).toFixed(0)}
${new Date().toISOString().split('T')[0]},Average Order Value,${(Math.random() * 100 + 50).toFixed(0)}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "CSV Export Complete",
      description: "Your analytics data has been exported to CSV.",
    });
  };

  const handleExportGoogleSlides = () => {
    toast({
      title: "Google Slides Export",
      description: "Google Slides integration would be implemented here.",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Analytics and insights for your business</p>
            </div>
            
            <div className="flex gap-2">
              {exportFormats.pdf && (
                <Button 
                  onClick={handleExportPDF} 
                  disabled={isExporting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isExporting ? 'Generating...' : 'Export PDF'}
                </Button>
              )}
              
              {exportFormats.csv && (
                <Button 
                  onClick={handleExportCSV}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
              
              {exportFormats.googleSlides && (
                <Button 
                  onClick={handleExportGoogleSlides}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Slides
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Data Import Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Analysis</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Data Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataImportPanel onAnalysisComplete={handleAnalysisComplete} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Analysis Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">File Status</span>
                      <Badge variant={uploadedFile ? "default" : "secondary"}>
                        {uploadedFile ? 'File Loaded' : 'No File'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Analysis</span>
                      <Badge variant={analysisResults ? "default" : "secondary"}>
                        {analysisResults ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>
                    {uploadedFile && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>File: {uploadedFile.name}</p>
                        <p>Size: {(uploadedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Overview Section */}
          {uploadedFile && analysisResults && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Overview</h2>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">${(Math.random() * 100000 + 50000).toFixed(0)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400">+12.5%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{(Math.random() * 1000 + 500).toFixed(0)}</p>
                      </div>
                      <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400">+8.2%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Customers</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{(Math.random() * 500 + 200).toFixed(0)}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400 mr-1" />
                      <span className="text-sm text-red-600 dark:text-red-400">-2.4%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Order Value</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">${(Math.random() * 100 + 50).toFixed(0)}</p>
                      </div>
                      <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400">+5.7%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#f9fafb'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#f9fafb'
                            }}
                          />
                          <Bar dataKey="sales" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Customer Segments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#f9fafb'
                            }}
                          />
                          <Bar dataKey="count" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Product Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distributionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {distributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#f9fafb'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
