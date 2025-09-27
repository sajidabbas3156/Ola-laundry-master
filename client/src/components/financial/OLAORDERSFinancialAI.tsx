import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LaundrySpinner } from '@/components/ui/laundry-spinner';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  PieChart,
  Calculator,
  CreditCard,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Zap
} from 'lucide-react';

interface FinancialPrediction {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
}

interface CashFlowForecast {
  period: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeBalance: number;
}

interface FinancialAlert {
  id: string;
  type: 'warning' | 'opportunity' | 'critical';
  title: string;
  description: string;
  amount?: number;
  dueDate?: string;
  actionRequired: boolean;
}

interface ProfitabilityAnalysis {
  service: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

interface OLAORDERSData {
  predictions: FinancialPrediction[];
  cashFlowForecast: CashFlowForecast[];
  alerts: FinancialAlert[];
  profitabilityAnalysis: ProfitabilityAnalysis[];
  kpis: {
    totalRevenue: number;
    revenueGrowth: number;
    profitMargin: number;
    cashFlow: number;
    outstandingReceivables: number;
    paymentDelays: number;
  };
  aiInsights: {
    revenueOptimization: string[];
    costReduction: string[];
    cashFlowImprovement: string[];
    riskMitigation: string[];
  };
}

export default function OLAORDERSFinancialAI() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [analysisType, setAnalysisType] = useState('comprehensive');

  const { data: financialData, isLoading, refetch } = useQuery<OLAORDERSData>({
    queryKey: ['/api/financial/ai-analysis', timeRange, analysisType],
    queryFn: async () => {
      // Mock OLAORDERS financial AI data
      return {
        predictions: [
          {
            metric: 'Monthly Revenue',
            current: 28500,
            predicted: 32400,
            confidence: 89,
            timeframe: 'Next 30 days',
            trend: 'up',
            impact: 'high'
          },
          {
            metric: 'Operating Costs',
            current: 18200,
            predicted: 17800,
            confidence: 85,
            timeframe: 'Next 30 days',
            trend: 'down',
            impact: 'medium'
          },
          {
            metric: 'Cash Flow',
            current: 10300,
            predicted: 14600,
            confidence: 92,
            timeframe: 'Next 30 days',
            trend: 'up',
            impact: 'high'
          },
          {
            metric: 'Customer Acquisition Cost',
            current: 45,
            predicted: 38,
            confidence: 78,
            timeframe: 'Next 30 days',
            trend: 'down',
            impact: 'medium'
          }
        ],
        cashFlowForecast: [
          { period: 'Week 1', inflow: 8500, outflow: 6200, netFlow: 2300, cumulativeBalance: 12300 },
          { period: 'Week 2', inflow: 9200, outflow: 6800, netFlow: 2400, cumulativeBalance: 14700 },
          { period: 'Week 3', inflow: 8800, outflow: 6500, netFlow: 2300, cumulativeBalance: 17000 },
          { period: 'Week 4', inflow: 9500, outflow: 7100, netFlow: 2400, cumulativeBalance: 19400 }
        ],
        alerts: [
          {
            id: '1',
            type: 'warning',
            title: 'Payment Delay Risk',
            description: 'Customer ABC Corp has overdue payment of $1,250. Risk of bad debt increasing.',
            amount: 1250,
            dueDate: '2024-01-20',
            actionRequired: true
          },
          {
            id: '2',
            type: 'opportunity',
            title: 'Pricing Optimization',
            description: 'Premium services showing 15% higher demand. Consider price increase.',
            actionRequired: true
          },
          {
            id: '3',
            type: 'critical',
            title: 'Cash Flow Alert',
            description: 'Projected cash shortage in 2 weeks. Consider accelerating collections.',
            amount: -3500,
            actionRequired: true
          }
        ],
        profitabilityAnalysis: [
          {
            service: 'Dry Cleaning',
            revenue: 12500,
            costs: 7800,
            profit: 4700,
            margin: 37.6,
            trend: 'up',
            recommendation: 'Expand capacity - highest margin service'
          },
          {
            service: 'Wash & Fold',
            revenue: 15000,
            costs: 11200,
            profit: 3800,
            margin: 25.3,
            trend: 'stable',
            recommendation: 'Optimize operations to improve margins'
          },
          {
            service: 'Ironing',
            revenue: 6500,
            costs: 4900,
            profit: 1600,
            margin: 24.6,
            trend: 'down',
            recommendation: 'Review pricing strategy'
          },
          {
            service: 'Alterations',
            revenue: 3200,
            costs: 1800,
            profit: 1400,
            margin: 43.8,
            trend: 'up',
            recommendation: 'High margin - promote more actively'
          }
        ],
        kpis: {
          totalRevenue: 37200,
          revenueGrowth: 12.8,
          profitMargin: 31.2,
          cashFlow: 11500,
          outstandingReceivables: 8900,
          paymentDelays: 5.2
        },
        aiInsights: {
          revenueOptimization: [
            'Implement dynamic pricing during peak hours (6-8 PM)',
            'Introduce premium service tiers for 23% revenue increase',
            'Cross-sell alterations with dry cleaning for $180/month boost'
          ],
          costReduction: [
            'Optimize delivery routes to save $450/month in fuel costs',
            'Negotiate bulk detergent purchase for 8% cost reduction',
            'Implement energy-efficient machines to reduce utility costs by 12%'
          ],
          cashFlowImprovement: [
            'Offer 2% early payment discount to accelerate collections',
            'Implement automated payment reminders to reduce delays by 40%',
            'Consider invoice factoring for immediate cash flow improvement'
          ],
          riskMitigation: [
            'Diversify customer base - 60% revenue from top 5 customers',
            'Implement credit checks for new commercial accounts',
            'Maintain 3-month operating expense reserve fund'
          ]
        }
      };
    }
  });

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (percentage: number) => `${percentage.toFixed(1)}%`;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getAlertIcon = (type: FinancialAlert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'opportunity':
        return <Target className="h-4 w-4 text-green-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

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
            <Calculator className="h-8 w-8 text-blue-600" />
            OLAORDERS Financial AI
          </h1>
          <p className="text-gray-600">AI-powered financial analysis and optimization for your laundry business</p>
        </div>
        <div className="flex space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="revenue">Revenue Focus</SelectItem>
              <SelectItem value="costs">Cost Analysis</SelectItem>
              <SelectItem value="cashflow">Cash Flow</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData?.kpis.totalRevenue || 0)}</div>
            <p className="text-xs text-green-600">+{formatPercentage(financialData?.kpis.revenueGrowth || 0)} growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(financialData?.kpis.profitMargin || 0)}</div>
            <p className="text-xs text-muted-foreground">Industry avg: 28%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData?.kpis.cashFlow || 0)}</div>
            <p className="text-xs text-green-600">Positive trend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receivables</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData?.kpis.outstandingReceivables || 0)}</div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Delays</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData?.kpis.paymentDelays || 0} days</div>
            <p className="text-xs text-yellow-600">Above target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Score</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87/100</div>
            <p className="text-xs text-green-600">Excellent</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Alerts</CardTitle>
                <CardDescription>Critical financial items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData?.alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        {alert.amount && (
                          <p className="text-sm font-medium mt-1">
                            Amount: {formatCurrency(Math.abs(alert.amount))}
                          </p>
                        )}
                        {alert.dueDate && (
                          <p className="text-sm text-gray-500">Due: {alert.dueDate}</p>
                        )}
                      </div>
                      {alert.actionRequired && (
                        <Button size="sm" variant="outline">
                          Take Action
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>AI Predictions</CardTitle>
                <CardDescription>Next 30-day financial forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData?.predictions.slice(0, 3).map((prediction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTrendIcon(prediction.trend)}
                        <div>
                          <h4 className="font-medium">{prediction.metric}</h4>
                          <p className="text-sm text-gray-600">{prediction.confidence}% confidence</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {prediction.metric.includes('Cost') || prediction.metric.includes('Revenue') || prediction.metric.includes('Flow')
                            ? formatCurrency(prediction.predicted)
                            : `$${prediction.predicted}`}
                        </div>
                        <div className={`text-sm ${prediction.trend === 'up' ? 'text-green-600' : prediction.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                          {prediction.trend === 'up' ? '+' : prediction.trend === 'down' ? '-' : ''}
                          {Math.abs(((prediction.predicted - prediction.current) / prediction.current) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financialData?.predictions.map((prediction, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{prediction.metric}</span>
                    <Badge variant={prediction.impact === 'high' ? 'default' : prediction.impact === 'medium' ? 'secondary' : 'outline'}>
                      {prediction.impact} impact
                    </Badge>
                  </CardTitle>
                  <CardDescription>{prediction.timeframe}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current:</span>
                      <span className="font-medium">{formatCurrency(prediction.current)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Predicted:</span>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(prediction.trend)}
                        <span className="font-medium text-blue-600">{formatCurrency(prediction.predicted)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{prediction.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Forecast</CardTitle>
              <CardDescription>4-week cash flow projection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData?.cashFlowForecast.map((forecast, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Period</p>
                      <p className="font-medium">{forecast.period}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Inflow</p>
                      <p className="font-medium text-green-600">{formatCurrency(forecast.inflow)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Outflow</p>
                      <p className="font-medium text-red-600">{formatCurrency(forecast.outflow)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Flow</p>
                      <p className={`font-medium ${forecast.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(forecast.netFlow)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Balance</p>
                      <p className="font-medium">{formatCurrency(forecast.cumulativeBalance)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profitability Tab */}
        <TabsContent value="profitability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {financialData?.profitabilityAnalysis.map((analysis, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{analysis.service}</span>
                    {getTrendIcon(analysis.trend)}
                  </CardTitle>
                  <CardDescription>Service profitability analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue:</span>
                      <span className="font-medium">{formatCurrency(analysis.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Costs:</span>
                      <span className="font-medium">{formatCurrency(analysis.costs)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profit:</span>
                      <span className="font-medium text-green-600">{formatCurrency(analysis.profit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Margin:</span>
                      <span className="font-medium">{formatPercentage(analysis.margin)}</span>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">AI Recommendation:</p>
                      <p className="text-sm text-blue-700">{analysis.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                  <span>Revenue Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialData?.aiInsights.revenueOptimization.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowDownRight className="h-5 w-5 text-blue-600" />
                  <span>Cost Reduction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialData?.aiInsights.costReduction.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-purple-600" />
                  <span>Cash Flow Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialData?.aiInsights.cashFlowImprovement.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Risk Mitigation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialData?.aiInsights.riskMitigation.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}