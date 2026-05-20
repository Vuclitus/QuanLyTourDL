import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  trendLabel?: string;
  iconBg: string;
  iconColor: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  trendLabel,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center dark:opacity-80`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trendUp 
              ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {trendUp ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}
          </div>
        )}
        {trendLabel && !trend && (
          <span className="text-xs text-gray-400 dark:text-gray-500">{trendLabel}</span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
