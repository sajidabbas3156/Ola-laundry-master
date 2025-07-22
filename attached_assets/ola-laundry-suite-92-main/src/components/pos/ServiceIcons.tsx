
import { Package, Sparkles, Shirt, Wind, Droplets, Clock } from "lucide-react";

export const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  
  if (name.includes('wash') || name.includes('clean')) {
    return <Droplets className="h-5 w-5" />;
  }
  if (name.includes('dry') || name.includes('express')) {
    return <Wind className="h-5 w-5" />;
  }
  if (name.includes('iron') || name.includes('press')) {
    return <Shirt className="h-5 w-5" />;
  }
  if (name.includes('premium') || name.includes('deluxe')) {
    return <Sparkles className="h-5 w-5" />;
  }
  if (name.includes('standard') || name.includes('regular')) {
    return <Package className="h-5 w-5" />;
  }
  
  return <Clock className="h-5 w-5" />;
};

export const getItemIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'washing':
      return '👕';
    case 'drying':
      return '🌪️';
    case 'ironing':
      return '👔';
    case 'dry cleaning':
      return '✨';
    case 'folding':
      return '📦';
    case 'shirts':
      return '👔';
    case 'pants':
      return '👖';
    case 'dresses':
      return '👗';
    case 'suits':
      return '🤵';
    case 'bedding':
      return '🛏️';
    case 'curtains':
      return '🪟';
    default:
      return '🧽';
  }
};
