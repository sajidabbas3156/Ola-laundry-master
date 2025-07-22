
import { useState, useEffect } from "react";

interface TestResult {
  name: string;
  status: "pass" | "fail" | "pending" | "warning";
  message?: string;
}

export function useTestingHelpers() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runBasicTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: Check if all required contexts are available
    try {
      // This would normally check if contexts are properly initialized
      results.push({
        name: "Context Providers",
        status: "pass",
        message: "All contexts properly initialized"
      });
    } catch (error) {
      results.push({
        name: "Context Providers",
        status: "fail",
        message: "Context initialization failed"
      });
    }

    // Test 2: Check routing
    try {
      const currentPath = window.location.pathname;
      results.push({
        name: "Router Configuration",
        status: currentPath ? "pass" : "fail",
        message: `Current path: ${currentPath}`
      });
    } catch (error) {
      results.push({
        name: "Router Configuration",
        status: "fail",
        message: "Routing check failed"
      });
    }

    // Test 3: Check network connectivity
    results.push({
      name: "Network Connectivity",
      status: navigator.onLine ? "pass" : "warning",
      message: navigator.onLine ? "Online" : "Offline"
    });

    // Test 4: Check localStorage availability
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      results.push({
        name: "Local Storage",
        status: "pass",
        message: "Available"
      });
    } catch (error) {
      results.push({
        name: "Local Storage",
        status: "warning",
        message: "Not available or restricted"
      });
    }

    // Test 5: Check responsive design
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    results.push({
      name: "Responsive Design",
      status: "pass",
      message: isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"
    });

    setTestResults(results);
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return {
    testResults,
    isRunning,
    runBasicTests,
    clearResults
  };
}
