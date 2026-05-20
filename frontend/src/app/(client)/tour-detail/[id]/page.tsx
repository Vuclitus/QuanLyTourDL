'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Minus,
  Plus,
  ChevronRight,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { tourService } from '@/services/tour.service';
import { feedbackService } from '@/services/feedback.service';

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [tour, setTour] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestCount, setGuestCount] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tourId = parseInt(id);
        const [tourData, feedbacksData] = await Promise.all([
          tourService.getById(tourId),
          feedbackService.getAll(tourId)
        ]);
        setTour(tourData);
        setFeedbacks(feedbacksData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-black text-gray-900">Không tìm thấy tour</p>
      </div>
    );
  }

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericPrice || 0);
  };

  const remainingSeats = tour.max_participants - (tour.current_booked || 0);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image 
          src={tour.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2000"} 
          alt={tour.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{tour.name}</h1>
                <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-black">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{tour.rating || 5.0} ({tour.review_count || 0} đánh giá)</span>
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                {tour.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Thời gian</p>
                    <p className="text-sm font-black text-gray-900">{tour.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Quy mô nhóm</p>
                    <p className="text-sm font-black text-gray-900">Tối đa {tour.max_participants} người</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Điểm đến</p>
                    <p className="text-sm font-black text-gray-900">{tour.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                Lịch Trình Chi Tiết
              </h2>
              
              <div className="space-y-4">
                {tour.schedules?.length > 0 ? (
                  tour.schedules.sort((a: any, b: any) => a.day_number - b.day_number).map((item: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">
                        N{item.day_number}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-400 font-bold uppercase tracking-widest border border-gray-100">
                    Chưa cập nhật lịch trình
                  </div>
                )}
              </div>
            </section>

            {/* Inclusions & Exclusions (Static for now as they are not in DB) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  Bao gồm
                </h3>
                <ul className="space-y-4">
                  {[
                    'Vé máy bay khứ hồi hạng phổ thông',
                    'Lưu trú tại khách sạn cao cấp',
                    'Các bữa ăn theo chương trình',
                    'Xe đưa đón xuyên suốt hành trình',
                    'Hướng dẫn viên chuyên nghiệp'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  Không bao gồm
                </h3>
                <ul className="space-y-4">
                  {[
                    'Bảo hiểm du lịch cá nhân',
                    'Chi phí mua sắm cá nhân',
                    'Tiền tip cho hướng dẫn viên và tài xế',
                    'Các dịch vụ không đề cập trong chương trình'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feedback / Reviews Section */}
            <section className="space-y-8 pt-8">
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Đánh giá từ khách hàng</h2>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Những chia sẻ thực tế từ người tham gia</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-2xl border border-yellow-100">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-lg font-black">{tour.rating || 5.0}/5</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {feedbacks.length > 0 ? (
                  feedbacks.map((review, idx) => (
                    <div key={idx} className="group bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                            {review.full_name ? review.full_name.charAt(0) : '?'}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-black text-xl text-gray-900">
                                {review.full_name || 'Khách hàng ẩn danh'}
                              </p>
                              {review.rating === 5 && (
                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">Hài lòng tuyệt đối</span>
                              )}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {new Date(review.created_at).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Đã xác thực trải nghiệm</span>
                        </div>
                      </div>
                      <div className="mt-8 relative">
                        <div className="absolute -left-4 top-0 text-blue-100 dark:text-gray-800 text-6xl font-serif italic select-none">"</div>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium relative z-10 pl-4">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-[3rem] p-16 text-center border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
                      <MessageSquare className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Chưa có đánh giá nào</h3>
                    <p className="text-gray-400 font-medium max-w-xs mx-auto">Hãy là người đầu tiên chia sẻ cảm nhận về chuyến hành trình này.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/10 border border-blue-50 space-y-8">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Giá chỉ từ</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-blue-600">{formatPrice(tour.price)}</span>
                  <span className="text-sm font-bold text-gray-400">/ khách</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    {tour.status === 'active' ? 'Đang mở bán' : tour.status}
                  </div>
                  {remainingSeats <= 5 && remainingSeats > 0 && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                      <Users className="w-3 h-3" />
                      Chỉ còn {remainingSeats} chỗ
                    </div>
                  )}
                  {remainingSeats <= 0 && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                      <Users className="w-3 h-3" />
                      Hết chỗ
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-widest ml-1">Ngày khởi hành</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      readOnly
                      value={new Date(tour.start_date).toLocaleDateString('vi-VN')}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-widest ml-1">Số lượng khách (Còn {remainingSeats} chỗ)</label>
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2">
                    <button 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      disabled={remainingSeats <= 0}
                      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-black text-gray-900">{remainingSeats > 0 ? guestCount : 0}</span>
                    <button 
                      onClick={() => setGuestCount(Math.min(remainingSeats, guestCount + 1))}
                      disabled={remainingSeats <= 0 || guestCount >= remainingSeats}
                      className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-lg shadow-blue-600/10 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-blue-600"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {remainingSeats > 0 ? (
                  <Link 
                    href={`/booking?tourId=${tour.id}&guests=${guestCount}`} 
                    className="block w-full text-center py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
                  >
                    Đặt ngay
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="block w-full text-center py-5 bg-gray-200 text-gray-400 rounded-[24px] font-black text-lg cursor-not-allowed"
                  >
                    Hết chỗ
                  </button>
                )}
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {remainingSeats > 0 ? `Tổng cộng: ${formatPrice(tour.price * guestCount)}` : 'Vui lòng chọn tour khác'}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  );
}
