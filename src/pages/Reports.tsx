
import { useState } from 'react';
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

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sample reports data with real-looking data
  const [reports] = useState([
    {
      id: '1',
      name: 'Q2 Shopify Sales Performance',
      type: 'Sales Performance',
      dataSource: 'Shopify',
      status: 'Generated',
      createdBy: 'John Doe',
      createdAt: '2024-01-15',
      aiScore: 92,
      revenue: '$128,450',
      growth: '+15.3%'
    },
    {
      id: '2',
      name: 'Google Analytics Traffic Analysis',
      type: 'Traffic Analytics',
      dataSource: 'Google Analytics',
      status: 'Generated',
      createdBy: 'Jane Smith',
      createdAt: '2024-01-14',
      aiScore: 87,
      sessions: '45,230',
      growth: '+8.7%'
    },
    {
      id: '3',
      name: 'Amazon Product Performance Review',
      type: 'Product Performance',
      dataSource: 'Amazon',
      status: 'Pending',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-13',
      aiScore: 0,
      revenue: 'Processing...',
      growth: 'N/A'
    },
    {
      id: '4',
      name: 'Cart Abandonment Analysis - WooCommerce',
      type: 'Cart Abandonment',
      dataSource: 'WooCommerce',
      status: 'Generated',
      createdBy: 'Sarah Wilson',
      createdAt: '2024-01-12',
      aiScore: 78,
      recoverable: '$23,890',
      growth: '+12.1%'
    },
    {
      id: '5',
      name: 'Etsy Customer Retention Study',
      type: 'Customer Retention',
      dataSource: 'Etsy',
      status: 'Failed',
      createdBy: 'Tom Brown',
      createdAt: '2024-01-11',
      aiScore: 0,
      revenue: 'Error',
      growth: 'N/A'
    }
  ]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.dataSource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score > 0) return 'text-red-600';
    return 'text-gray-400';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
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
                  <Button variant="outline" className="w-full">
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
                    <TableHead>Created By</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        AI Score
                      </div>
                    </TableHead>
                    <TableHead>Key Metric</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>{report.dataSource}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.createdAt}</TableCell>
                      <TableCell>{report.createdBy}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getAIScoreColor(report.aiScore)}`}>
                          {report.aiScore > 0 ? `${report.aiScore}/100` : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{report.revenue || report.sessions || report.recoverable}</div>
                          <div className="text-gray-500">{report.growth}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <CreateReportModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default Reports;
