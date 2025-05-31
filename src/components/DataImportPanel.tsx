
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Database, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DataImportPanel = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisComplete(false);
      setAnalysisResults(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Data Imported Successfully",
        description: `${selectedFile.name} has been processed and is ready for analysis.`,
      });
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const generateAnalysisResults = (analysisType: string, fileName: string) => {
    const baseInsights = {
      'Sales Analysis': [
        `Revenue increased by ${Math.floor(Math.random() * 20) + 10}% compared to previous period`,
        `Top performing product category: ${['Electronics', 'Clothing', 'Home & Garden', 'Sports'][Math.floor(Math.random() * 4)]}`,
        `Average order value: $${(Math.random() * 50 + 30).toFixed(2)}`,
        `Peak sales day: ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][Math.floor(Math.random() * 7)]}`
      ],
      'Customer Insights': [
        `Customer retention rate: ${Math.floor(Math.random() * 15) + 75}%`,
        `New customer acquisition increased by ${Math.floor(Math.random() * 10) + 5}%`,
        `Most active customer segment: ${['Premium', 'Standard', 'Basic'][Math.floor(Math.random() * 3)]} users`,
        `Average customer lifetime value: $${(Math.random() * 500 + 200).toFixed(2)}`
      ],
      'Performance Trends': [
        `Website conversion rate: ${(Math.random() * 2 + 2).toFixed(2)}%`,
        `Mobile traffic accounts for ${Math.floor(Math.random() * 20) + 60}% of total visits`,
        `Page load time improved by ${(Math.random() * 0.5 + 0.1).toFixed(1)}s`,
        `Bounce rate decreased by ${Math.floor(Math.random() * 5) + 3}%`
      ],
      'Custom Analysis': [
        `Data quality score: ${Math.floor(Math.random() * 10) + 85}%`,
        `Key performance indicators trending ${['upward', 'stable', 'improving'][Math.floor(Math.random() * 3)]}`,
        `Anomalies detected: ${Math.floor(Math.random() * 3)} data points require attention`,
        `Forecast accuracy: ${Math.floor(Math.random() * 10) + 85}%`
      ]
    };

    return {
      type: analysisType,
      summary: `${analysisType} completed for ${fileName}`,
      insights: baseInsights[analysisType as keyof typeof baseInsights] || baseInsights['Custom Analysis'],
      metrics: {
        totalRecords: Math.floor(Math.random() * 10000) + 1000,
        dataQuality: Math.floor(Math.random() * 20) + 80,
        processingTime: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}s`
      }
    };
  };

  const handleAnalysis = async (analysisType: string) => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      // Simulate analysis processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate dynamic analysis results
      const mockResults = generateAnalysisResults(analysisType, selectedFile.name);

      setAnalysisResults(mockResults);
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis Complete",
        description: `${analysisType} has been completed successfully.`,
      });
      
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const supportedFormats = ['CSV', 'Excel', 'JSON', 'XML'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Import & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Your Dataset</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls,.json,.xml"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500">
            Supported formats: {supportedFormats.join(', ')}
          </p>
        </div>

        {selectedFile && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Size: {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {!isUploading && selectedFile && !analysisComplete && (
          <Button 
            onClick={handleUpload}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Process Dataset
          </Button>
        )}

        {isUploading && (
          <Button disabled className="w-full">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Processing...
          </Button>
        )}

        {!isUploading && selectedFile && !analysisComplete && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Quick Analysis Options
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAnalysis('Sales Analysis')}
                disabled={isAnalyzing}
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Sales Analysis
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAnalysis('Customer Insights')}
                disabled={isAnalyzing}
              >
                <PieChart className="w-3 h-3 mr-1" />
                Customer Insights
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAnalysis('Performance Trends')}
                disabled={isAnalyzing}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Performance Trends
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAnalysis('Custom Analysis')}
                disabled={isAnalyzing}
              >
                Custom Analysis
              </Button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Analyzing your data...</span>
            </div>
          </div>
        )}

        {analysisComplete && analysisResults && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium text-green-600">✓ Analysis Complete</h4>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <h5 className="font-medium text-sm mb-2">{analysisResults.summary}</h5>
              <div className="space-y-1">
                {analysisResults.insights.map((insight: string, index: number) => (
                  <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
                    • {insight}
                  </p>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Records: {analysisResults.metrics.totalRecords}</span>
                  <span>Quality: {analysisResults.metrics.dataQuality}%</span>
                  <span>Time: {analysisResults.metrics.processingTime}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAnalysisComplete(false);
                setAnalysisResults(null);
              }}
              className="w-full"
            >
              Run New Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataImportPanel;
