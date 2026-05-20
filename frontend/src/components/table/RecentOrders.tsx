'use client';

import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { orderService } from '@/services/order.service';
import Link from 'next/link';

export function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await orderService.getAll();
        // Just take the first 5 for dashboard
        setOrders(data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching recent orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white">Đơn hàng gần đây</h3>
        <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Xem tất cả</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider dark:text-gray-500">Khách hàng</th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider dark:text-gray-500">Tour</th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider dark:text-gray-500">Giá</th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider dark:text-gray-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((order) => (
              <tr key={order.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400`}>
                      {order.customer?.full_name?.substring(0, 2).toUpperCase() || 'KH'}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{order.customer?.full_name || 'Khách lẻ'}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{order.tour?.name || 'N/A'}</span>
                </td>
                <td className="py-4">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_price)}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-lg ${
                    order.status === 'confirmed' || order.status === 'Đã xác nhận'
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : order.status === 'pending' || order.status === 'Chờ xử lý'
                      ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {order.status === 'confirmed' ? 'Đã xác nhận' : order.status === 'pending' ? 'Chờ xử lý' : order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400 text-sm italic">Chưa có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
