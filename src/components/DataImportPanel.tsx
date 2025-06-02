
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Database, 
  TrendingUp, 
  Users, 
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useDataAnalysis } from '@/hooks/useDataAnalysis';

interface DataImportPanelProps {
  onAnalysisComplete?: (results: any) => void;
}

const DataImportPanel = ({ onAnalysisComplete }: DataImportPanelProps) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
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
        const enhancedResults = {
          ...results,
          analysisType: selectedAnalysis
        };
        onAnalysisComplete?.(enhancedResults);
        
        toast({
          title: "Analysis Complete",
          description: `${selectedAnalysis} has been generated successfully.`,
        });
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload and analyze file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGenerateSampleData = async () => {
    if (!selectedAnalysis) return;
    
    try {
      const results = await generateSampleData(selectedAnalysis);
      const enhancedResults = {
        ...results,
        analysisType: selectedAnalysis
      };
      onAnalysisComplete?.(enhancedResults);
      
      toast({
        title: "Sample Data Generated",
        description: `${selectedAnalysis} sample analysis has been completed.`,
      });
    } catch (error) {
      console.error('Sample generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate sample data. Please try again.",
        variant: "destructive"
      });
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

  return (
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
                  className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors w-full ${
                    selectedAnalysis && !isUploading && !loading
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
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
                  className="bg-green-600 hover:bg-green-700 w-full"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Sample Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImportPanel;
