
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemIconProps {
  item?: {
    name: string;
    category: string;
    image?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-6 w-6",
  md: "h-8 w-8", 
  lg: "h-12 w-12"
};

const containerSizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16"
};

export function ItemIcon({ item, size = "md", className }: ItemIconProps) {
  if (item?.image) {
    return (
      <div className={cn(containerSizeMap[size], "rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center", className)}>
        <img 
          src={item.image} 
          alt={item.name}
          className={cn(containerSizeMap[size], "object-cover")}
        />
      </div>
    );
  }

  return (
    <div className={cn(containerSizeMap[size], "rounded-lg bg-gray-100 flex items-center justify-center", className)}>
      <Package className={cn(sizeMap[size], "text-gray-500")} />
    </div>
  );
}
