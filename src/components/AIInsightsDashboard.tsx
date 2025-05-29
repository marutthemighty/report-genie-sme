
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb, CheckCircle } from 'lucide-react';

const AIInsightsDashboard = () => {
  const insights = [
    {
      id: '1',
      type: 'prediction',
      title: 'Revenue Forecast',
      description: '10% sales growth expected next month based on current trends',
      confidence: 92,
      trend: 'up',
      actionable: true
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Traffic Spike',
      description: 'Unusual 300% increase in mobile traffic detected',
      confidence: 87,
      trend: 'up',
      actionable: false
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Inventory Alert',
      description: 'Top-selling items running low - restock recommended',
      confidence: 95,
      trend: 'down',
      actionable: true
    }
  ];

  const recommendations = [
    {
      id: '1',
      title: 'Optimize checkout flow',
      impact: 'High',
      effort: 'Medium',
      description: 'Reduce cart abandonment by simplifying the 3-step checkout process'
    },
    {
      id: '2',
      title: 'Increase Amazon ad spend',
      impact: 'Medium',
      effort: 'Low',
      description: 'Current ROAS of 4.2x suggests room for budget expansion'
    },
    {
      id: '3',
      title: 'Launch retargeting campaign',
      impact: 'High',
      effort: 'High',
      description: 'Target users who viewed products but didn\'t purchase'
    }
  ];

  const getInsightIcon = (type: string, trend: string) => {
    if (type === 'anomaly') return <AlertCircle className="w-5 h-5 text-orange-500" />;
    return trend === 'up' ? 
      <TrendingUp className="w-5 h-5 text-green-500" /> : 
      <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {getInsightIcon(insight.type, insight.trend)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {insight.description}
                  </p>
                  {insight.actionable && (
                    <Button variant="outline" size="sm">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{rec.title}</h4>
                    <Badge className={getImpactColor(rec.impact)}>
                      {rec.impact} Impact
                    </Badge>
                    <Badge variant="outline">
                      {rec.effort} Effort
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {rec.description}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsDashboard;
