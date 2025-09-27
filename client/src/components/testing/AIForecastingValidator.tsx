import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LaundrySpinner } from '@/components/ui/laundry-spinner';
import { 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Zap,
  RefreshCw,
  Download,
  Play,
  Pause
} from 'lucide-react';

interface ForecastTest {
  id: string;
  name: string;
  description: string;
  metric: string;
  actualValue: number;
  predictedValue: number;
  confidence: number;
  accuracy: number;
  status: 'passed' | 'failed' | 'warning';
  testDate: string;
  timeframe: string;
}

interface AccuracyMetrics {
  overall: number;
  byMetric: {
    revenue: number;
    orders: number;
    customers: number;
    costs: number;
  };
  byTimeframe: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  trend: 'improving' | 'declining' | 'stable';
}

interface ValidationResults {
  tests: ForecastTest[];
  accuracy: AccuracyMetrics;
  recommendations: string[];
  modelHealth: {
    score: number;
    status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
    lastValidation: string;
  };
}

export default function AIForecastingValidator() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  const { data: validationData, isLoading, refetch } = useQuery<ValidationResults>({
    queryKey: ['/api/ai/validation'],
    queryFn: async () => {
      // Mock validation data - replace with actual AI validation service
      return {
        tests: [
          {
            id: '1',
            name: 'Revenue Prediction Test',
            description: 'Weekly revenue forecasting accuracy',
            metric: 'Revenue',
            actualValue: 28500,
            predictedValue: 27800,
            confidence: 89,
            accuracy: 97.5,
            status: 'passed',
            testDate: '2024-01-20',
            timeframe: 'Weekly'
          },
          {
            id: '2',
            name: 'Order Volume Test',
            description: 'Daily order volume prediction',
            metric: 'Orders',
            actualValue: 45,
            predictedValue: 52,
            confidence: 91,
            accuracy: 84.6,
            status: 'warning',
            testDate: '2024-01-20',
            timeframe: 'Daily'
          },
          {
            id: '3',
            name: 'Customer Retention Test',
            description: 'Monthly customer retention forecast',
            metric: 'Customers',
            actualValue: 78,
            predictedValue: 82,
            confidence: 85,
            accuracy: 94.9,
            status: 'passed',
            testDate: '2024-01-20',
            timeframe: 'Monthly'
          },
          {
            id: '4',
            name: 'Operating Costs Test',
            description: 'Weekly operating cost prediction',
            metric: 'Costs',
            actualValue: 18200,
            predictedValue: 17800,
            confidence: 85,
            accuracy: 97.8,
            status: 'passed',
            testDate: '2024-01-20',
            timeframe: 'Weekly'
          },
          {
            id: '5',
            name: 'Peak Hours Test',
            description: 'Peak hour demand forecasting',
            metric: 'Orders',
            actualValue: 25,
            predictedValue: 18,
            confidence: 78,
            accuracy: 72.0,
            status: 'failed',
            testDate: '2024-01-20',
            timeframe: 'Hourly'
          }
        ],
        accuracy: {
          overall: 89.4,
          byMetric: {
            revenue: 97.5,
            orders: 78.3,
            customers: 94.9,
            costs: 97.8
          },
          byTimeframe: {
            daily: 84.6,
            weekly: 97.7,
            monthly: 94.9
          },
          trend: 'improving'
        },
        recommendations: [
          'Improve hourly demand forecasting by incorporating weather data',
          'Enhance order volume predictions with seasonal adjustment factors',
          'Consider ensemble modeling for better accuracy across all metrics',
          'Increase training data frequency for real-time model updates',
          'Implement confidence interval reporting for better uncertainty quantification'
        ],
        modelHealth: {
          score: 89.4,
          status: 'good',
          lastValidation: '2024-01-20T10:30:00Z'
        }
      };
    }
  });

  const runValidationTests = async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    
    // Simulate test execution
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setTestProgress(i);
    }
    
    setIsRunningTests(false);
    refetch();
  };

  const getStatusIcon = (status: ForecastTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ForecastTest['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'needs_improvement':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LaundrySpinner variant="washing" size="lg" />
      </div>
    );
  }

  const passedTests = validationData?.tests.filter(t => t.status === 'passed').length || 0;
  const totalTests = validationData?.tests.length || 0;
  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            AI Forecasting Validator
          </h1>
          <p className="text-gray-600">Comprehensive testing and validation of AI forecasting accuracy</p>
        </div>
        <div className="flex space-x-4">
          <Button 
            onClick={runValidationTests} 
            disabled={isRunningTests}
            className="flex items-center gap-2"
          >
            {isRunningTests ? (
              <>
                <Pause className="h-4 w-4" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Validation
              </>
            )}
          </Button>
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

      {isRunningTests && (
        <Card>
          <CardHeader>
            <CardTitle>Running Validation Tests</CardTitle>
            <CardDescription>Testing AI forecasting models against historical data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{testProgress}%</span>
              </div>
              <Progress value={testProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validationData?.accuracy.overall.toFixed(1)}%</div>
            <p className={`text-xs ${validationData?.accuracy.trend === 'improving' ? 'text-green-600' : 'text-gray-600'}`}>
              {validationData?.accuracy.trend === 'improving' ? '↗' : '→'} {validationData?.accuracy.trend}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{passedTests}/{totalTests} tests passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthStatusColor(validationData?.modelHealth.status || '')}`}>
              {validationData?.modelHealth.score.toFixed(1)}/100
            </div>
            <p className="text-xs text-muted-foreground capitalize">{validationData?.modelHealth.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Validation</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">10:30 AM</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="metrics">Accuracy Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accuracy by Metric</CardTitle>
                <CardDescription>Forecasting accuracy breakdown by business metric</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revenue Forecasting</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${validationData?.accuracy.byMetric.revenue}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{validationData?.accuracy.byMetric.revenue}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Order Volume</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full" 
                          style={{ width: `${validationData?.accuracy.byMetric.orders}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{validationData?.accuracy.byMetric.orders}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Metrics</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${validationData?.accuracy.byMetric.customers}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{validationData?.accuracy.byMetric.customers}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost Predictions</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${validationData?.accuracy.byMetric.costs}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{validationData?.accuracy.byMetric.costs}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accuracy by Timeframe</CardTitle>
                <CardDescription>Model performance across different prediction horizons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Predictions</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full" 
                          style={{ width: `${validationData?.accuracy.byTimeframe.daily}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{validationData?.accuracy.byTimeframe.daily}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Predictions</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${validationData?.accuracy.byTimeframe.weekly}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{validationData?.accuracy.byTimeframe.weekly}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Predictions</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${validationData?.accuracy.byTimeframe.monthly}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{validationData?.accuracy.byTimeframe.monthly}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Test Results Tab */}
        <TabsContent value="tests" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {validationData?.tests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      {getStatusIcon(test.status)}
                      <span>{test.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      <Badge variant="outline">
                        {test.accuracy.toFixed(1)}% accuracy
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Actual Value</p>
                      <p className="font-medium">{test.actualValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Predicted Value</p>
                      <p className="font-medium">{test.predictedValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="font-medium">{test.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Timeframe</p>
                      <p className="font-medium">{test.timeframe}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Model accuracy trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <p>Accuracy trend chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Distribution</CardTitle>
                <CardDescription>Distribution of prediction errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <p>Error distribution histogram would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Improvement Recommendations</CardTitle>
              <CardDescription>Actionable insights to enhance forecasting accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {validationData?.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Implement
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}