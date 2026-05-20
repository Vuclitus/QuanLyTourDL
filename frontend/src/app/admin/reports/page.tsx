'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Calendar, 
  ChevronDown, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  PieChart as PieChartIcon,
  RefreshCw,
  MoreVertical,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ReportDownloadModal } from './ReportDownloadModal';
import { reportService } from '@/services/report.service';

export default function ReportsPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ start: '', end: '' });
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [downloading, setDownloading] = React.useState(false);
  const [stats, setStats] = React.useState<any>(null);
  const [revenueData, setRevenueData] = React.useState<any[]>([]);
  const [categoryData, setCategoryData] = React.useState<any[]>([]);
  const [ordersData, setOrdersData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (filters: any = {}) => {
    try {
      setLoading(true);
      const [statsRes, revenueRes, categoryRes, ordersRes] = await Promise.all([
        reportService.getDashboardStats(filters),
        reportService.getRevenueChart(filters),
        reportService.getCategoryDistribution(filters),
        reportService.getOrdersChart(filters)
      ]);
      
      setStats(statsRes);
      setRevenueData(revenueRes);
      setCategoryData(categoryRes);
      setOrdersData(ordersRes);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Không thể tải dữ liệu báo cáo.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchReports({
      start_date: dateRange.start,
      end_date: dateRange.end,
      category: selectedCategory
    });
  };

  const handleReset = () => {
    setDateRange({ start: '', end: '' });
    setSelectedCategory('');
    fetchReports();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Đang xử lý dữ liệu hệ thống...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-red-500">
        <AlertCircle className="w-12 h-12" />
        <p className="font-bold">{error}</p>
        <button onClick={fetchReports} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg">Thử lại</button>
      </div>
    );
  }

  const summaryCards = [
    { ...stats?.revenue, icon: DollarSign, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', up: true },
    { ...stats?.orders, icon: ShoppingBag, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20', up: true },
    { ...stats?.customers, icon: Users, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', up: true },
    { ...stats?.fill_rate, icon: PieChartIcon, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', up: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight transition-colors">Báo cáo hệ thống</h1>
          <p className="text-gray-400 text-sm mt-1 font-bold uppercase tracking-widest dark:text-gray-500">Phân tích dữ liệu vận hành & doanh thu</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchReports()}
            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-gray-100 bg-white shadow-sm active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-blue-400"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-2xl hover:bg-blue-900 transition-all text-sm font-black shadow-xl shadow-blue-900/20 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <TrendingUp className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {isDownloadModalOpen && (
        <ReportDownloadModal onClose={() => setIsDownloadModalOpen(false)} />
      )}

      {/* Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6 dark:bg-gray-900/80 dark:border-gray-800 transition-colors">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">THỜI GIAN</label>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors dark:text-gray-600 dark:group-hover:text-blue-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm transition-all w-44 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-600"
              />
            </div>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors dark:text-gray-600 dark:group-hover:text-blue-400" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm transition-all w-44 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 flex-1 min-w-[200px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">LOẠI TOUR</label>
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm transition-all bg-white cursor-pointer appearance-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            >
              <option value="">Tất cả loại tour</option>
              <option value="Nghỉ dưỡng">Nghỉ dưỡng</option>
              <option value="Khám phá">Khám phá</option>
              <option value="Mạo hiểm">Mạo hiểm</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none dark:text-gray-600" />
          </div>
        </div>

        <div className="flex items-center gap-2 pb-0.5">
          <button onClick={handleReset} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all dark:text-gray-500 dark:hover:text-gray-300">Reset</button>
          <button onClick={handleApplyFilters} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">Áp dụng</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between relative z-10">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 px-2 py-1 rounded-lg ${stat.up ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                {stat.up ? '↗' : '↘'} {stat.change}
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 mt-4 tracking-widest dark:text-gray-500">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1 dark:text-white transition-colors">
               {typeof stat.value === 'number' && stat.label.includes('DOANH THU') 
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stat.value)
                : stat.value
              }
            </h3>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity dark:opacity-[0.02] dark:group-hover:opacity-[0.05]">
              <stat.icon className="w-24 h-24 dark:text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 dark:text-white">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Biểu đồ Doanh thu
            </h3>
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  </linearGradient>
                  <linearGradient id="colorHighlight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-gray-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} 
                  tickFormatter={(val) => `${val/1000000}M`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', backgroundColor: 'var(--tooltip-bg, #ffffff)' }}
                  wrapperClassName="dark:[--tooltip-bg:#1f2937]"
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#colorValue)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                  activeBar={<Bar dataKey="value" fill="url(#colorHighlight)" radius={[6, 6, 0, 0]} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tour Type Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 dark:text-white">
              <PieChartIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Phân bổ loại tour
            </h3>
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-60 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #ffffff)' }}
                   wrapperClassName="dark:[--tooltip-bg:#1f2937]"
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest dark:text-gray-500">TỔNG CỘNG</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">100%</p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-xs font-black text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Area Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 dark:text-white">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Số đơn hàng theo tháng
            </h3>
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-gray-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                   hide
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #ffffff)' }}
                   wrapperClassName="dark:[--tooltip-bg:#1f2937]"
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
