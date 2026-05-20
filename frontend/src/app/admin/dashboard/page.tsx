'use client';

import React, { useState, useEffect } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { TourDistribution } from '@/components/charts/TourDistribution';
import { RecentOrders } from '@/components/table/RecentOrders';
import { FeaturedTours } from '@/components/ui/FeaturedTours';
import { Calendar, SlidersHorizontal, Flag, Wallet, Users, ShoppingCart, Loader2 } from 'lucide-react';
import { reportService } from '@/services/report.service';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [featuredTours, setFeaturedTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, revenueData, categoryData, featuredData] = await Promise.all([
          reportService.getDashboardStats(),
          reportService.getRevenueChart(),
          reportService.getCategoryDistribution(),
          reportService.getFeaturedTours()
        ]);
        setStats(statsData);
        setRevenueData(revenueData);
        setCategoryData(categoryData);
        setFeaturedTours(featuredData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tổng quan hệ thống</h1>
          <p className="text-gray-500 dark:text-gray-400">Hiệu suất kinh doanh thời gian thực</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Wallet}
          label="Tổng doanh thu"
          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.revenue?.value || 0)}
          trend={stats?.revenue?.change}
          trendUp={true}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={Flag}
          label="Số lượng tour"
          value={`${stats?.revenue?.value ? 12 : 0}`} // Converted to string to match prop type
          trend="+3 mới"
          trendLabel="Tháng này"
          iconBg="bg-indigo-50 dark:bg-indigo-900/20"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          icon={ShoppingCart}
          label="Tổng đơn hàng"
          value={stats?.orders?.value || 0}
          trend={stats?.orders?.change}
          iconBg="bg-purple-50 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={Users}
          label="Số khách hàng"
          value={stats?.customers?.value || 0}
          trend={stats?.customers?.change}
          trendUp={true}
          trendLabel="Tuần này"
          iconBg="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <TourDistribution data={categoryData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-6">
        <div className="lg:col-span-3">
          <RecentOrders />
        </div>
        <div className="lg:col-span-2">
          <FeaturedTours data={featuredTours} />
        </div>
      </div>
    </div>
  );
}
