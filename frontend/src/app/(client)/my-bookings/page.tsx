'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Loader2,
  AlertCircle,
  Search
} from 'lucide-react';
import { orderService } from '@/services/order.service';
import { toast } from 'react-hot-toast';

export default function MyBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'history'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải danh sách chuyến đi.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = order.tour?.start_date ? new Date(order.tour.start_date) : null;
    
    const isPast = startDate ? startDate < today : false;
    const isCancelled = order.status === 'cancelled';
    
    if (activeTab === 'ongoing') {
      return !isPast && !isCancelled;
    } else {
      return isPast || isCancelled;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Đã thanh toán', color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' };
      case 'pending':
        return { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30' };
      case 'cancelled':
        return { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' };
      case 'completed':
        return { label: 'Hoàn thành', color: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' };
      default:
        return { label: status, color: 'bg-gray-50 text-gray-600 border-gray-100' };
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Đã thanh toán', color: 'text-cyan-600' };
      case 'unpaid':
        return { label: 'Chưa thanh toán', color: 'text-gray-400' };
      default:
        return { label: status, color: 'text-gray-500' };
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy chuyến đi này?')) return;

    try {
      await orderService.update(orderId, { status: 'cancelled' });
      toast.success('Đã hủy chuyến đi thành công.');
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Không thể hủy chuyến đi lúc này.');
    }
  };

  const handlePay = async (orderId: number) => {
    try {
      setLoading(true);
      await orderService.pay(orderId);
      toast.success('Thanh toán thành công! Chuyến đi của bạn đã được xác nhận.');
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error: any) {
      console.error('Error paying order:', error);
      toast.error(error.response?.data?.detail || 'Không thể thực hiện thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Chuyến đi của tôi</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Quản lý và theo dõi hành trình khám phá của bạn</p>
          </div>
          <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-blue-600'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setActiveTab('ongoing')}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'ongoing' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-blue-600'}`}
            >
              Đang diễn ra
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-blue-600'}`}
            >
              Lịch sử
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-20 text-center space-y-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50">
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Không có chuyến đi nào</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {activeTab === 'all' ? 'Hãy bắt đầu hành trình của bạn bằng cách khám phá những địa điểm tuyệt vời nhất.' :
                 activeTab === 'ongoing' ? 'Bạn hiện không có chuyến đi nào sắp khởi hành.' :
                 'Bạn chưa có lịch sử chuyến đi nào.'}
              </p>
            </div>
            {activeTab === 'all' && (
              <Link 
                href="/tours" 
                className="inline-block px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
              >
                Khám phá Tours ngay
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map((order) => {
              const status = getStatusBadge(order.status);
              const payStatus = getPaymentStatusBadge(order.payment_status);
              return (
                <div key={order.id} className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col md:flex-row">
                  {/* Tour Image */}
                  <div className="md:w-72 h-52 md:h-auto relative overflow-hidden">
                    <img 
                      src={order.tour?.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800"} 
                      alt={order.tour?.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Mã đơn: #{order.id}</p>
                          <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                            {order.tour?.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-gray-900 dark:text-white">
                            {Number(order.total_price).toLocaleString('vi-VN')}₫
                          </p>
                          <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${payStatus.color}`}>
                            {payStatus.label}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Calendar className="w-3 h-3" /> Ngày đi</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-200">
                            {order.tour?.start_date ? new Date(order.tour.start_date).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Clock className="w-3 h-3" /> Thời lượng</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-200">{order.tour?.duration || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Package className="w-3 h-3" /> Số lượng</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-200">{order.quantity} người</p>
                        </div>
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><CreditCard className="w-3 h-3" /> Thanh toán</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-200 uppercase tracking-tight">{order.payment_method === 'transfer' ? 'Chuyển khoản' : order.payment_method === 'cash' ? 'Tiền mặt' : 'Thẻ'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'confirmed' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                            {order.status === 'confirmed' ? 'Hệ thống đã xác nhận đơn hàng của bạn' : 
                             order.status === 'cancelled' ? 'Đơn hàng này đã bị hủy' :
                             'Vui lòng chờ nhân viên liên hệ xác nhận'}
                          </p>
                        </div>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleCancel(order.id)}
                            className="text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest px-4 py-2 bg-red-50 dark:bg-red-900/10 rounded-xl transition-all"
                          >
                            Hủy chuyến
                          </button>
                        )}
                        {order.status === 'pending' && order.payment_status === 'unpaid' && (
                          <button 
                            onClick={() => handlePay(order.id)}
                            disabled={loading}
                            className="text-xs font-black text-white bg-blue-600 hover:bg-blue-700 uppercase tracking-widest px-6 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                          >
                            Thanh toán ngay
                          </button>
                        )}
                      </div>
                      <Link 
                        href={`/tour-detail/${order.tour_id}`}
                        className="flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400 hover:gap-3 transition-all uppercase tracking-widest"
                      >
                        Xem chi tiết tour
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
