'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Trash2,
  Edit,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { OrderFormModal } from './OrderFormModal';
import { orderService } from '@/services/order.service';

const STATUS_LABELS: Record<string, string> = {
  'pending': 'Chờ xử lý',
  'confirmed': 'Đã thanh toán',
  'cancelled': 'Đã hủy',
  'refunded': 'Hoàn tiền'
};

const STATUS_STYLES: Record<string, string> = {
  'confirmed': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30',
  'pending': 'bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-900/30',
  'cancelled': 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30',
  'refunded': 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
};

const STATUS_ICONS: Record<string, any> = {
  'confirmed': CheckCircle2,
  'pending': Clock,
  'cancelled': XCircle,
  'refunded': RefreshCcw
};

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      try {
        await orderService.delete(id);
        setOrders(orders.filter(o => o.id !== id));
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa đơn hàng.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Danh sách Đơn hàng</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Quản lý và theo dõi các giao dịch đặt chỗ của khách hàng.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tạo đơn mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4 dark:bg-gray-900 dark:border-gray-800 transition-colors">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Tên khách hàng..."
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
            <AlertCircle className="w-10 h-10" />
            <p>{error}</p>
            <button onClick={fetchOrders} className="text-blue-600 hover:underline">Thử lại</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Mã đơn</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Khách hàng</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Tour / Dịch vụ</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Tổng tiền</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] text-center">Trạng thái</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-500">Không có đơn hàng nào</td></tr>
                ) : (
                  orders.map((order) => {
                    const status = order.status || 'pending';
                    const StatusIcon = STATUS_ICONS[status] || Clock;
                    return (
                      <tr key={order.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                        <td className="py-4 px-6">
                          <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
                            #{order.id}
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {order.customer?.user?.full_name || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600 font-medium dark:text-gray-400">
                            {order.tour?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {Number(order.total_price).toLocaleString('vi-VN')}₫
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {STATUS_LABELS[status]}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link 
                              href={`/admin/orders/${order.id}`} 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(order.id)} 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                              title="Xóa đơn hàng"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <OrderFormModal 
          order={selectedOrder} 
          onClose={() => { setIsModalOpen(false); fetchOrders(); }} 
        />
      )}
    </div>
  );
}
