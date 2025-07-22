
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge: string | null;
}

interface NavigationSectionProps {
  title: string;
  items: NavigationItem[];
  onLinkClick: () => void;
}

export function NavigationSection({ title, items, onLinkClick }: NavigationSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <item.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
            <span className="font-medium text-gray-700 group-hover:text-gray-900 flex-1">
              {item.label}
            </span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
