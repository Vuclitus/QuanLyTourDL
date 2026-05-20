'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreHorizontal, PieChart as PieChartIcon } from 'lucide-react';

interface TourDistributionProps {
  data: any[];
}

export function TourDistribution({ data }: TourDistributionProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full dark:bg-gray-900 dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <PieChartIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Phân bổ loại tour</h3>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-800 transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      <div className="h-48 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #ffffff)' }}
               wrapperClassName="dark:[--tooltip-bg:#1f2937]"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
