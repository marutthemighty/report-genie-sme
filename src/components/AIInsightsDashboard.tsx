
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

const AIInsightsDashboard = () => {
  const { toast } = useToast();
  const [appliedActions, setAppliedActions] = useState<Set<string>>(new Set());

  const insights = [
    {
      id: '1',
      type: 'prediction',
      title: 'Revenue Growth Opportunity',
      description: 'Based on current trends, implementing the recommended pricing strategy could increase revenue by 15-20% over the next quarter.',
      confidence: 92,
      impact: 'high',
      action: 'Optimize pricing strategy',
      actionType: 'pricing'
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Unusual Traffic Pattern Detected',
      description: 'Organic search traffic has increased by 45% in the last 7 days, significantly above the normal range.',
      confidence: 87,
      impact: 'medium',
      action: 'Investigate traffic source',
      actionType: 'investigation'
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Customer Retention Improvement',
      description: 'Cart abandonment rate has increased by 12%. Implementing email reminders could recover 8-12% of lost sales.',
      confidence: 78,
      impact: 'high',
      action: 'Set up cart abandonment emails',
      actionType: 'automation'
    },
    {
      id: '4',
      type: 'prediction',
      title: 'Inventory Optimization',
      description: 'Product demand forecast suggests stocking 25% more inventory for top 5 products to avoid stockouts.',
      confidence: 85,
      impact: 'medium',
      action: 'Adjust inventory levels',
      actionType: 'inventory'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'anomaly': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-green-500" />;
      default: return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleTakeAction = (insight: typeof insights[0]) => {
    if (appliedActions.has(insight.id)) {
      toast({
        title: "Action Already Applied",
        description: `The action "${insight.action}" has already been applied for this insight.`,
        variant: "default",
      });
      return;
    }

    // Simulate action application
    setAppliedActions(prev => new Set([...prev, insight.id]));
    
    let actionMessage = '';
    switch (insight.actionType) {
      case 'pricing':
        actionMessage = 'Pricing optimization strategy has been queued for implementation. You will receive a detailed pricing plan within 24 hours.';
        break;
      case 'investigation':
        actionMessage = 'Traffic analysis has been initiated. A detailed report will be generated and sent to your dashboard.';
        break;
      case 'automation':
        actionMessage = 'Cart abandonment email sequence has been configured and will begin sending within 1 hour.';
        break;
      case 'inventory':
        actionMessage = 'Inventory adjustment recommendations have been sent to your inventory management system.';
        break;
      default:
        actionMessage = 'Action has been successfully initiated. Check your notifications for updates.';
    }

    toast({
      title: "Action Applied Successfully",
      description: actionMessage,
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Insights</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.length}</div>
            <p className="text-xs text-muted-foreground">
              {insights.filter(i => i.impact === 'high').length} high impact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Taken</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appliedActions.size}</div>
            <p className="text-xs text-muted-foreground">
              {insights.length - appliedActions.size} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {insights.length} insights
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
        {insights.map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                      <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                {appliedActions.has(insight.id) ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Applied
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{insight.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Recommended action:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{insight.action}</span>
                </div>
                
                <Button 
                  onClick={() => handleTakeAction(insight)}
                  disabled={appliedActions.has(insight.id)}
                  variant={appliedActions.has(insight.id) ? "outline" : "default"}
                >
                  {appliedActions.has(insight.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    <>
                      Take Action
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsDashboard;
