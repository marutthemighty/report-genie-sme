import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Database, 
  TrendingUp, 
  Users, 
  BarChart3,
  Sparkles,
  Download
} from 'lucide-react';
import { useDataAnalysis } from '@/hooks/useDataAnalysis';

const DataImportPanel = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { loading, analyzeUserData, generateSampleData } = useDataAnalysis();
  const { toast } = useToast();

  const analysisTypes = [
    { value: 'Sales Analysis', icon: TrendingUp, description: 'Revenue, orders, and sales performance' },
    { value: 'Customer Insights', icon: Users, description: 'Customer behavior and segmentation' },
    { value: 'Performance Trends', icon: BarChart3, description: 'Growth patterns and KPI tracking' },
    { value: 'Custom Analysis', icon: Database, description: 'Tailored analysis for your data' }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Parse file data (simplified simulation)
      const fileData = await parseFileData(file);
      
      // Wait for upload to complete
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (selectedAnalysis) {
        const results = await analyzeUserData(fileData, selectedAnalysis);
        setAnalysisResults(results);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGenerateSampleData = async () => {
    if (!selectedAnalysis) return;
    
    try {
      const results = await generateSampleData(selectedAnalysis);
      setAnalysisResults(results);
    } catch (error) {
      console.error('Sample generation error:', error);
    }
  };

  const parseFileData = async (file: File) => {
    // Simulate file parsing - in real app, this would parse CSV/Excel/JSON
    return {
      fileName: file.name,
      fileSize: file.size,
      records: Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        revenue: Math.floor(Math.random() * 10000) + 1000,
        orders: Math.floor(Math.random() * 100) + 10,
        customers: Math.floor(Math.random() * 50) + 5
      })),
      totalRevenue: Math.floor(Math.random() * 500000) + 100000,
      totalOrders: Math.floor(Math.random() * 2000) + 500,
      avgOrderValue: Math.floor(Math.random() * 300) + 100,
      conversionRate: Math.random() * 0.1 + 0.02
    };
  };

  const exportToPDF = async () => {
    if (!analysisResults) return;
    
    try {
      const content = `
Analysis Report: ${selectedAnalysis}

Summary:
${analysisResults.summary}

Key Metrics:
${analysisResults.keyMetrics.map((metric: any) => `${metric.label}: ${metric.value} (${metric.change})`).join('\n')}

Recommendations:
${analysisResults.recommendations.map((rec: string, idx: number) => `${idx + 1}. ${rec}`).join('\n')}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedAnalysis.replace(' ', '_')}_analysis.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Analysis report has been downloaded as a text file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export the analysis report.",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = async () => {
    if (!analysisResults) return;
    
    try {
      // Create CSV content
      let csvContent = "Analysis Report\n\n";
      csvContent += `Analysis Type,${selectedAnalysis}\n\n`;
      csvContent += "Key Metrics\n";
      csvContent += "Metric,Value,Change\n";
      analysisResults.keyMetrics.forEach((metric: any) => {
        csvContent += `"${metric.label}","${metric.value}","${metric.change}"\n`;
      });
      csvContent += "\nRecommendations\n";
      analysisResults.recommendations.forEach((rec: string, idx: number) => {
        csvContent += `"${idx + 1}","${rec}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedAnalysis.replace(' ', '_')}_analysis.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Analysis report has been downloaded as a CSV file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export the analysis report.",
        variant: "destructive"
      });
    }
  };

  const exportToJSON = async () => {
    if (!analysisResults) return;
    
    try {
      const jsonData = {
        analysisType: selectedAnalysis,
        timestamp: new Date().toISOString(),
        ...analysisResults
      };
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedAnalysis.replace(' ', '_')}_analysis.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Analysis report has been downloaded as a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export the analysis report.",
        variant: "destructive"
      });
    }
  };

  const ChartComponent = ({ data, title, type }: { data: any[], title: string, type: string }) => {
    if (!data || data.length === 0) return null;

    return (
      <Card className="h-64">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded">
                    <div 
                      className="h-full bg-blue-500 rounded"
                      style={{ width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Analysis Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Analysis Type</label>
              <Select value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose analysis type" />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{type.value}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Upload Your Data</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-3">Upload CSV, Excel, or JSON files</p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={!selectedAnalysis || isUploading || loading}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors w-full max-w-[140px] ${
                      selectedAnalysis && !isUploading && !loading
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Choose File</span>
                  </label>
                </div>
                {isUploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-600">Uploading and processing...</p>
                  </div>
                )}
              </div>

              {/* Sample Data Generation */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Try Sample Data</label>
                <div className="border border-gray-300 rounded-lg p-4 text-center">
                  <Sparkles className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-sm text-gray-600 mb-3">Generate realistic sample data for testing</p>
                  <Button
                    onClick={handleGenerateSampleData}
                    disabled={!selectedAnalysis || loading}
                    className="bg-green-600 hover:bg-green-700 w-full max-w-[180px] text-sm px-3 py-2"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Generate Sample Data</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedAnalysis} Results</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Analysis Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{analysisResults.summary}</p>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {analysisResults.keyMetrics.map((metric: any, index: number) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                    <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChartComponent 
              data={analysisResults.charts.revenue} 
              title="Revenue Trends" 
              type="line" 
            />
            <ChartComponent 
              data={analysisResults.charts.customers} 
              title="Customer Segments" 
              type="pie" 
            />
            <ChartComponent 
              data={analysisResults.charts.products} 
              title="Product Performance" 
              type="bar" 
            />
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResults.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" size="sm" onClick={exportToPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={exportToExcel}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
                <Button variant="outline" size="sm" onClick={exportToJSON}>
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataImportPanel;
