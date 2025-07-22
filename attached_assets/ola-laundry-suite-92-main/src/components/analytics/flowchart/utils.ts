
import { FlowNode, DOMAIN_COLORS } from './types';

export const getNodeShape = (type: string) => {
  switch (type) {
    case "start": return { start: "([", end: "])" };
    case "decision": return { start: "{", end: "}" };
    case "error": return { start: "[(", end: ")]" };
    case "end": return { start: "((", end: "))" };
    default: return { start: "[", end: "]" };
  }
};

export const generateMermaidDiagram = (
  nodes: FlowNode[],
  showErrorPaths: boolean,
  showBackwardPaths: boolean
): string => {
  let diagram = "graph TD\n";
  
  nodes.forEach(node => {
    const nodeShape = getNodeShape(node.type);
    diagram += `    ${node.id}${nodeShape.start}"${node.label}"${nodeShape.end}\n`;
    diagram += `    ${node.id} --> ${node.id}:::${node.domain}\n`;
    
    // Forward connections
    node.connections.forEach(connection => {
      if (nodes.find(n => n.id === connection)) {
        diagram += `    ${node.id} --> ${connection}\n`;
      }
    });
    
    // Backward connections
    if (showBackwardPaths && node.backwardConnections) {
      node.backwardConnections.forEach(connection => {
        if (nodes.find(n => n.id === connection)) {
          diagram += `    ${connection} -.-> ${node.id}\n`;
        }
      });
    }
    
    // Error paths
    if (showErrorPaths && node.errorPaths) {
      node.errorPaths.forEach(errorPath => {
        if (nodes.find(n => n.id === errorPath)) {
          diagram += `    ${node.id} -->|Error| ${errorPath}\n`;
        }
      });
    }
  });
  
  // Add class definitions
  Object.entries(DOMAIN_COLORS).forEach(([domain, color]) => {
    diagram += `    classDef ${domain} fill:${color},stroke:#333,stroke-width:2px,color:#fff\n`;
  });
  
  return diagram;
};
