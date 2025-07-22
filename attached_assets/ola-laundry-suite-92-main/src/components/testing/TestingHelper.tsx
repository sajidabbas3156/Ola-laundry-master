
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, AlertCircle, Clock, WifiOff, TestTube } from "lucide-react";
import { ComprehensiveTestSuite } from "./ComprehensiveTestSuite";

interface TestResult {
  name: string;
  status: "pass" | "fail" | "pending" | "warning";
  message?: string;
}

interface TestingHelperProps {
  onRunTests?: () => void;
  results?: TestResult[];
  isVisible?: boolean;
}

export function TestingHelper({ onRunTests, results = [], isVisible = false }: TestingHelperProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!isVisible && process.env.NODE_ENV === 'production') {
    return null;
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "fail":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: "default",
      fail: "destructive", 
      warning: "secondary",
      pending: "outline"
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Testing Helper</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "−" : "+"}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Button onClick={onRunTests} size="sm" className="w-full">
                Run Basic Tests
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <TestTube className="h-4 w-4 mr-2" />
                    Full Test Suite
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Comprehensive Testing Dashboard</DialogTitle>
                  </DialogHeader>
                  <ComprehensiveTestSuite />
                </DialogContent>
              </Dialog>
              
              {results.length > 0 && (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="truncate">{result.name}</span>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-gray-500 border-t pt-2">
                <p>Network: {navigator.onLine ? "Online" : "Offline"}</p>
                <p>Browser: {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}</p>
                <p>Mobile: {window.innerWidth < 768 ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
