
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LaundrySpinner } from '@/components/ui/laundry-spinner';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Droplets, 
  Zap, 
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calculator,
  BarChart3,
  Target,
  Leaf,
  Activity
} from 'lucide-react';

export default function OLAOrdersFinancialAI() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderKilos, setOrderKilos] = useState('');
  const [serviceType, setServiceType] = useState('wash');
  const [volumeChange, setVolumeChange] = useState('10');
  const { toast } = useToast();

  // Fetch financial dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/laundry-ai/financial-dashboard'],
  });

  // Fetch KPI monitoring
  const { data: kpiData, isLoading: kpiLoading } = useQuery({
    queryKey: ['/api/laundry-ai/kpi-monitoring'],
  });

  // Order calculation mutation
  const calculateOrderMutation = useMutation({
    mutationFn: async (params: any) => {
      return apiRequest('POST', '/api/laundry-ai/calculate-order', params);
    },
  });

  // Volume simulation mutation
  const simulateVolumeMutation = useMutation({
    mutationFn: async (params: any) => {
      return apiRequest('POST', '/api/laundry-ai/simulate-volume-impact', params);
    },
  });

  const handleCalculateOrder = () => {
    if (!orderKilos || parseFloat(orderKilos) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid weight in kilograms",
        variant: "destructive"
      });
      return;
    }

    calculateOrderMutation.mutate({
      kilos: parseFloat(orderKilos),
      serviceType
    });
  };

  const handleVolumeSimulation = () => {
    simulateVolumeMutation.mutate({
      volumeChange: parseFloat(volumeChange)
    });
  };

  if (dashboardLoading || kpiLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LaundrySpinner variant="washing" size="lg" />
      </div>
    );
  }

  const data = dashboardData?.data;
  const kpiStatus = kpiData?.kpi_monitoring;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-600" />
          OLAORDERS LAUNDRY W.L.L. - Financial AI
        </h1>
        <p className="text-gray-600">Sustainable Technology-Enabled Laundry Solutions • Bahrain</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-green-600">
            <Leaf className="h-3 w-3 mr-1" />
            Eco-Friendly
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            <Target className="h-3 w-3 mr-1" />
            AI-Driven
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Financial Dashboard</TabsTrigger>
          <TabsTrigger value="kpis">KPI Monitoring</TabsTrigger>
          <TabsTrigger value="calculator">Order Calculator</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Recommendations</TabsTrigger>
        </TabsList>

        {/* Financial Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{data?.financials.revenue}</div>
                <p className="text-xs text-muted-foreground">Current period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{data?.financials.gross_profit}</div>
                <p className="text-xs text-muted-foreground">After COGS</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{data?.financials.net_profit}</div>
                <p className="text-xs text-muted-foreground">After all expenses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kilos Processed</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{data?.financials.kilos_processed}</div>
                <p className="text-xs text-muted-foreground">This period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Model</CardTitle>
                <CardDescription>OLAORDERS kilo-based pricing structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 border rounded-lg">
                    <span>Washing Only</span>
                    <span className="font-bold">{data?.pricing_model.wash_only}</span>
                  </div>
                  <div className="flex justify-between p-3 border rounded-lg">
                    <span>Wash + Iron</span>
                    <span className="font-bold">{data?.pricing_model.wash_iron}</span>
                  </div>
                  <div className="flex justify-between p-3 border rounded-lg bg-blue-50">
                    <span>Minimum Order</span>
                    <span className="font-bold">{data?.pricing_model.minimum_order}</span>
                  </div>
                  <div className="flex justify-between p-3 border rounded-lg bg-green-50">
                    <span>Minimum Charge</span>
                    <span className="font-bold">{data?.pricing_model.minimum_charge}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance vs Targets</CardTitle>
                <CardDescription>Year {data?.targets.year} goals tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Volume Target</span>
                      <span>{data?.targets.monthly_target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">75% of monthly target achieved</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Gross Margin</span>
                      <span>{data?.targets.margin_target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Margin performance: 90% of target</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* KPI Monitoring */}
        <TabsContent value="kpis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiStatus?.water_usage.current} L/kg</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={kpiStatus?.water_usage.status === 'on_track' ? 'default' : 'destructive'}>
                    {kpiStatus?.water_usage.status === 'on_track' ? 'On Track' : 'Needs Attention'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Target: {kpiStatus?.water_usage.target} L/kg
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiStatus?.energy_usage.current} kWh/kg</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={kpiStatus?.energy_usage.status === 'on_track' ? 'default' : 'destructive'}>
                    {kpiStatus?.energy_usage.status === 'on_track' ? 'On Track' : 'Needs Attention'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Target: {kpiStatus?.energy_usage.target} kWh/kg
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Detergent Cost</CardTitle>
                <Package className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.kpis.detergent_cost}</div>
                <p className="text-xs text-muted-foreground">Current rate per kg</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sustainability Score</CardTitle>
                <Leaf className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {kpiStatus?.sustainability_score.overall_score.toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground">Environmental efficiency</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sustainability Metrics</CardTitle>
              <CardDescription>Environmental impact and efficiency tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Water Efficiency</span>
                    <span>{kpiStatus?.sustainability_score.water_efficiency.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${kpiStatus?.sustainability_score.water_efficiency}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Energy Efficiency</span>
                    <span>{kpiStatus?.sustainability_score.energy_efficiency.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-600 h-3 rounded-full" 
                      style={{ width: `${kpiStatus?.sustainability_score.energy_efficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                OLAORDERS Price Calculator
              </CardTitle>
              <CardDescription>Calculate order pricing based on kilos and service type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                  <Input
                    type="number"
                    value={orderKilos}
                    onChange={(e) => setOrderKilos(e.target.value)}
                    placeholder="Enter weight in kg"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Service Type</label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wash">Washing Only</SelectItem>
                      <SelectItem value="wash_iron">Wash + Iron</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleCalculateOrder}
                    disabled={calculateOrderMutation.isPending}
                    className="w-full"
                  >
                    {calculateOrderMutation.isPending ? (
                      <LaundrySpinner variant="washing" size="sm" className="mr-2" />
                    ) : (
                      <Calculator className="mr-2 h-4 w-4" />
                    )}
                    Calculate Price
                  </Button>
                </div>
              </div>

              {calculateOrderMutation.data && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Pricing Breakdown</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium ml-2">{calculateOrderMutation.data.order.kilos} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium ml-2 capitalize">{calculateOrderMutation.data.order.service_type.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-medium ml-2">{calculateOrderMutation.data.order.price_per_kg} BHD/kg</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Calculated:</span>
                        <span className="font-medium ml-2">{calculateOrderMutation.data.order.calculated_price} BHD</span>
                      </div>
                      <div className="col-span-2 pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Final Price:</span>
                          <span className="text-xl font-bold text-green-600">
                            {calculateOrderMutation.data.order.final_price} BHD
                          </span>
                        </div>
                        {calculateOrderMutation.data.order.minimum_charge_applied && (
                          <p className="text-xs text-orange-600 mt-1">
                            *Minimum charge applied (4 kg minimum)
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensitivity Analysis */}
        <TabsContent value="sensitivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Volume Impact Simulation</CardTitle>
              <CardDescription>Analyze the financial impact of volume changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={volumeChange}
                  onChange={(e) => setVolumeChange(e.target.value)}
                  placeholder="Volume change %"
                  className="w-32"
                />
                <span className="text-gray-600">% volume change</span>
                <Button 
                  onClick={handleVolumeSimulation}
                  disabled={simulateVolumeMutation.isPending}
                >
                  {simulateVolumeMutation.isPending ? (
                    <LaundrySpinner variant="washing" size="sm" className="mr-2" />
                  ) : (
                    <BarChart3 className="mr-2 h-4 w-4" />
                  )}
                  Simulate Impact
                </Button>
              </div>

              {data?.sensitivity_analysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800">+10% Volume Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Revenue Impact:</span>
                          <span className="font-bold text-green-600">
                            {data.sensitivity_analysis.volume_up_10_percent.revenue_impact}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Profit Impact:</span>
                          <span className="font-bold text-green-600">
                            {data.sensitivity_analysis.volume_up_10_percent.profit_impact}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-800">-10% Volume Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Revenue Impact:</span>
                          <span className="font-bold text-red-600">
                            {data.sensitivity_analysis.volume_down_10_percent.revenue_impact}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Profit Impact:</span>
                          <span className="font-bold text-red-600">
                            {data.sensitivity_analysis.volume_down_10_percent.profit_impact}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {simulateVolumeMutation.data && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle>Custom Simulation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Volume Change: {simulateVolumeMutation.data.simulation.volume_change}</div>
                      <div>Revenue Impact: {simulateVolumeMutation.data.simulation.revenue_impact}</div>
                      <div>Profit Impact: {simulateVolumeMutation.data.simulation.profit_impact}</div>
                      <div>Absolute Change: {simulateVolumeMutation.data.simulation.absolute_profit_change}</div>
                      <div className="col-span-2 pt-2 border-t">
                        <strong>Recommendation:</strong> {simulateVolumeMutation.data.simulation.recommendation}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts & Recommendations */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            {data?.alerts?.map((alert: any, index: number) => (
              <Card key={index} className={
                alert.type === 'critical' ? 'border-red-200 bg-red-50' :
                alert.type === 'warning' ? 'border-orange-200 bg-orange-50' :
                'border-blue-200 bg-blue-50'
              }>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.type === 'critical' ? 'text-red-600' :
                      alert.type === 'warning' ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <Badge variant="outline" className="mt-1">
                        Impact: {alert.impact.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Strategic suggestions for operational improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.recommendations?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                      <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span className="text-sm">{rec}</span>
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
