import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LaundrySpinner } from '@/components/ui/laundry-spinner';
import OLAORDERSFinancialAI from '@/components/financial/OLAORDERSFinancialAI';
import AIForecastingValidator from '@/components/testing/AIForecastingValidator';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  ShoppingCart,
  Zap,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Calculator
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'prediction' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  estimatedValue?: number;
}

interface AIForecast {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
}

interface AIOperationsData {
  insights: AIInsight[];
  forecasts: AIForecast[];
  automationStatus: {
    activeRules: number;
    processedToday: number;
    efficiency: number;
    savings: number;
  };
  modelPerformance: {
    accuracy: number;
    lastTrained: string;
    dataPoints: number;
    version: string;
  };
}

export default function AIOperationsCenter() {
  const [activeTab, setActiveTab] = useState('insights');
  const [timeRange, setTimeRange] = useState('7d');
  const [insightFilter, setInsightFilter] = useState('all');

  // Fetch AI operations data
  const { data: aiData, isLoading, refetch } = useQuery<AIOperationsData>({
    queryKey: ['/api/ai/operations', timeRange],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      return {
        insights: [
          {
            id: '1',
            type: 'opportunity',
            title: 'Peak Hour Optimization',
            description: 'Increase pricing by 15% during 6-8 PM peak hours to maximize revenue',
            impact: 'high',
            confidence: 87,
            actionable: true,
            estimatedValue: 2400
          },
          {
            id: '2',
            type: 'prediction',
            title: 'Demand Surge Expected',
            description: 'Weekend demand predicted to increase by 23% based on weather patterns',
            impact: 'medium',
            confidence: 92,
            actionable: true,
            estimatedValue: 1800
          },
          {
            id: '3',
            type: 'warning',
            title: 'Inventory Alert',
            description: 'Detergent stock will run low in 3 days based on current usage patterns',
            impact: 'medium',
            confidence: 95,
            actionable: true
          },
          {
            id: '4',
            type: 'optimization',
            title: 'Route Efficiency',
            description: 'Optimizing delivery routes could reduce travel time by 18%',
            impact: 'high',
            confidence: 84,
            actionable: true,
            estimatedValue: 1200
          }
        ],
        forecasts: [
          {
            metric: 'Daily Revenue',
            current: 1250,
            predicted: 1450,
            confidence: 89,
            timeframe: 'Next 7 days',
            trend: 'up'
          },
          {
            metric: 'Order Volume',
            current: 45,
            predicted: 52,
            confidence: 91,
            timeframe: 'Next 7 days',
            trend: 'up'
          },
          {
            metric: 'Customer Retention',
            current: 78,
            predicted: 82,
            confidence: 85,
            timeframe: 'Next 30 days',
            trend: 'up'
          },
          {
            metric: 'Operational Efficiency',
            current: 87,
            predicted: 91,
            confidence: 88,
            timeframe: 'Next 14 days',
            trend: 'up'
          }
        ],
        automationStatus: {
          activeRules: 12,
          processedToday: 156,
          efficiency: 94,
          savings: 3200
        },
        modelPerformance: {
          accuracy: 89.5,
          lastTrained: '2024-01-15',
          dataPoints: 15420,
          version: 'v2.1.3'
        }
      };
    }
  });

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <Target className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'prediction':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'optimization':
        return <Zap className="h-4 w-4 text-purple-600" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightBadgeColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInsights = aiData?.insights.filter(insight => 
    insightFilter === 'all' || insight.type === insightFilter
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LaundrySpinner variant="washing" size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            AI Operations Center
          </h1>
          <p className="text-gray-600">Intelligent insights and automated optimization for your laundry business</p>
        </div>
        <div className="flex space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* AI Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active AI Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiData?.automationStatus.activeRules}</div>
            <p className="text-xs text-muted-foreground">Automation rules running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Today</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiData?.automationStatus.processedToday}</div>
            <p className="text-xs text-muted-foreground">AI-driven decisions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Efficiency</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiData?.automationStatus.efficiency}%</div>
            <p className="text-xs text-green-600">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${aiData?.automationStatus.savings}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="financial">OLAORDERS</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="performance">Model Performance</TabsTrigger>
        </TabsList>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">AI-Generated Insights</h2>
            <Select value={insightFilter} onValueChange={setInsightFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Insights</SelectItem>
                <SelectItem value="opportunity">Opportunities</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="prediction">Predictions</SelectItem>
                <SelectItem value="optimization">Optimizations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInsights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getInsightIcon(insight.type)}
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getInsightBadgeColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                      <Badge variant="outline">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    {insight.estimatedValue && (
                      <span className="text-sm font-medium text-green-600">
                        Potential value: ${insight.estimatedValue}
                      </span>
                    )}
                    {insight.actionable && (
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Forecasts Tab */}
        <TabsContent value="forecasts" className="space-y-6">
          <h2 className="text-xl font-semibold">AI Forecasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiData?.forecasts.map((forecast, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{forecast.metric}</span>
                    {forecast.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : forecast.trend === 'down' ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <div className="h-5 w-5 bg-gray-400 rounded-full" />
                    )}
                  </CardTitle>
                  <CardDescription>{forecast.timeframe}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current:</span>
                      <span className="font-medium">
                        {forecast.metric.includes('Revenue') ? '$' : ''}
                        {forecast.current}
                        {forecast.metric.includes('Retention') || forecast.metric.includes('Efficiency') ? '%' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Predicted:</span>
                      <span className="font-medium text-blue-600">
                        {forecast.metric.includes('Revenue') ? '$' : ''}
                        {forecast.predicted}
                        {forecast.metric.includes('Retention') || forecast.metric.includes('Efficiency') ? '%' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <Badge variant="outline">{forecast.confidence}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <h2 className="text-xl font-semibold">AI Automation Status</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Automation Rules</CardTitle>
                <CardDescription>Currently running AI-powered automations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Dynamic Pricing</h4>
                      <p className="text-sm text-gray-600">Adjusts prices based on demand</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Inventory Management</h4>
                      <p className="text-sm text-gray-600">Auto-reorders supplies</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Route Optimization</h4>
                      <p className="text-sm text-gray-600">Optimizes delivery routes</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Performance</CardTitle>
                <CardDescription>Impact of AI automation on operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Saved</span>
                    <span className="font-medium">12.5 hours/week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost Reduction</span>
                    <span className="font-medium text-green-600">-18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-medium text-green-600">-45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-medium text-green-600">+23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OLAORDERS Financial AI Tab */}
        <TabsContent value="financial" className="space-y-6">
          <OLAORDERSFinancialAI />
        </TabsContent>

        {/* AI Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          <AIForecastingValidator />
        </TabsContent>

        {/* Model Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <h2 className="text-xl font-semibold">AI Model Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Statistics</CardTitle>
                <CardDescription>Current AI model performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Model Accuracy</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${aiData?.modelPerformance.accuracy}%` }}
                        />
                      </div>
                      <span className="font-medium">{aiData?.modelPerformance.accuracy}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Training Data Points</span>
                    <span className="font-medium">{aiData?.modelPerformance.dataPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Model Version</span>
                    <Badge variant="outline">{aiData?.modelPerformance.version}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Trained</span>
                    <span className="font-medium">{aiData?.modelPerformance.lastTrained}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Health</CardTitle>
                <CardDescription>AI system health and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Model is performing optimally</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Data quality is excellent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Consider retraining in 30 days</span>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full">
                      Schedule Model Retraining
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}