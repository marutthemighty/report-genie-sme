
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertTriangle, BarChart3, Table } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AIPreviewProps {
  timeRange: string;
}

const AIPreview = ({ timeRange }: AIPreviewProps) => {
  // Generate data based on timeRange
  const getSampleData = (range: string) => {
    const now = new Date();
    let dataPoints: any[] = [];
    
    switch (range) {
      case '7d':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { weekday: 'short' }),
            revenue: Math.round(12000 + Math.random() * 10000)
          });
        }
        break;
      case '30d':
        for (let i = 29; i >= 0; i -= 3) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
            revenue: Math.round(12000 + Math.random() * 10000)
          });
        }
        break;
      case '90d':
        for (let i = 2; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { month: 'short' }),
            revenue: Math.round(12000 + Math.random() * 10000)
          });
        }
        break;
      case '1y':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { month: 'short' }),
            revenue: Math.round(12000 + Math.random() * 10000)
          });
        }
        break;
      case 'all':
        for (let i = 23; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          dataPoints.push({
            month: date.toLocaleDateString('en', { month: 'short', year: '2-digit' }),
            revenue: Math.round(12000 + Math.random() * 10000)
          });
        }
        break;
      default: // 6m
        dataPoints = [
          { month: 'Jan', revenue: 12000 },
          { month: 'Feb', revenue: 14000 },
          { month: 'Mar', revenue: 18000 },
          { month: 'Apr', revenue: 22000 },
          { month: 'May', revenue: 28000 },
          { month: 'Jun', revenue: 35000 },
        ];
    }
    
    return dataPoints;
  };

  const sampleData = getSampleData(timeRange);

  const sampleProducts = [
    { name: 'T-Shirt', sales: 245, revenue: '$4,900' },
    { name: 'Headphones', sales: 189, revenue: '$18,900' },
    { name: 'Sneakers', sales: 156, revenue: '$15,600' },
  ];

  const timeRangeOptions: { [key: string]: string } = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '6m': 'Last 6 months',
    '1y': 'Last 1 year',
    'all': 'All time'
  };

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            AI Insights Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            Your store experienced a <strong>15% increase</strong> in revenue this period ({timeRangeOptions[timeRange]}), 
            driven primarily by organic search traffic. The top-performing product category is 
            electronics, with headphones showing exceptional growth.
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="default">Revenue Growth: +15%</Badge>
            <Badge variant="secondary">Top Channel: Organic Search</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Alert */}
      <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700 dark:text-orange-300">
          <strong>Anomaly Detected:</strong> Sudden 40% spike in orders from mobile devices detected. 
          This may indicate a successful social media campaign or viral product mention.
        </AlertDescription>
      </Alert>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Revenue Trend ({timeRangeOptions[timeRange]})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Product Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            Top Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Sales</th>
                  <th className="text-left py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {sampleProducts.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{product.name}</td>
                    <td className="py-2">{product.sales}</td>
                    <td className="py-2 font-medium">{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPreview;
