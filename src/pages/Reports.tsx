
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  BarChart3,
  ChevronDown,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CreateReportModal from '@/components/CreateReportModal';
import { useReports } from '@/hooks/useReports';
import { useUserSettingsStore } from '@/stores/useUserSettingsStore';

const Reports = () => {
  const { toast } = useToast();
  const { exportFormats } = useUserSettingsStore();
  const { reports, loading } = useReports();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockReports = [
    {
      id: '1',
      name: 'Q4 Sales Performance Report',
      report_type: 'sales',
      status: 'completed',
      created_at: '2024-01-15T10:30:00Z',
      generated_at: '2024-01-15T10:30:00Z',
      created_by: 'user1',
      data_source: 'Shopify',
      date_range: 'Q4 2023'
    },
    {
      id: '2', 
      name: 'Customer Behavior Analysis',
      report_type: 'analytics',
      status: 'completed',
      created_at: '2024-01-14T14:20:00Z',
      generated_at: '2024-01-14T14:20:00Z',
      created_by: 'user1',
      data_source: 'Google Analytics',
      date_range: 'Last 30 days'
    },
    {
      id: '3',
      name: 'Monthly Revenue Summary',
      report_type: 'financial',
      status: 'generating',
      created_at: '2024-01-16T09:15:00Z',
      generated_at: '2024-01-16T09:15:00Z',
      created_by: 'user1',
      data_source: 'Stripe',
      date_range: 'January 2024'
    },
    {
      id: '4',
      name: 'Product Performance Metrics',
      report_type: 'product',
      status: 'completed',
      created_at: '2024-01-13T16:45:00Z',
      generated_at: '2024-01-13T16:45:00Z',
      created_by: 'user1',
      data_source: 'WooCommerce',
      date_range: 'Last 7 days'
    },
    {
      id: '5',
      name: 'Marketing Campaign ROI',
      report_type: 'marketing',
      status: 'failed',
      created_at: '2024-01-12T11:30:00Z',
      generated_at: '2024-01-12T11:30:00Z',
      created_by: 'user1',
      data_source: 'Facebook Ads',
      date_range: 'December 2023'
    }
  ];

  const allReports = reports?.length ? reports : mockReports;

  const filteredReports = allReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.data_source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'generating':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Generating</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <BarChart3 className="w-4 h-4" />;
      case 'analytics':
        return <Eye className="w-4 h-4" />;
      case 'financial':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleExportPDF = (reportId: string, reportName: string) => {
    toast({
      title: "PDF Export",
      description: `Generating PDF for "${reportName}"...`,
    });

    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: `"${reportName}" has been exported as PDF.`,
      });
    }, 2000);
  };

  const handleExportCSV = (reportId: string, reportName: string) => {
    toast({
      title: "CSV Export",
      description: `Generating CSV for "${reportName}"...`,
    });

    setTimeout(() => {
      const csvContent = `Report Name,Type,Status,Created Date
"${reportName}",Sales,Completed,${new Date().toLocaleDateString()}`;

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "CSV Downloaded",
        description: `"${reportName}" has been exported as CSV.`,
      });
    }, 1500);
  };

  const handleExportSlides = (reportId: string, reportName: string) => {
    toast({
      title: "Google Slides Export",
      description: `Creating presentation for "${reportName}"...`,
    });

    setTimeout(() => {
      toast({
        title: "Slides Ready",
        description: `"${reportName}" presentation is ready in Google Slides.`,
      });
    }, 3000);
  };

  const handleDeleteReport = (reportId: string, reportName: string) => {
    if (confirm(`Are you sure you want to delete "${reportName}"?`)) {
      toast({
        title: "Report Deleted",
        description: `"${reportName}" has been deleted.`,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateReport = (reportData: any) => {
    // Handle report creation
    toast({
      title: "Report Created",
      description: "Your report has been created successfully.",
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage and export your business reports</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {selectedStatus === 'all' ? 'All' : selectedStatus}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('generating')}>
                    Generating
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('failed')}>
                    Failed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Reports Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchQuery || selectedStatus !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'Get started by creating your first report.'
                }
              </p>
              {!searchQuery && selectedStatus === 'all' && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Report
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getReportTypeIcon(report.report_type)}
                        <CardTitle className="text-lg leading-tight break-words hyphens-auto" title={report.name}>
                          {report.name}
                        </CardTitle>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <User className="w-4 h-4 shrink-0" />
                        <span className="break-words">{report.data_source}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span className="break-words">{report.date_range}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {formatDate(report.created_at)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 min-w-0"
                        disabled={report.status !== 'completed'}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      
                      {report.status === 'completed' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="shrink-0">
                              <Download className="w-4 h-4 mr-1" />
                              Export
                              <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                            {exportFormats.pdf && (
                              <DropdownMenuItem onClick={() => handleExportPDF(report.id, report.name)}>
                                <FileText className="w-4 h-4 mr-2" />
                                Export as PDF
                              </DropdownMenuItem>
                            )}
                            {exportFormats.csv && (
                              <DropdownMenuItem onClick={() => handleExportCSV(report.id, report.name)}>
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                                Export as CSV
                              </DropdownMenuItem>
                            )}
                            {exportFormats.googleSlides && (
                              <DropdownMenuItem onClick={() => handleExportSlides(report.id, report.name)}>
                                <Presentation className="w-4 h-4 mr-2" />
                                Export to Slides
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteReport(report.id, report.name)}
                        className="text-red-600 hover:text-red-700 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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

export default Reports;
