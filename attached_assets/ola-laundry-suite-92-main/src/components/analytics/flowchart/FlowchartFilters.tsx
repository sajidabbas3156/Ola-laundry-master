
import { Button } from "@/components/ui/button";
import { DOMAIN_COLORS } from './types';

interface FlowchartFiltersProps {
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
  showErrorPaths: boolean;
  onErrorPathsChange: (show: boolean) => void;
  showBackwardPaths: boolean;
  onBackwardPathsChange: (show: boolean) => void;
}

export function FlowchartFilters({
  selectedDomain,
  onDomainChange,
  showErrorPaths,
  onErrorPathsChange,
  showBackwardPaths,
  onBackwardPathsChange
}: FlowchartFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Domain Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDomain === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onDomainChange("all")}
        >
          All Domains
        </Button>
        {Object.entries(DOMAIN_COLORS).map(([domain, color]) => (
          <Button
            key={domain}
            variant={selectedDomain === domain ? "default" : "outline"}
            size="sm"
            onClick={() => onDomainChange(domain)}
            style={{ backgroundColor: selectedDomain === domain ? color : undefined }}
          >
            {domain.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Toggle Options */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showErrorPaths}
            onChange={(e) => onErrorPathsChange(e.target.checked)}
          />
          Show Error Paths
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showBackwardPaths}
            onChange={(e) => onBackwardPathsChange(e.target.checked)}
          />
          Show Backward Navigation
        </label>
      </div>
    </div>
  );
}
