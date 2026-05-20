import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-50 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-black text-gray-900 tracking-tight animate-pulse">LuxeVoyage</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Đang tải trải nghiệm của bạn...</p>
      </div>
    </div>
  );
}
