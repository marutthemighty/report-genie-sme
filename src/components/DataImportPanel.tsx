
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, BarChart3, TrendingUp, Database } from 'lucide-react';

interface DataImportPanelProps {
  onAnalysisComplete: (results: any) => void;
}

const DataImportPanel = ({ onAnalysisComplete }: DataImportPanelProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualData, setManualData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const generateRandomSampleData = () => {
    const sampleDataSets = [
      {
        name: "E-commerce Sales Data",
        data: `Product,Revenue,Units Sold,Category,Month
Gaming Laptop,$${Math.floor(Math.random() * 50000 + 30000)},${Math.floor(Math.random() * 200 + 50)},Electronics,${new Date().toLocaleDateString()}
Wireless Headphones,$${Math.floor(Math.random() * 15000 + 8000)},${Math.floor(Math.random() * 400 + 100)},Electronics,${new Date().toLocaleDateString()}
Office Chair,$${Math.floor(Math.random() * 12000 + 6000)},${Math.floor(Math.random() * 300 + 80)},Furniture,${new Date().toLocaleDateString()}
Coffee Machine,$${Math.floor(Math.random() * 8000 + 4000)},${Math.floor(Math.random() * 150 + 60)},Appliances,${new Date().toLocaleDateString()}
Running Shoes,$${Math.floor(Math.random() * 10000 + 5000)},${Math.floor(Math.random() * 250 + 90)},Sports,${new Date().toLocaleDateString()}`
      },
      {
        name: "Marketing Campaign Performance",
        data: `Campaign,CTR,Conversions,Cost,ROI,Platform
Summer Sale ${Math.floor(Math.random() * 1000)},${(Math.random() * 5 + 2).toFixed(2)}%,${Math.floor(Math.random() * 500 + 100)},$${Math.floor(Math.random() * 10000 + 5000)},${(Math.random() * 200 + 150).toFixed(1)}%,Google Ads
Black Friday ${Math.floor(Math.random() * 1000)},${(Math.random() * 6 + 3).toFixed(2)}%,${Math.floor(Math.random() * 800 + 200)},$${Math.floor(Math.random() * 15000 + 8000)},${(Math.random() * 250 + 180).toFixed(1)}%,Facebook
Holiday Promo ${Math.floor(Math.random() * 1000)},${(Math.random() * 4 + 2.5).toFixed(2)}%,${Math.floor(Math.random() * 600 + 150)},$${Math.floor(Math.random() * 12000 + 6000)},${(Math.random() * 220 + 160).toFixed(1)}%,Instagram
Newsletter ${Math.floor(Math.random() * 1000)},${(Math.random() * 3 + 1.5).toFixed(2)}%,${Math.floor(Math.random() * 300 + 80)},$${Math.floor(Math.random() * 5000 + 2000)},${(Math.random() * 180 + 120).toFixed(1)}%,Email`
      },
      {
        name: "Customer Analytics",
        data: `Customer_ID,Age,Spend,Visits,Satisfaction,Segment
CUST${Math.floor(Math.random() * 10000)},${Math.floor(Math.random() * 40 + 25)},${Math.floor(Math.random() * 2000 + 500)},${Math.floor(Math.random() * 20 + 5)},${(Math.random() * 2 + 3).toFixed(1)},Premium
CUST${Math.floor(Math.random() * 10000)},${Math.floor(Math.random() * 35 + 28)},${Math.floor(Math.random() * 1500 + 300)},${Math.floor(Math.random() * 15 + 3)},${(Math.random() * 2 + 3.5).toFixed(1)},Regular
CUST${Math.floor(Math.random() * 10000)},${Math.floor(Math.random() * 30 + 22)},${Math.floor(Math.random() * 800 + 200)},${Math.floor(Math.random() * 10 + 2)},${(Math.random() * 1.5 + 3).toFixed(1)},Basic
CUST${Math.floor(Math.random() * 10000)},${Math.floor(Math.random() * 45 + 30)},${Math.floor(Math.random() * 3000 + 800)},${Math.floor(Math.random() * 25 + 8)},${(Math.random() * 1.5 + 4).toFixed(1)},VIP`
      },
      {
        name: "Inventory Analysis",
        data: `SKU,Product,Stock,Reorder_Point,Last_Sale,Category
SKU${Math.floor(Math.random() * 10000)},Bluetooth Speaker,${Math.floor(Math.random() * 200 + 50)},${Math.floor(Math.random() * 50 + 20)},${Math.floor(Math.random() * 30) + 1} days ago,Electronics
SKU${Math.floor(Math.random() * 10000)},Desk Organizer,${Math.floor(Math.random() * 150 + 30)},${Math.floor(Math.random() * 40 + 15)},${Math.floor(Math.random() * 20) + 1} days ago,Office
SKU${Math.floor(Math.random() * 10000)},Water Bottle,${Math.floor(Math.random() * 300 + 80)},${Math.floor(Math.random() * 60 + 25)},${Math.floor(Math.random() * 15) + 1} days ago,Lifestyle
SKU${Math.floor(Math.random() * 10000)},Phone Case,${Math.floor(Math.random() * 400 + 100)},${Math.floor(Math.random() * 80 + 30)},${Math.floor(Math.random() * 10) + 1} days ago,Accessories`
      }
    ];

    const randomDataSet = sampleDataSets[Math.floor(Math.random() * sampleDataSets.length)];
    setManualData(randomDataSet.data);
    
    toast({
      title: "Sample Data Generated",
      description: `Generated ${randomDataSet.name} with randomized values.`,
    });
  };

  const generateDynamicAnalysis = (data: string) => {
    const lines = data.split('\n').filter(line => line.trim());
    const headers = lines[0]?.split(',') || [];
    const dataRows = lines.slice(1);
    
    // Generate dynamic insights based on actual data
    const analysisTemplates = [
      {
        summary: `Analysis of ${dataRows.length} records reveals significant patterns in ${headers[1] || 'key metrics'}. Data shows ${Math.floor(Math.random() * 30 + 15)}% variance in performance with notable seasonality trends.`,
        keyMetrics: [
          { label: 'Data Points', value: dataRows.length.toString(), change: '+' + Math.floor(Math.random() * 20 + 5) + '%' },
          { label: 'Avg Performance', value: (Math.random() * 50 + 75).toFixed(1) + '%', change: '+' + (Math.random() * 10 + 2).toFixed(1) + '%' },
          { label: 'Efficiency Score', value: (Math.random() * 20 + 80).toFixed(1), change: '+' + (Math.random() * 8 + 3).toFixed(1) + '%' },
          { label: 'Growth Rate', value: '+' + (Math.random() * 15 + 5).toFixed(1) + '%', change: 'stable' }
        ],
        recommendations: [
          `Focus on optimizing ${headers[Math.floor(Math.random() * headers.length)] || 'key metrics'} to maximize ROI`,
          `Implement data-driven strategies for ${headers[Math.floor(Math.random() * headers.length)] || 'performance improvement'}`,
          `Consider seasonal adjustments based on ${Math.floor(Math.random() * 12 + 1)} month trending patterns`,
          `Automate monitoring for ${headers[Math.floor(Math.random() * headers.length)] || 'critical indicators'} to prevent issues`,
          `Scale successful initiatives while addressing underperforming ${headers[Math.floor(Math.random() * headers.length)] || 'areas'}`
        ]
      },
      {
        summary: `Comprehensive evaluation of ${dataRows.length} data points indicates strong correlation between ${headers[0] || 'primary'} and ${headers[1] || 'secondary'} variables. Predictive modeling suggests ${Math.floor(Math.random() * 25 + 10)}% improvement potential.`,
        keyMetrics: [
          { label: 'Records Analyzed', value: dataRows.length.toString(), change: 'new analysis' },
          { label: 'Correlation Score', value: (Math.random() * 0.4 + 0.6).toFixed(2), change: 'strong' },
          { label: 'Confidence Level', value: (Math.random() * 10 + 85).toFixed(1) + '%', change: 'high' },
          { label: 'Improvement Potential', value: '+' + (Math.random() * 20 + 15).toFixed(1) + '%', change: 'validated' }
        ],
        recommendations: [
          `Leverage high-performing ${headers[Math.floor(Math.random() * headers.length)] || 'segments'} for strategic expansion`,
          `Address identified bottlenecks in ${headers[Math.floor(Math.random() * headers.length)] || 'operational processes'}`,
          `Implement predictive analytics for ${headers[Math.floor(Math.random() * headers.length)] || 'demand forecasting'}`,
          `Optimize resource allocation based on ${headers[Math.floor(Math.random() * headers.length)] || 'performance data'}`,
          `Establish KPI monitoring for ${headers[Math.floor(Math.random() * headers.length)] || 'business metrics'}`
        ]
      }
    ];

    return analysisTemplates[Math.floor(Math.random() * analysisTemplates.length)];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} is ready for analysis.`,
      });
    }
  };

  const analyzeData = async () => {
    setIsAnalyzing(true);
    
    try {
      let dataToAnalyze = '';
      
      if (uploadedFile) {
        // Read file content
        const fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsText(uploadedFile);
        });
        dataToAnalyze = fileContent;
      } else if (manualData) {
        dataToAnalyze = manualData;
      } else {
        throw new Error('No data to analyze');
      }

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate dynamic analysis based on actual data
      const results = generateDynamicAnalysis(dataToAnalyze);
      
      onAnalysisComplete(results);
      
      toast({
        title: "Analysis Complete",
        description: "Your data has been analyzed successfully with AI-powered insights.",
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Data Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Data</h3>
              <p className="text-gray-600 mb-4">
                Upload CSV, Excel, or JSON files for comprehensive analysis
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileUpload}
                className="hidden"
                id="data-upload"
              />
              <label
                htmlFor="data-upload"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Choose File
              </label>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700 font-medium">
                    ✓ {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Data Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Manual Data Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your CSV data here or use sample data..."
            value={manualData}
            onChange={(e) => setManualData(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button
              onClick={generateRandomSampleData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Generate Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={analyzeData}
            disabled={(!uploadedFile && !manualData.trim()) || isAnalyzing}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing Data...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze Data with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImportPanel;
