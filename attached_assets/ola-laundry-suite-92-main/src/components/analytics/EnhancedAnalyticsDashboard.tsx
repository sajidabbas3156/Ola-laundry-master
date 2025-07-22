
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Shield, Activity, BarChart3 } from "lucide-react";
import { EnhancedFlowchartVisualization } from "./EnhancedFlowchartVisualization";
import { RBACVisualization } from "./RBACVisualization";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { OptimizedContextProvider } from "@/contexts/OptimizedContextManager";

export function EnhancedAnalyticsDashboard() {
  return (
    <OptimizedContextProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Enhanced Analytics & System Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="workflows" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="workflows" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Workflows
                </TabsTrigger>
                <TabsTrigger value="rbac" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  RBAC
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  System Health
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workflows">
                <EnhancedFlowchartVisualization />
              </TabsContent>

              <TabsContent value="rbac">
                <RBACVisualization />
              </TabsContent>

              <TabsContent value="performance">
                <PerformanceMonitor />
              </TabsContent>

              <TabsContent value="system">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Architecture Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">Frontend Layer</h4>
                              <ul className="text-sm space-y-1">
                                <li>• React + TypeScript</li>
                                <li>• Tailwind CSS</li>
                                <li>• Context API</li>
                                <li>• PWA Support</li>
                              </ul>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">State Management</h4>
                              <ul className="text-sm space-y-1">
                                <li>• Multi-tenant contexts</li>
                                <li>• Optimized rendering</li>
                                <li>• Local storage persistence</li>
                                <li>• Cache management</li>
                              </ul>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">Security Features</h4>
                              <ul className="text-sm space-y-1">
                                <li>• Role-based access</li>
                                <li>• Tenant isolation</li>
                                <li>• Secure token handling</li>
                                <li>• Session management</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Scalability Considerations</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Current Implementation:</strong>
                              <ul className="mt-1 space-y-1">
                                <li>• Local storage for data persistence</li>
                                <li>• Client-side state management</li>
                                <li>• Component-level optimization</li>
                              </ul>
                            </div>
                            <div>
                              <strong>Production Ready Features:</strong>
                              <ul className="mt-1 space-y-1">
                                <li>• Context optimization strategies</li>
                                <li>• Performance monitoring</li>
                                <li>• Memory management</li>
                                <li>• RBAC implementation</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </OptimizedContextProvider>
  );
}
