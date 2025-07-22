import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, X, Calendar as CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";

interface FilterOption {
  key: string;
  label: string;
  type: "select" | "date" | "range";
  options?: { value: string; label: string }[];
}

interface SearchFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  activeFilters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onExport?: () => void;
  showExport?: boolean;
}

export function SearchFilter({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  activeFilters,
  onFilterChange,
  onClearFilters,
  onExport,
  showExport = false,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const renderFilterInput = (filter: FilterOption) => {
    const value = activeFilters[filter.key];

    switch (filter.type) {
      case "select":
        return (
          <Select value={value || ""} onValueChange={(val) => onFilterChange(filter.key, val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {filter.label}</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : `Select ${filter.label}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onFilterChange(filter.key, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "range":
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={value?.min || ""}
              onChange={(e) => onFilterChange(filter.key, { ...value, min: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Max"
              value={value?.max || ""}
              onChange={(e) => onFilterChange(filter.key, { ...value, max: e.target.value })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and main controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {showExport && onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Object.entries(activeFilters)
            .filter(([_, value]) => value)
            .map(([key, value]) => {
              const filter = filters.find(f => f.key === key);
              const displayValue = typeof value === 'object' && value !== null
                ? `${value.min || ''}-${value.max || ''}`
                : value;
              
              return (
                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                  {filter?.label}: {displayValue}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => onFilterChange(key, null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Filter inputs */}
      {showFilters && filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {filter.label}
              </label>
              {renderFilterInput(filter)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}