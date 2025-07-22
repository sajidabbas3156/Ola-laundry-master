
import { generateMermaidDiagram } from './utils';
import { FlowNode } from './types';

interface FlowchartDiagramProps {
  nodes: FlowNode[];
  showErrorPaths: boolean;
  showBackwardPaths: boolean;
}

export function FlowchartDiagram({ nodes, showErrorPaths, showBackwardPaths }: FlowchartDiagramProps) {
  const diagram = generateMermaidDiagram(nodes, showErrorPaths, showBackwardPaths);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <pre className="text-xs overflow-x-auto">
        {diagram}
      </pre>
    </div>
  );
}
