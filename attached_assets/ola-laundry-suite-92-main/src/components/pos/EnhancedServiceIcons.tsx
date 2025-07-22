
import React from 'react';

export const getEnhancedServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  
  if (name.includes('wash') || name.includes('clean')) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-lg">🧺</span>
      </div>
    );
  }
  if (name.includes('dry') || name.includes('express')) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-lg">🌪️</span>
      </div>
    );
  }
  if (name.includes('iron') || name.includes('press')) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-lg">👔</span>
      </div>
    );
  }
  if (name.includes('premium') || name.includes('deluxe')) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-lg">✨</span>
      </div>
    );
  }
  if (name.includes('standard') || name.includes('regular')) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-lg">📦</span>
      </div>
    );
  }
  
  return (
    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
      <span className="text-white text-lg">⏰</span>
    </div>
  );
};

export const getEnhancedItemIcon = (category: string) => {
  const categoryLower = category.toLowerCase();
  
  const iconMap = {
    'washing': (
      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">🧺</span>
      </div>
    ),
    'drying': (
      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">🌪️</span>
      </div>
    ),
    'ironing': (
      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">👔</span>
      </div>
    ),
    'dry cleaning': (
      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">✨</span>
      </div>
    ),
    'folding': (
      <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">📦</span>
      </div>
    ),
    'shirts': (
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">👔</span>
      </div>
    ),
    'pants': (
      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">👖</span>
      </div>
    ),
    'dresses': (
      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">👗</span>
      </div>
    ),
    'suits': (
      <div className="w-12 h-12 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">🤵</span>
      </div>
    ),
    'bedding': (
      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">🛏️</span>
      </div>
    ),
    'curtains': (
      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-2xl">🪟</span>
      </div>
    )
  };

  return iconMap[categoryLower] || (
    <div className="w-12 h-12 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
      <span className="text-2xl">🧽</span>
    </div>
  );
};
