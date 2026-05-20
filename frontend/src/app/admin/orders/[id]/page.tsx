'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  FileText, 
  RefreshCcw,
  Settings,
  Download,
  Edit2,
  Package,
  Info,
  Loader2,
  Tag,
  AlertCircle
} from 'lucide-react';
import { OrderFormModal } from '../OrderFormModal';
import { orderService } from '@/services/order.service';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getById(Number(orderId));
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Không thể tải thông tin đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-10 rounded-[2rem] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-black text-red-900 dark:text-red-400">{error || 'Không tìm thấy đơn hàng'}</h3>
        <Link href="/admin/orders" className="inline-block px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const statusMap: any = {
    'pending': { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30' },
    'confirmed': { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' },
    'cancelled': { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' },
    'completed': { label: 'Hoàn thành', color: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' }
  };

  const paymentStatusMap: any = {
    'unpaid': { label: 'Chưa thanh toán', color: 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
    'paid': { label: 'Đã thanh toán', color: 'bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-900/30' },
    'partially_paid': { label: 'Thanh toán một phần', color: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30' }
  };

  const currentStatus = statusMap[order.status] || statusMap['pending'];
  const currentPaymentStatus = paymentStatusMap[order.payment_status] || paymentStatusMap['unpaid'];
  
  const customerInitials = order.customer?.user?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'KH';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-2 transition-colors">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
          <Link href="/admin/orders" className="hover:text-blue-600 transition-colors uppercase tracking-wider dark:hover:text-blue-400">Quản lý Đơn hàng</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-blue-600 uppercase tracking-wider dark:text-blue-400">{orderId}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight dark:text-white transition-colors">Chi tiết Đơn hàng #{order.id}</h1>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${currentStatus.color}`}>
                <CheckCircle2 className="w-3 h-3" />
                {currentStatus.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${currentPaymentStatus.color}`}>
                <CreditCard className="w-3 h-3" />
                {currentPaymentStatus.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 dark:text-white transition-colors">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Thông tin Đơn hàng
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-transparent hover:border-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-900/50"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Chỉnh sửa
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tour Package */}
              <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:border-blue-200 transition-all dark:bg-gray-800/50 dark:border-gray-800 dark:hover:border-blue-500/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 dark:text-gray-500">Gói Tour</p>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm dark:text-gray-200 transition-colors">{order.tour?.name || 'Tour đã bị xóa'}</h4>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {order.tour?.start_date ? new Date(order.tour.start_date).toLocaleDateString('vi-VN') : 'Chưa định ngày'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {order.tour?.duration || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:border-blue-200 transition-all dark:bg-gray-800/50 dark:border-gray-800 dark:hover:border-blue-500/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 dark:text-gray-500">Khách hàng</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md dark:border-gray-800">
                    {customerInitials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 text-sm dark:text-gray-200 transition-colors">{order.customer?.user?.full_name || 'Khách vãng lai'}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase dark:bg-blue-900/20 dark:text-blue-400">{order.customer?.rank || 'Silver'} Member</span>
                    </div>
                    <div className="space-y-0.5 mt-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 dark:text-gray-400 transition-colors"><Mail className="w-3 h-3" /> {order.customer?.user?.email || 'N/A'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 dark:text-gray-400 transition-colors"><Phone className="w-3 h-3" /> {order.customer?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 dark:text-white transition-colors">
              <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Tiến trình Xử lý
            </h3>
            
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800 transition-colors">
              {[
                { title: 'Khách hàng đặt đơn', desc: `Đơn hàng được tạo cho khách ${order.customer?.user?.full_name}`, time: new Date(order.created_at).toLocaleString('vi-VN'), active: true, done: true },
                { title: 'Trạng thái xử lý', desc: `Hiện tại đơn hàng đang ở trạng thái: ${currentStatus.label}`, time: new Date(order.updated_at).toLocaleString('vi-VN'), active: true, done: order.status !== 'pending' },
                { title: 'Thanh toán', desc: order.payment_status === 'paid' ? 'Đã nhận đủ thanh toán' : 'Đang chờ thanh toán', time: order.payment_status === 'paid' ? new Date(order.updated_at).toLocaleString('vi-VN') : '---', active: order.payment_status === 'paid', done: order.payment_status === 'paid' },
                { title: 'Ghi chú đơn hàng', desc: order.notes || 'Không có ghi chú đặc biệt', time: '', active: !!order.notes, done: !!order.notes },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[27px] top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-colors dark:border-gray-900 ${
                    step.done ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-800'
                  }`}>
                    {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className={`text-sm font-bold transition-colors ${step.active ? 'text-gray-900 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'}`}>{step.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium dark:text-gray-400 transition-colors">{step.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-500 transition-colors">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Actions */}
        <div className="space-y-6">
          {/* Payment Detail Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 dark:text-white transition-colors">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Chi tiết Thanh toán
            </h3>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium dark:text-gray-400 transition-colors">Đơn giá (x{order.quantity} Khách)</span>
                <span className="text-gray-900 font-bold dark:text-gray-200 transition-colors">{order.tour?.price?.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium dark:text-gray-400 transition-colors">Phụ phí / Dịch vụ thêm</span>
                <span className="text-gray-900 font-bold dark:text-gray-200 transition-colors">0 VNĐ</span>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest dark:text-gray-500">Tổng cộng</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{order.total_price?.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-4 relative overflow-hidden group dark:bg-blue-900/10 dark:border-blue-900/30 transition-colors">
                  <div className="absolute top-0 right-0 p-1">
                    {order.payment_status === 'paid' && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform dark:bg-gray-800 dark:border-gray-700">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-gray-200 transition-colors uppercase tracking-tight">
                      {order.payment_method === 'transfer' ? 'Chuyển khoản ngân hàng' : order.payment_method === 'cash' ? 'Tiền mặt' : 'Thẻ tín dụng'}
                    </h5>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5 uppercase tracking-tighter dark:text-gray-500 transition-colors">
                      {order.payment_status === 'paid' ? 'Giao dịch đã hoàn tất' : 'Đang chờ xử lý thanh toán'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-700">
                <CheckCircle2 className="w-4 h-4" />
                Đánh dấu Hoàn tất Cấu hình
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  Xuất Hóa Đơn
                </button>
                <button className="py-2.5 bg-white border border-gray-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-red-400 dark:hover:bg-red-900/30">
                  <RefreshCcw className="w-3.5 h-3.5" />
                  Hoàn Tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <OrderFormModal 
          order={order} 
          onClose={() => {
            setIsEditModalOpen(false);
            // Optional: Re-fetch or update local state
          }} 
        />
      )}
    </div>
  );
}

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const History = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
  </svg>
);
