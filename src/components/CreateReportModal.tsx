
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, Calendar, Database, Target } from 'lucide-react';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reportData, setReportData] = useState({
    name: '',
    type: '',
    dataSource: '',
    dateRange: '',
    uploadedFile: null as any
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const dataSources = [
    'Manual Upload',
    'Shopify',
    'Amazon Seller Central',
    'WooCommerce',
    'Google Analytics',
    'Facebook Ads',
    'Instagram',
    'BigCommerce',
    'Etsy',
    'Square',
    'Wix Commerce',
    'Adobe Commerce'
  ];

  const dateRanges = [
    'Last 7 Days',
    'Last 30 Days',
    'Last 90 Days',
    'Last 6 Months',
    'Last Year',
    'All Time',
    'Custom Range'
  ];

  const handleFileUpload = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        setReportData(prev => ({
          ...prev,
          uploadedFile: {
            name: file.name,
            size: file.size,
            type: file.type,
            content: content
          }
        }));
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully.`
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload CSV files only.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportData.name || !reportData.type || !reportData.dataSource || !reportData.dateRange) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reportData);
      // Reset form
      setReportData({
        name: '',
        type: '',
        dataSource: '',
        dateRange: '',
        uploadedFile: null
      });
      onClose();
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReportData({
      name: '',
      type: '',
      dataSource: '',
      dateRange: '',
      uploadedFile: null
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6" />
            Create New Report
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name *</Label>
              <Input
                id="reportName"
                placeholder="e.g., Q4 Sales Report"
                value={reportData.name}
                onChange={(e) => setReportData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type *</Label>
              <Select value={reportData.type} onValueChange={(value) => setReportData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataSource">Data Source *</Label>
              <Select value={reportData.dataSource} onValueChange={(value) => setReportData(prev => ({ ...prev, dataSource: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
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
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range *</Label>
              <Select value={reportData.dateRange} onValueChange={(value) => setReportData(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
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
          </div>

          {reportData.dataSource === 'Manual Upload' && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <Label className="text-base font-medium">Upload Data File</Label>
                  </div>
                  <FileUpload
                    accept=".csv"
                    onFileUpload={handleFileUpload}
                    className="w-full"
                  />
                  {reportData.uploadedFile && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {reportData.uploadedFile.name} ({Math.round(reportData.uploadedFile.size / 1024)} KB)
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating...' : 'Create Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportModal;
