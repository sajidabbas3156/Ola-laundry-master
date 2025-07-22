
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Trash2, RefreshCw, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useOptimizedContext } from "@/contexts/OptimizedContextManager";

export function PerformanceMonitor() {
  const {
    metrics,
    cache,
    clearCache,
    forceGarbageCollection,
    getMemoryUsage,
    optimizeRenders,
    setOptimizeRenders
  } = useOptimizedContext();

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpuUsage: 0,
    memoryPressure: 0,
    cacheHitRate: 0,
    activeConnections: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics({
        cpuUsage: Math.random() * 100,
        memoryPressure: (metrics.memoryUsage / (1024 * 1024 * 100)) * 100, // Normalize to percentage
        cacheHitRate: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 50) + 10
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [metrics.memoryUsage]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return "text-green-600";
    if (value <= thresholds.warning) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value <= thresholds.warning) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Monitor
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={optimizeRenders}
                  onChange={(e) => setOptimizeRenders(e.target.checked)}
                />
                Optimize Renders
              </label>
              <Button variant="outline" size="sm" onClick={clearCache}>
                <Trash2 className="h-3 w-3 mr-1" />
                Clear Cache
              </Button>
              <Button variant="outline" size="sm" onClick={forceGarbageCollection}>
                <RefreshCw className="h-3 w-3 mr-1" />
                GC
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Render Performance */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Render Count</span>
                  {getPerformanceIcon(metrics.lastRenderTime, { good: 16, warning: 33 })}
                </div>
                <div className="text-2xl font-bold">{metrics.renderCount}</div>
                <div className="text-xs text-gray-500">
                  Avg: {metrics.averageRenderTime.toFixed(2)}ms
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Memory</span>
                  {getPerformanceIcon(realTimeMetrics.memoryPressure, { good: 50, warning: 75 })}
                </div>
                <div className="text-2xl font-bold">{formatBytes(metrics.memoryUsage)}</div>
                <Progress value={realTimeMetrics.memoryPressure} className="h-2" />
              </CardContent>
            </Card>

            {/* Cache Performance */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Cache Size</span>
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{cache.size()}</div>
                <div className="text-xs text-gray-500">
                  Hit Rate: {realTimeMetrics.cacheHitRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            {/* Active Connections */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Connections</span>
                  {getPerformanceIcon(realTimeMetrics.activeConnections, { good: 20, warning: 35 })}
                </div>
                <div className="text-2xl font-bold">{realTimeMetrics.activeConnections}</div>
                <div className="text-xs text-gray-500">Active sessions</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics Table */}
          <div className="space-y-4">
            <h3 className="font-semibold">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPU Usage</span>
                  <Badge variant={realTimeMetrics.cpuUsage > 80 ? "destructive" : realTimeMetrics.cpuUsage > 60 ? "default" : "secondary"}>
                    {realTimeMetrics.cpuUsage.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={realTimeMetrics.cpuUsage} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Memory Pressure</span>
                  <Badge variant={realTimeMetrics.memoryPressure > 80 ? "destructive" : realTimeMetrics.memoryPressure > 60 ? "default" : "secondary"}>
                    {realTimeMetrics.memoryPressure.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={realTimeMetrics.memoryPressure} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cache Hit Rate</span>
                  <Badge variant={realTimeMetrics.cacheHitRate > 80 ? "secondary" : realTimeMetrics.cacheHitRate > 60 ? "default" : "destructive"}>
                    {realTimeMetrics.cacheHitRate.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={realTimeMetrics.cacheHitRate} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Time</span>
                  <Badge variant={metrics.lastRenderTime < 16 ? "secondary" : metrics.lastRenderTime < 33 ? "default" : "destructive"}>
                    {metrics.lastRenderTime.toFixed(2)}ms
                  </Badge>
                </div>
                <Progress value={Math.min((metrics.lastRenderTime / 50) * 100, 100)} className="h-2" />
              </div>
            </div>
          </div>

          {/* Optimization Recommendations */}
          <div className="mt-6 space-y-2">
            <h4 className="font-semibold text-sm">Optimization Recommendations</h4>
            <div className="space-y-1 text-xs text-gray-600">
              {metrics.averageRenderTime > 20 && (
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  Consider enabling render optimization or reducing component complexity
                </div>
              )}
              {realTimeMetrics.memoryPressure > 70 && (
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-3 w-3 text-yellow-500" />
                  High memory usage detected - consider garbage collection
                </div>
              )}
              {cache.size() === 0 && optimizeRenders && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-blue-500" />
                  Cache is empty - performance benefits will increase with usage
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
