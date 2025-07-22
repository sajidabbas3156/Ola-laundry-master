
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import { WORKFLOW_NODES } from './flowchart/types';
import { FlowchartFilters } from './flowchart/FlowchartFilters';
import { FlowchartLegend } from './flowchart/FlowchartLegend';
import { FlowchartDiagram } from './flowchart/FlowchartDiagram';

export function EnhancedFlowchartVisualization() {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [showErrorPaths, setShowErrorPaths] = useState(true);
  const [showBackwardPaths, setShowBackwardPaths] = useState(true);

  const filteredNodes = selectedDomain === "all" 
    ? WORKFLOW_NODES 
    : WORKFLOW_NODES.filter(node => node.domain === selectedDomain);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Enhanced Workflow Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FlowchartFilters
              selectedDomain={selectedDomain}
              onDomainChange={setSelectedDomain}
              showErrorPaths={showErrorPaths}
              onErrorPathsChange={setShowErrorPaths}
              showBackwardPaths={showBackwardPaths}
              onBackwardPathsChange={setShowBackwardPaths}
            />

            <FlowchartLegend />

            <FlowchartDiagram
              nodes={filteredNodes}
              showErrorPaths={showErrorPaths}
              showBackwardPaths={showBackwardPaths}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
