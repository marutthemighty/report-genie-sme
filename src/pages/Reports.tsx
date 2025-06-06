
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Download,
  Plus,
  ArrowUpDown,
  Calendar,
  Database,
  TrendingUp,
  CheckSquare,
  Square
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CreateReportModal from '@/components/CreateReportModal';
import { useReports } from '@/hooks/useReports';
import { useUserSettings } from '@/hooks/useUserSettings';
import { exportData } from '@/utils/exportUtils';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dataSourceFilter, setDataSourceFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReportHtml, setSelectedReportHtml] = useState<string | null>(null);
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();
  const { settings } = useUserSettings();
  
  const { reports, loading, createReport, deleteReport } = useReports();

  // Complete list of all 9 report types
  const allReportTypes = [
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

  // Complete list of all data sources
  const allDataSources = [
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

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.report_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.data_source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
    const matchesDataSource = dataSourceFilter === 'all' || report.data_source === dataSourceFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesDataSource;
  });

  const handleCreateReport = async (reportData: any) => {
    try {
      await createReport(reportData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleEdit = (reportId: string, reportName: string) => {
    toast({
      title: "Opening Report Editor",
      description: `Loading "${reportName}" for editing...`,
    });
    
    navigate(`/editor?id=${reportId}`);
  };

  const handleViewReport = (report: any) => {
    if (report.html_content) {
      setSelectedReportHtml(report.html_content);
    } else {
      toast({
        title: "No Report Available",
        description: "This report doesn't have a HTML version available.",
        variant: "destructive"
      });
    }
  };

  const handleSelectReport = (reportId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedReports);
    if (isSelected) {
      newSelected.add(reportId);
    } else {
      newSelected.delete(reportId);
    }
    setSelectedReports(newSelected);
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedReports(new Set(filteredReports.map(report => report.id)));
    } else {
      setSelectedReports(new Set());
    }
  };

  const handleDownload = async (report: any, format: 'pdf' | 'csv' | 'googleSlides') => {
    try {
      // Check if user has enabled this export format
      if (!settings.export_formats[format]) {
        toast({
          title: "Export Format Disabled",
          description: `${format.toUpperCase()} export is disabled in your settings. Please enable it in Settings > Export Formats.`,
          variant: "destructive"
        });
        return;
      }

      const reportData = {
        summary: report.ai_summary || 'No summary available',
        keyMetrics: [
          { label: 'Report Type', value: report.report_type, change: '' },
          { label: 'Data Source', value: report.data_source, change: '' },
          { label: 'Status', value: report.status, change: '' },
          { label: 'Date Range', value: report.date_range, change: '' }
        ],
        recommendations: report.ai_prediction ? [report.ai_prediction] : [],
        chartData: {},
        datasetInfo: report.dataset_info
      };

      await exportData({
        format,
        data: reportData,
        title: report.name,
        includeCharts: false
      });

      toast({
        title: "Download Complete",
        description: `Report "${report.name}" has been downloaded as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBulkDownload = async (format: 'pdf' | 'csv' | 'googleSlides') => {
    try {
      if (selectedReports.size === 0) {
        toast({
          title: "No Reports Selected",
          description: "Please select reports to download.",
          variant: "destructive"
        });
        return;
      }

      const selectedReportData = filteredReports.filter(report => selectedReports.has(report.id));
      
      for (const report of selectedReportData) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between downloads
        await handleDownload(report, format);
      }

      toast({
        title: "Bulk Download Complete",
        description: `Downloaded ${selectedReports.size} reports as ${format.toUpperCase()}.`,
      });

      setSelectedReports(new Set()); // Clear selection after download
    } catch (error) {
      console.error('Bulk download error:', error);
      toast({
        title: "Bulk Download Failed",
        description: "Failed to download selected reports. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportAll = async (format: 'pdf' | 'csv' | 'googleSlides') => {
    try {
      if (filteredReports.length === 0) {
        toast({
          title: "No Reports to Export",
          description: "There are no reports matching your current filters.",
          variant: "destructive"
        });
        return;
      }

      // Create a combined export of all reports
      const allReportsData = {
        summary: `Export of ${filteredReports.length} reports generated on ${new Date().toLocaleDateString()}`,
        keyMetrics: [
          { label: 'Total Reports', value: filteredReports.length.toString(), change: '' },
          { label: 'Generated Reports', value: filteredReports.filter(r => r.status === 'Generated').length.toString(), change: '' },
          { label: 'Pending Reports', value: filteredReports.filter(r => r.status === 'Pending').length.toString(), change: '' }
        ],
        recommendations: [
          'Review pending reports and complete generation',
          'Analyze report performance metrics',
          'Consider automating recurring reports'
        ],
        chartData: {},
        reports: filteredReports
      };

      await exportData({
        format,
        data: allReportsData,
        title: `All_Reports_Export_${new Date().toISOString().split('T')[0]}`,
        includeCharts: false
      });

      toast({
        title: "Export Complete",
        description: `${filteredReports.length} reports have been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export all error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export reports. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      deleteReport(reportId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar onCreateReport={() => setIsCreateModalOpen(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading reports...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onCreateReport={() => setIsCreateModalOpen(true)} />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage and view your AI-generated reports</p>
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

        {/* Content */}
        <div className="p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Bulk Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="generated">Generated</SelectItem>
                      <SelectItem value="generating">Generating</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {allReportTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Source</label>
                  <Select value={dataSourceFilter} onValueChange={setDataSourceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {allDataSources.map((source) => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bulk Actions</label>
                <div className="flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={selectedReports.size === 0}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download ({selectedReports.size})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {settings.export_formats.pdf && (
                        <DropdownMenuItem onClick={() => handleBulkDownload('pdf')}>
                          Download as PDF
                        </DropdownMenuItem>
                      )}
                      {settings.export_formats.csv && (
                        <DropdownMenuItem onClick={() => handleBulkDownload('csv')}>
                          Download as CSV
                        </DropdownMenuItem>
                      )}
                      {settings.export_formats.googleSlides && (
                        <DropdownMenuItem onClick={() => handleBulkDownload('googleSlides')}>
                          Download as Google Slides
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={filteredReports.length === 0}
                      >
                        Export All
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {settings.export_formats.pdf && (
                        <DropdownMenuItem onClick={() => handleExportAll('pdf')}>
                          Export All as PDF
                        </DropdownMenuItem>
                      )}
                      {settings.export_formats.csv && (
                        <DropdownMenuItem onClick={() => handleExportAll('csv')}>
                          Export All as CSV
                        </DropdownMenuItem>
                      )}
                      {settings.export_formats.googleSlides && (
                        <DropdownMenuItem onClick={() => handleExportAll('googleSlides')}>
                          Export All as Google Slides
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Reports ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No reports found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get started by creating your first AI report.
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Report
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedReports.size === filteredReports.length && filteredReports.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="cursor-pointer min-w-[200px] max-w-[250px]">
                          <div className="flex items-center gap-1">
                            Name
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[120px]">Type</TableHead>
                        <TableHead className="min-w-[140px]">
                          <div className="flex items-center gap-1">
                            <Database className="w-4 h-4" />
                            Data Source
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[200px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <Checkbox
                              checked={selectedReports.has(report.id)}
                              onCheckedChange={(checked) => handleSelectReport(report.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="max-w-[240px]">
                              <div className="truncate" title={report.name}>{report.name}</div>
                              {report.dataset_info && (
                                <div className="text-xs text-green-600 truncate" title={`Dataset: ${report.dataset_info.fileName}`}>
                                  📊 Dataset: {report.dataset_info.fileName}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{report.report_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="truncate max-w-[130px]" title={report.data_source}>
                              {report.data_source}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(report.status)} text-xs`}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {report.html_content && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewReport(report)}
                                  title="View Report"
                                >
                                  <TrendingUp className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEdit(report.id, report.name)}
                                title="Edit Report"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    title="Download Report"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {settings.export_formats.pdf && (
                                    <DropdownMenuItem onClick={() => handleDownload(report, 'pdf')}>
                                      Download as PDF
                                    </DropdownMenuItem>
                                  )}
                                  {settings.export_formats.csv && (
                                    <DropdownMenuItem onClick={() => handleDownload(report, 'csv')}>
                                      Download as CSV
                                    </DropdownMenuItem>
                                  )}
                                  {settings.export_formats.googleSlides && (
                                    <DropdownMenuItem onClick={() => handleDownload(report, 'googleSlides')}>
                                      Download as Google Slides
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => handleDelete(report.id)}
                                title="Delete Report"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <CreateReportModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateReport}
      />

      {/* Report Viewer Modal */}
      {selectedReportHtml && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto w-full">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Report Preview</h3>
              <Button 
                variant="outline" 
                onClick={() => setSelectedReportHtml(null)}
              >
                Close
              </Button>
            </div>
            <div 
              className="p-4"
              dangerouslySetInnerHTML={{ __html: selectedReportHtml }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
