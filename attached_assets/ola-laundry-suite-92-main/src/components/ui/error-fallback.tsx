
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  message?: string;
}

export function ErrorFallback({ error, resetError, message }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {message || "An unexpected error occurred. Please try refreshing the page."}
          </p>
          
          {error && process.env.NODE_ENV === 'development' && (
            <div className="text-left bg-gray-100 p-3 rounded-md text-sm text-gray-800 overflow-auto max-h-32">
              <pre>{error.stack}</pre>
            </div>
          )}
          
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
            {resetError && (
              <Button onClick={resetError}>
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
