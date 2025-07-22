
import React from 'react';

interface LaundryPosIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'flat' | 'gradient' | 'badge';
  className?: string;
}

export function LaundryPosIcon({ 
  size = 'md', 
  variant = 'gradient',
  className = '' 
}: LaundryPosIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const baseClasses = `${sizeClasses[size]} ${className}`;

  if (variant === 'flat') {
    return (
      <div className={`${baseClasses} bg-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden`}>
        {/* Cash Register Base */}
        <div className="absolute bottom-1 w-10 h-6 bg-blue-400 rounded-t-lg"></div>
        {/* Screen */}
        <div className="absolute top-2 w-6 h-4 bg-blue-600 rounded-sm"></div>
        {/* Hanger */}
        <div className="absolute top-1 right-1 w-3 h-3">
          <div className="w-full h-0.5 bg-green-500 rounded"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-0.5"></div>
        </div>
        {/* Receipt */}
        <div className="absolute bottom-0 right-0 w-2 h-4 bg-white border border-gray-300 rounded-t"></div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center relative shadow-lg`}>
        {/* Main POS Machine */}
        <div className="w-8 h-6 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg relative">
          <div className="w-5 h-3 bg-blue-600 rounded-sm mx-auto mt-1"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
            <span className="text-xs">👕</span>
          </div>
        </div>
        {/* Receipt */}
        <div className="absolute -bottom-1 -right-1 w-3 h-4 bg-white border border-gray-300 rounded-t shadow-sm"></div>
      </div>
    );
  }

  // Default gradient variant
  return (
    <div className={`${baseClasses} bg-gradient-to-br from-blue-400 via-blue-500 to-green-500 rounded-2xl flex items-center justify-center relative shadow-xl overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
      {/* Cash Register */}
      <div className="relative z-10 w-8 h-6 bg-white/90 rounded-lg shadow-sm flex flex-col items-center justify-center">
        {/* Screen */}
        <div className="w-5 h-2 bg-blue-600 rounded-sm mb-1"></div>
        {/* Buttons */}
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
      
      {/* Clothes Hanger */}
      <div className="absolute top-1 right-2 z-10">
        <div className="w-4 h-0.5 bg-white/80 rounded-full"></div>
        <div className="w-2 h-2 bg-white/80 rounded-full mx-auto mt-0.5 relative">
          <span className="absolute inset-0 flex items-center justify-center text-xs">👕</span>
        </div>
      </div>
      
      {/* Receipt */}
      <div className="absolute bottom-0 left-1 z-10 w-3 h-5 bg-white/90 rounded-t shadow-sm">
        <div className="w-full h-0.5 bg-green-400 rounded-t"></div>
        <div className="px-0.5 py-1 space-y-0.5">
          <div className="w-2 h-0.5 bg-gray-300 rounded"></div>
          <div className="w-1.5 h-0.5 bg-gray-300 rounded"></div>
          <div className="w-2 h-0.5 bg-gray-300 rounded"></div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
      <div className="absolute bottom-2 right-1 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-1000"></div>
    </div>
  );
}
