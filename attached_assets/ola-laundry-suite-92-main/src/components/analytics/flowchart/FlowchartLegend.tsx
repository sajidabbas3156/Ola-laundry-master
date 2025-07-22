
import { DOMAIN_COLORS } from './types';

export function FlowchartLegend() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {Object.entries(DOMAIN_COLORS).map(([domain, color]) => (
        <div key={domain} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm capitalize">{domain}</span>
        </div>
      ))}
    </div>
  );
}
