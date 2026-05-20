'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  User,
  Edit3,
  Headset,
  Palmtree,
  Sparkles,
  Utensils,
  Sailboat,
  FileText,
  Megaphone,
  ArrowRight,
  Filter,
  Loader2,
  AlertCircle,
  ExternalLink,
  Download,
  Info
} from 'lucide-react';
import { SupplierFormModal } from '../SupplierFormModal';
import { supplierService } from '@/services/supplier.service';
import Image from 'next/image';

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: supplierId } = use(params);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [supplier, setSupplier] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [supplierData, bookingsData] = await Promise.all([
          supplierService.getSupplierById(Number(supplierId)),
          supplierService.getBookings(Number(supplierId))
        ]);
        setSupplier(supplierData);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Error fetching supplier data:', err);
        setError('Không thể tải thông tin nhà cung cấp.');
      } finally {
        setLoading(false);
      }
    };

    if (supplierId) {
      fetchData();
    }
  }, [supplierId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 dark:bg-gray-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-black animate-pulse uppercase tracking-widest text-xs">Đang tải hồ sơ nhà cung cấp...</p>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 dark:bg-gray-950 p-10">
        <AlertCircle className="w-20 h-20 text-red-500" />
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">{error || 'Không tìm thấy nhà cung cấp'}</h2>
        <Link href="/admin/suppliers" className="px-10 py-4 bg-blue-600 text-white rounded-full font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-600/30">
          Quay lại danh sách
        </Link>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 pb-20 animate-in fade-in duration-500 transition-colors">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800 transition-colors">
        <div className="flex items-center gap-4">
          <Link href="/admin/suppliers" className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </Link>
          <h1 className="text-xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight transition-colors">Nhà cung cấp</h1>
        </div>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-100 rounded-full text-sm font-black text-gray-700 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/50 dark:hover:text-blue-400"
        >
          <Edit3 className="w-4 h-4" />
          Sửa đổi
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-8 space-y-8">
        {/* Hero Section */}
        <div className="relative h-[500px] rounded-[48px] overflow-hidden shadow-2xl shadow-blue-900/10 group bg-gray-100 dark:bg-gray-800">
          {supplier.image_url ? (
            <Image 
              src={supplier.image_url} 
              alt={supplier.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
              <Palmtree className="w-20 h-20" />
              <span className="font-black uppercase tracking-widest text-xs">Chưa có ảnh poster</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 text-white text-[10px] font-black rounded-full tracking-widest uppercase shadow-lg ${
                  supplier.status === 'Đang hoạt động' ? 'bg-green-600 shadow-green-600/40' : 'bg-red-600 shadow-red-600/40'
                }`}>
                  {supplier.status}
                </span>
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-full tracking-widest uppercase border border-white/20">
                  {supplier.service_type}
                </span>
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                {supplier.name}
              </h2>
              <div className="flex items-center gap-2 text-white/80 font-bold">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-sm">{supplier.address}</span>
              </div>
            </div>
            
            <button className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-full font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/40 active:scale-95">
              <Headset className="w-5 h-5" />
              Liên hệ ngay
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Contact Info Card */}
            <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-10 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
              <h3 className="text-2xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight">Thông tin liên hệ</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">NGƯỜI ĐẠI DIỆN</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white transition-colors">{supplier.contact_person || 'N/A'}</p>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">Đại diện pháp luật</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-sm">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">ĐIỆN THOẠI</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white transition-colors">{supplier.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">EMAIL</p>
                    <p className="text-sm font-black text-gray-900 break-all dark:text-white transition-colors">{supplier.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Content */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight transition-colors">Hợp đồng & Ghi chú</h3>
              </div>
              
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Info className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white">Ghi chú dịch vụ</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {supplier.notes || 'Chưa có ghi chú dịch vụ cho nhà cung cấp này.'}
                </p>
              </div>

              {supplier.contract_url && (
                <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white transition-colors">Bản scan Hợp đồng</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 dark:text-gray-500">
                          Kích thước: {(supplier.contract_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <a 
                      href={supplier.contract_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      Tải về / Xem
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* History Table */}
            <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
              <div className="p-10 flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight transition-colors">Lịch sử đặt phòng gần đây</h3>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all dark:bg-gray-800 dark:text-gray-500 dark:hover:text-white">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-y border-gray-50 dark:border-gray-800 transition-colors">
                      <th className="py-5 px-10 text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">MÃ ĐT</th>
                      <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">KHÁCH HÀNG</th>
                      <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">TOUR</th>
                      <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">NGÀY ĐẶT</th>
                      <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">TỔNG TIỀN</th>
                      <th className="py-5 px-10 text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-20 text-center text-gray-400 font-bold italic">Chưa có lịch sử đặt phòng nào liên quan đến nhà cung cấp này.</td>
                      </tr>
                    ) : (
                      bookings.map((booking, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                          <td className="py-6 px-10 text-sm font-black text-blue-600 cursor-pointer hover:underline dark:text-blue-400">{booking.id}</td>
                          <td className="py-6 px-6 text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">{booking.customer}</td>
                          <td className="py-6 px-6 text-sm font-bold text-gray-900 dark:text-white transition-colors">{booking.tour_name}</td>
                          <td className="py-6 px-6 text-sm font-bold text-gray-500 dark:text-gray-400 transition-colors">{booking.date}</td>
                          <td className="py-6 px-6 text-sm font-black text-gray-900 dark:text-white transition-colors">{booking.amount}</td>
                          <td className="py-6 px-10">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors ${
                              booking.status === 'confirmed' || booking.status === 'Đã xác nhận' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                              booking.status === 'pending' || booking.status === 'Chờ xử lý' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                              'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-8 text-center bg-gray-50/50 dark:bg-gray-800/30 transition-colors">
                <button className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest dark:text-blue-400">Tải thêm lịch sử</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <SupplierFormModal 
          supplier={supplier} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
}
