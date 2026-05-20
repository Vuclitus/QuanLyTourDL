'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Download,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { TourFormModal } from '../TourFormModal';
import { tourService } from '@/services/tour.service';

export default function AdminTourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const data = await tourService.getById(Number(id));
      setTour(data);
    } catch (err) {
      console.error('Error fetching tour:', err);
      setError('Không thể tải thông tin tour.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-500">Đang tải chi tiết tour...</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p>{error || 'Tour không tồn tại'}</p>
        <Link href="/admin/tours" className="text-blue-600 hover:underline text-sm font-medium">Quay lại danh sách</Link>
      </div>
    );
  }

  // Empty participants list for new tour as requested
  const participants: any[] = [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/tours"
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">#{tour.id}</span>
              <span className="text-xs font-bold text-gray-400">Tạo ngày: {new Date(tour.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight dark:text-white">{tour.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm shadow-sm"
          >
            <Edit className="w-4 h-4 text-amber-500" />
            Chỉnh sửa
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-sm">
            <Trash2 className="w-4 h-4" />
            Xóa Tour
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Participants */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 transition-colors">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Doanh thu</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{(tour.revenue || 0).toLocaleString('vi-VN')}₫</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 transition-colors">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Số chỗ đã đặt</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">0 <span className="text-sm text-gray-400 font-bold">/ {tour.max_participants}</span></p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 transition-colors">
              <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Đánh giá</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {(tour.rating || 5.0).toFixed(1)} <span className="text-sm text-gray-400 font-bold">({tour.review_count || 0})</span>
                </p>
              </div>
            </div>
          </div>

          {/* Participants Table */}
          <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Danh sách hành khách</h3>
              {participants.length > 0 && (
                <button className="flex items-center gap-2 text-xs font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                  <Download className="w-4 h-4" />
                  Xuất danh sách
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                  <tr>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hành khách</th>
                    <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Chỗ</th>
                    <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thanh toán</th>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-gray-500 dark:text-gray-400 font-medium">Chưa có khách hàng đặt tour này</td>
                    </tr>
                  ) : (
                    participants.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-5 px-8">
                          <p className="font-bold text-gray-900 dark:text-gray-100">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.phone}</p>
                        </td>
                        <td className="py-5 px-6 text-center font-black text-gray-900 dark:text-gray-100">{p.passengers}</td>
                        <td className="py-5 px-6 font-bold text-gray-900 dark:text-gray-100">{p.total.toLocaleString('vi-VN')}₫</td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${p.status === 'Đã thanh toán' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                            }`}>
                            {p.status === 'Đã thanh toán' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {p.status}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50/50 dark:bg-gray-800/30 text-center">
              <button className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Xem tất cả đặt chỗ</button>
            </div>
          </div>

          {/* Itinerary Section */}
          <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Lịch trình chi tiết
              </h3>
            </div>
            <div className="p-8">
              {tour.schedules && tour.schedules.length > 0 ? (
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
                  {tour.schedules.map((item: any, index: number) => (
                    <div key={index} className="relative pl-12">
                      <div className="absolute left-0 top-1 w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center z-10 shadow-sm">
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">D{item.day_number}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-gray-900 dark:text-gray-100">{item.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500 dark:text-gray-400 italic">
                  Chưa có thông tin lịch trình cho tour này.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Info Details */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
            <div className="relative h-56">
              {tour.image_url ? (
                <img src={tour.image_url} alt={tour.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${tour.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                  {tour.status === 'active' ? 'Còn chỗ' : 'Tạm ngưng'}
                </span>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Điểm đến</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{tour.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Ngày khởi hành</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{new Date(tour.start_date).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Thời gian</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{tour.duration}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Hướng dẫn viên điều hành</p>
                <div className="space-y-3">
                  {tour.guides && tour.guides.length > 0 ? (
                    tour.guides.map((guide: any) => (
                      <div key={guide.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-50 flex-shrink-0 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                          {guide.image_url ? (
                            <img src={guide.image_url} alt={guide.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">
                              {guide.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-gray-900 dark:text-white truncate">{guide.full_name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">Kinh nghiệm: {guide.experience || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">Chưa chỉ định hướng dẫn viên</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Nhà cung cấp dịch vụ</p>
                <div className="space-y-4">
                  {tour.suppliers && tour.suppliers.length > 0 ? (
                    tour.suppliers.map((supplier: any) => (
                      <div key={supplier.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-black text-gray-900 dark:text-white truncate">{supplier.name}</p>
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded text-[8px] font-black uppercase tracking-tighter">
                              {supplier.service_type}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{supplier.address || 'N/A'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">Chưa chỉ định nhà cung cấp</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Giá niêm yết</p>
                <p className="text-3xl font-black text-blue-600">{Number(tour.price).toLocaleString('vi-VN')}₫</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-[32px] p-8 text-white space-y-4 shadow-xl shadow-blue-600/20">
            <h4 className="font-black text-lg">Ghi chú vận hành</h4>
            <p className="text-blue-100 text-sm leading-relaxed">Tour hiện đã đạt 60% công suất. Cần đẩy mạnh marketing cho tuần cuối cùng để lấp đầy 8 chỗ còn lại.</p>
            <div className="pt-4 flex items-center gap-2">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">
                    M{i}
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-blue-100">+9 người đang xem</p>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <TourFormModal 
          tour={{
            ...tour,
            date: tour.startDate, // Map field names to match modal expected props
          }} 
          onClose={() => {
            setIsEditModalOpen(false);
            fetchTour();
          }} 
        />
      )}
    </div>
  );
}
