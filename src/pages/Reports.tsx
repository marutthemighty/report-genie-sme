import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  TrendingUp
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CreateReportModal from '@/components/CreateReportModal';
import { useReports } from '@/hooks/useReports';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { reports, loading, createReport, deleteReport } = useReports();

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.report_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.data_source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
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
    
    // Navigate to the dedicated Editor page with the report ID
    navigate(`/editor?id=${reportId}`);
  };

  const handleDownload = (report: any) => {
    try {
      // Create comprehensive report content
      const reportContent = `
${report.name}
Generated on: ${new Date(report.created_at).toLocaleDateString()}

Report Type: ${report.report_type}
Data Source: ${report.data_source}
Date Range: ${report.date_range}
Status: ${report.status}

AI Summary:
${report.ai_summary || 'No AI summary available.'}

AI Predictions:
${report.ai_prediction || 'No AI predictions available.'}

Report ID: ${report.id}
Created By: ${report.created_by}
Generated At: ${new Date(report.generated_at).toLocaleString()}
      `.trim();

      // Create and download the file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: `Report "${report.name}" has been downloaded successfully.`,
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

  const handleExportAll = () => {
    try {
      if (filteredReports.length === 0) {
        toast({
          title: "No Reports to Export",
          description: "There are no reports matching your current filters.",
          variant: "destructive"
        });
        return;
      }

      // Create combined report content
      let allReportsContent = `All Reports Export\nGenerated on: ${new Date().toLocaleDateString()}\nTotal Reports: ${filteredReports.length}\n\n`;
      
      filteredReports.forEach((report, index) => {
        allReportsContent += `
========== REPORT ${index + 1} ==========
Name: ${report.name}
Type: ${report.report_type}
Data Source: ${report.data_source}
Date Range: ${report.date_range}
Status: ${report.status}
Created: ${new Date(report.created_at).toLocaleDateString()}

AI Summary:
${report.ai_summary || 'No AI summary available.'}

AI Predictions:
${report.ai_prediction || 'No AI predictions available.'}

Report ID: ${report.id}
Generated At: ${new Date(report.generated_at).toLocaleString()}

`;
      });

      // Create and download the file
      const blob = new Blob([allReportsContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_reports_export_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `${filteredReports.length} reports have been exported successfully.`,
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
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <SelectItem value="Sales Performance">Sales Performance</SelectItem>
                      <SelectItem value="Traffic Analytics">Traffic Analytics</SelectItem>
                      <SelectItem value="Product Performance">Product Performance</SelectItem>
                      <SelectItem value="Cart Abandonment">Cart Abandonment</SelectItem>
                      <SelectItem value="Customer Retention">Customer Retention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions</label>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleExportAll}
                    disabled={filteredReports.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
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
                    Get started by creating your first report.
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Report
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer">
                        <div className="flex items-center gap-1">
                          Name
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Database className="w-4 h-4" />
                          Data Source
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.report_type}</Badge>
                        </TableCell>
                        <TableCell>{report.data_source}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(report.id, report.name)}
                              title="Edit Report"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownload(report)}
                              title="Download Report"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
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
    </div>
  );
};

export default Reports;
