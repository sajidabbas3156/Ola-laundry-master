
import { useState, useRef, useEffect } from 'react';
import { Search, Clock, FileText, Users, Package, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useNavigate } from 'react-router-dom';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const { searchResults, performSearch, isSearching } = useGlobalSearch();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <FileText className="h-4 w-4" />;
      case 'customer': return <Users className="h-4 w-4" />;
      case 'product': return <Package className="h-4 w-4" />;
      case 'integration': return <Zap className="h-4 w-4" />;
      case 'campaign': return <Clock className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search everything...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search orders, customers, drivers..." 
          onValueChange={performSearch}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? 'Searching...' : 'No results found.'}
          </CommandEmpty>
          <CommandGroup heading="Results">
            {searchResults.map((result) => (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => {
                  navigate(result.route);
                  setOpen(false);
                }}
              >
                {getIcon(result.type)}
                <div className="ml-2">
                  <p className="text-sm font-medium">{result.title}</p>
                  <p className="text-xs text-muted-foreground">{result.description}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
