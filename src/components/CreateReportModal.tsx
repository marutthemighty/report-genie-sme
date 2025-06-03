
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ArrowRight, Sparkles, Calendar as CalendarIcon, Upload, FileText } from 'lucide-react';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reportData: any) => void;
}

const CreateReportModal = ({ isOpen, onClose, onSubmit }: CreateReportModalProps) => {
  const [reportName, setReportName] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dataSources = [
    'Shopify', 'WooCommerce', 'Google Analytics', 'Facebook Ads', 
    'Instagram', 'Amazon', 'BigCommerce', 'Etsy', 'Square', 'Manual Upload'
  ];

  // Complete list of all 9 report types
  const reportTypes = [
    'Sales Performance', 
    'Cart Abandonment', 
    'Product Performance', 
    'Customer Acquisition', 
    'Marketing RoI', 
    'Inventory Trends', 
    'Customer Retention', 
    'Revenue Forecast', 
    'Traffic Analytics'
  ];

  const dateRanges = [
    'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 
    'Last Year', 'Custom Range', 'All Time'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!dataSource) {
        setDataSource('Manual Upload');
      }
    }
  };

  const processFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let fileContent = '';
      let fileInfo = null;

      if (uploadedFile) {
        fileContent = await processFileContent(uploadedFile);
        fileInfo = {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.type,
          content: fileContent
        };
      }

      const reportData = {
        name: reportName,
        dataSource,
        type: reportType,
        dateRange,
        customStartDate,
        customEndDate,
        uploadedFile: fileInfo
      };

      if (onSubmit) {
        await onSubmit(reportData);
      }
      
      // Reset form
      setReportName('');
      setDataSource('');
      setReportType('');
      setDateRange('');
      setUploadedFile(null);
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
      
      onClose();
      
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = reportName && dataSource && reportType && dateRange;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Create New AI Report
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Name */}
          <div className="space-y-2">
            <Label htmlFor="reportName">Report Name</Label>
            <Input
              id="reportName"
              placeholder="e.g., Q2 Sales Performance Analysis"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Data Source */}
          <div className="space-y-2">
            <Label>Data Source</Label>
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select your data source" />
              </SelectTrigger>
              <SelectContent>
                {dataSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dataset Upload */}
          <div className="space-y-2">
            <Label>Dataset Upload (Recommended for detailed analysis)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Upload CSV, Excel, or JSON files for comprehensive AI analysis
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="dataset-upload"
                />
                <label
                  htmlFor="dataset-upload"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose Dataset File
                </label>
                {uploadedFile && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="text-sm text-green-700 font-medium">
                      ✓ {uploadedFile.name}
                    </div>
                    <div className="text-xs text-green-600">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for AI analysis
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Pro tip: Upload your actual data for personalized insights and professional PDF reports
            </p>
          </div>

          {/* Report Type */}
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose the type of analysis" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'Custom Range' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customStartDate ? format(customStartDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={setCustomStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customEndDate ? format(customEndDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={setCustomEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* AI Features Preview */}
          {reportType && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Analysis Preview
              </h4>
              <p className="text-sm text-blue-700">
                {uploadedFile ? (
                  `AI will thoroughly analyze your uploaded dataset (${uploadedFile.name}) for ${reportType.toLowerCase()}, providing detailed insights, statistical analysis, and professional recommendations in a comprehensive PDF report.`
                ) : (
                  reportType === 'Sales Performance' ? 
                    "AI will analyze revenue trends, identify top-performing products, and provide growth recommendations." :
                  reportType === 'Cart Abandonment' ? 
                    "AI will identify abandonment patterns, suggest optimization strategies, and predict recovery opportunities." :
                  reportType === 'Product Performance' ? 
                    "AI will evaluate product metrics, identify bestsellers, and recommend inventory optimizations." :
                  reportType === 'Customer Acquisition' ? 
                    "AI will analyze acquisition channels, calculate customer lifetime value, and optimize marketing spend." :
                  reportType === 'Marketing RoI' ? 
                    "AI will measure campaign effectiveness, attribution analysis, and budget optimization recommendations." :
                  reportType === 'Inventory Trends' ? 
                    "AI will forecast demand, identify slow-moving stock, and optimize inventory management." :
                  reportType === 'Customer Retention' ? 
                    "AI will analyze churn patterns, identify at-risk customers, and recommend retention strategies." :
                  reportType === 'Revenue Forecast' ? 
                    "AI will predict future revenue trends, seasonal patterns, and growth opportunities." :
                  reportType === 'Traffic Analytics' ? 
                    "AI will analyze user behavior, conversion paths, and website optimization opportunities." :
                    "AI will provide comprehensive analysis and actionable insights for your business."
                )}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Professional Report...
                </>
              ) : (
                <>
                  Generate Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportModal;
