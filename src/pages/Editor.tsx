
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useReports } from '@/hooks/useReports';
import Sidebar from '@/components/Sidebar';
import TemplateBuilder from '@/components/TemplateBuilder';
import { 
  Save, 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Database,
  Loader2,
  Eye,
  Trash2
} from 'lucide-react';

const Editor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id');
  const { toast } = useToast();
  const { reports, createReport, updateReport, deleteReport, loading } = useReports();

  const [reportData, setReportData] = useState({
    name: '',
    report_type: '',
    data_source: '',
    date_range: '',
    ai_summary: '',
    ai_prediction: '',
    template_layout: {}
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (reportId) {
      const existingReport = reports.find(r => r.id === reportId);
      if (existingReport) {
        setReportData({
          name: existingReport.name || '',
          report_type: existingReport.report_type || '',
          data_source: existingReport.data_source || '',
          date_range: existingReport.date_range || '',
          ai_summary: existingReport.ai_summary || '',
          ai_prediction: existingReport.ai_prediction || '',
          template_layout: existingReport.template_layout || {}
        });
        setIsEditing(true);
      }
    }
  }, [reportId, reports]);

  const handleInputChange = (field: string, value: string) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (template: any) => {
    setReportData(prev => ({
      ...prev,
      template_layout: template
    }));
  };

  const handleSave = async () => {
    if (!reportData.name || !reportData.report_type || !reportData.data_source) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Type, Data Source).",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && reportId) {
        await updateReport(reportId, reportData);
        toast({
          title: "Report Updated",
          description: "Your report has been successfully updated."
        });
      } else {
        await createReport({
          ...reportData,
          status: 'Generated',
          generated_at: new Date().toISOString()
        });
        toast({
          title: "Report Created",
          description: "Your report has been successfully created."
        });
      }
      navigate('/reports');
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!reportId) return;
    
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
        toast({
          title: "Report Deleted",
          description: "The report has been successfully deleted."
        });
        navigate('/reports');
      } catch (error) {
        console.error('Error deleting report:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete the report. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePreview = () => {
    navigate(`/?preview=${reportId || 'new'}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/reports')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reports
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Report' : 'Create New Report'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {isEditing ? 'Modify your existing report' : 'Design and create a new analytics report'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handlePreview}
                disabled={!reportData.name}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              {isEditing && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button 
                onClick={handleSave}
                disabled={isSaving || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEditing ? 'Update Report' : 'Create Report'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Report Name *</label>
                  <Input
                    value={reportData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter report name"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type *</label>
                    <Select 
                      value={reportData.report_type} 
                      onValueChange={(value) => handleInputChange('report_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Data Source *</label>
                    <Select 
                      value={reportData.data_source} 
                      onValueChange={(value) => handleInputChange('data_source', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Shopify">Shopify</SelectItem>
                        <SelectItem value="WooCommerce">WooCommerce</SelectItem>
                        <SelectItem value="Google Analytics">Google Analytics</SelectItem>
                        <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Amazon">Amazon</SelectItem>
                        <SelectItem value="BigCommerce">BigCommerce</SelectItem>
                        <SelectItem value="CSV Upload">CSV Upload</SelectItem>
                        <SelectItem value="Excel Upload">Excel Upload</SelectItem>
                        <SelectItem value="Manual Upload">Manual Upload</SelectItem>
                        <SelectItem value="API Integration">API Integration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date Range</label>
                  <Select 
                    value={reportData.date_range} 
                    onValueChange={(value) => handleInputChange('date_range', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                      <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                      <SelectItem value="Last 3 months">Last 3 months</SelectItem>
                      <SelectItem value="Last 6 months">Last 6 months</SelectItem>
                      <SelectItem value="Last year">Last year</SelectItem>
                      <SelectItem value="All Time">All Time</SelectItem>
                      <SelectItem value="Custom range">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  AI Analysis & Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">AI Summary</label>
                  <Textarea
                    value={reportData.ai_summary}
                    onChange={(e) => handleInputChange('ai_summary', e.target.value)}
                    placeholder="AI-generated summary will appear here..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">AI Predictions</label>
                  <Textarea
                    value={reportData.ai_prediction}
                    onChange={(e) => handleInputChange('ai_prediction', e.target.value)}
                    placeholder="AI predictions and recommendations will appear here..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Template Configuration */}
            <TemplateBuilder 
              value={reportData.template_layout}
              onChange={handleTemplateChange}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => navigate('/reports')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEditing ? 'Update Report' : 'Create Report'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
