'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  Compass, 
  Star, 
  ThumbsUp,
  Edit2,
  Send,
  Calendar,
  MoreHorizontal,
  Search,
  ChevronDown,
  Filter,
  Reply,
  Tag,
  Flag,
  MessageSquare,
  History,
  Plane,
  ChevronRight,
  Smile,
  Clock,
  BookOpen,
  CheckCircle2,
  Loader2,
  AlertCircle,
  UserCheck
} from 'lucide-react';

import { GuideFormModal } from '../../GuideFormModal';
import { guideVehicleService } from '@/services/guide-vehicle.service';

export default function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const guideId = parseInt(resolvedParams.id);
  
  const [guide, setGuide] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Thông tin chung');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [guideId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [guideData, toursData, reviewsData] = await Promise.all([
        guideVehicleService.getGuideById(guideId),
        guideVehicleService.getGuideTours(guideId),
        guideVehicleService.getGuideReviews(guideId)
      ]);
      setGuide(guideData);
      setTours(toursData);
      setReviews(reviewsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching guide data:', err);
      setError('Không thể tải thông tin hướng dẫn viên.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 dark:bg-gray-950 transition-colors">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Đang tải hồ sơ hướng dẫn viên...</p>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 dark:bg-gray-950 transition-colors">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 dark:bg-red-900/20">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{error || 'Không tìm thấy dữ liệu'}</h2>
          <p className="text-gray-500">Vui lòng kiểm tra lại đường dẫn hoặc quay lại danh sách.</p>
        </div>
        <Link href="/admin/guides-vehicles" className="px-8 py-3 bg-blue-600 text-white rounded-full font-black text-sm shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
          Quay lại danh sách
        </Link>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f3f4f6]/30 dark:bg-gray-950 pb-20 animate-in fade-in duration-500 transition-colors">
      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-8 pt-8">
        <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col md:flex-row items-center gap-10 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-blue-600/20 dark:border-gray-800 relative bg-gray-50 dark:bg-gray-800">
              {guide.image_url ? (
                <img src={guide.image_url} alt={guide.full_name} className="w-full h-full object-cover" />
              ) : (
                <UserCheck className="w-16 h-16 absolute inset-0 m-auto text-gray-300 dark:text-gray-600" />
              )}
            </div>
            <div className={`absolute bottom-2 right-2 w-8 h-8 ${guide.status === 'Sẵn sàng' ? 'bg-green-500' : 'bg-amber-500'} border-4 border-white rounded-full shadow-lg dark:border-gray-900`} />
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-center md:justify-start">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight dark:text-white transition-colors">{guide.full_name || 'N/A'}</h1>
                <span className="px-4 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-full uppercase tracking-widest dark:bg-blue-900/20 dark:text-blue-400 transition-colors">
                  ID: {guide.id}
                </span>
              </div>
              <p className="text-gray-500 font-bold text-sm dark:text-gray-400 transition-colors">
                Số thẻ: {guide.license_number || 'N/A'} • <span className={guide.status === 'Sẵn sàng' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>{guide.status}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {guide.languages?.map((lang: string) => (
                <span key={lang} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-700 uppercase tracking-widest dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 transition-colors">
                  {lang}
                </span>
              )) || <span className="text-gray-400 italic text-xs">Chưa cập nhật ngôn ngữ</span>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link 
              href="/admin/guides-vehicles"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-full font-black text-sm hover:border-gray-200 transition-all shadow-sm active:scale-95 whitespace-nowrap dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </Link>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-full font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/40 active:scale-95 whitespace-nowrap dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-8 mt-10">
        <div className="flex gap-10 border-b border-gray-200 dark:border-gray-800 transition-colors">
          {['Thông tin chung', 'Lịch trình tour', 'Đánh giá từ khách hàng'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-black transition-all relative ${
                activeTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-10">
        {activeTab === 'Thông tin chung' && (
          <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-500">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Contact & Experience Card */}
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-10 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
                <div className="flex items-center gap-4 text-[#1e3a8a] dark:text-blue-400 transition-colors">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight dark:text-white transition-colors">Chi tiết liên hệ & Kinh nghiệm</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 transition-colors">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 dark:text-gray-500">Email</p>
                        <p className="text-sm font-black text-gray-900 dark:text-gray-200 transition-colors">{guide.email || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 transition-colors">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 dark:text-gray-500">Số điện thoại</p>
                        <p className="text-sm font-black text-gray-900 dark:text-gray-200 transition-colors">{guide.phone || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 transition-colors">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 dark:text-gray-500">Kinh nghiệm</p>
                        <p className="text-sm font-black text-blue-600 dark:text-blue-400 leading-relaxed transition-colors">{guide.experience || 'Chưa có thông tin'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 transition-colors">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 dark:text-gray-500">Chứng chỉ chuyên môn</p>
                        <p className="text-sm font-black text-gray-900 dark:text-gray-200 leading-relaxed transition-colors">{guide.certificates || 'Chưa có thông tin'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Schedule Card */}
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-8 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[#1e3a8a] dark:text-blue-400 transition-colors">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight dark:text-white">Lịch trình tour sắp tới</h3>
                  </div>
                  <button onClick={() => setActiveTab('Lịch trình tour')} className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest dark:text-blue-400">Xem tất cả</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-gray-800 transition-colors">
                        <th className="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">Mã tour</th>
                        <th className="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">Tên tour</th>
                        <th className="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">Khởi hành</th>
                        <th className="py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
                      {tours.length === 0 ? (
                        <tr><td colSpan={4} className="py-8 text-center text-gray-400 text-xs italic">Chưa có lịch trình nào</td></tr>
                      ) : tours.slice(0, 5).map((tour, i) => (
                        <tr key={i} className="group transition-colors">
                          <td className="py-4 text-xs font-black text-blue-600 dark:text-blue-400">TOUR-{tour.id}</td>
                          <td className="py-4 text-xs font-black text-gray-700 dark:text-gray-300 transition-colors">{tour.name}</td>
                          <td className="py-4 text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">
                            {tour.start_date ? new Date(tour.start_date).toLocaleDateString('vi-VN') : 'N/A'}
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-colors ${
                              tour.status === 'active' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                              tour.status === 'completed' ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' :
                              'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                            }`}>
                              {tour.status === 'active' ? 'Sắp tới' : tour.status === 'completed' ? 'Đã hoàn thành' : tour.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* Stats Card */}
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-10 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
                <h3 className="text-2xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight transition-colors">Thống kê hiệu suất</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Tổng số tour đã dẫn', value: '142', icon: Compass, color: 'text-blue-600', bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20', darkColor: 'dark:text-blue-400' },
                    { label: 'Điểm đánh giá trung bình', value: guide.rating || '5.0', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20', darkColor: 'dark:text-amber-400' },
                    { label: 'Tỷ lệ phản hồi tích cực', value: '98%', icon: ThumbsUp, color: 'text-green-600', bg: 'bg-green-50', darkBg: 'dark:bg-green-900/20', darkColor: 'dark:text-green-400' }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 bg-gray-50 border border-gray-100 rounded-[32px] group hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-900">
                      <div className={`w-14 h-14 ${stat.bg} ${stat.darkBg} ${stat.color} ${stat.darkColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-gray-900 dark:text-white leading-none transition-colors">{stat.value}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 dark:text-gray-500 transition-colors">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Lịch trình tour' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50/30 dark:border-gray-800 dark:bg-gray-800/30 transition-colors">
                      <th className="py-6 px-10 text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">Mã Tour</th>
                      <th className="py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">Tên Tour</th>
                      <th className="py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center dark:text-gray-500">Khởi Hành</th>
                      <th className="py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center dark:text-gray-500">Kết Thúc</th>
                      <th className="py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center dark:text-gray-500">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
                    {tours.length === 0 ? (
                      <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">Không có dữ liệu lịch trình</td></tr>
                    ) : tours.map((tour, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                        <td className="py-6 px-10 text-sm font-black text-blue-600 dark:text-blue-400">TOUR-{tour.id}</td>
                        <td className="py-6 px-6 text-sm font-black text-gray-900 dark:text-gray-200 transition-colors">{tour.name}</td>
                        <td className="py-6 px-6 text-sm font-bold text-gray-500 dark:text-gray-400 text-center transition-colors">
                          {tour.start_date ? new Date(tour.start_date).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className="py-6 px-6 text-sm font-bold text-gray-500 dark:text-gray-400 text-center transition-colors">
                          {tour.end_date ? new Date(tour.end_date).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className="py-6 px-6 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm transition-colors ${
                            tour.status === 'active' ? 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' :
                            tour.status === 'completed' ? 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' :
                            'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400'
                          }`}>
                            {tour.status === 'active' ? 'Sắp tới' : tour.status === 'completed' ? 'Đã hoàn thành' : tour.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Đánh giá từ khách hàng' && (
          <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Sidebar: Ratings Summary */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-10 sticky top-32 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight transition-colors">Tổng quan đánh giá</h3>
                  <div className="flex items-center gap-6">
                    <h4 className="text-6xl font-black text-blue-600 dark:text-blue-400 tracking-tighter transition-colors">
                      {reviews.length > 0 
                        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
                        : '0.0'}
                    </h4>
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-4 h-4 ${
                              s <= (reviews.length > 0 ? Math.round(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length) : 0)
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-gray-200 dark:text-gray-800'
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500 transition-colors">Dựa trên {reviews.length} lượt đánh giá</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-50 dark:border-gray-800 space-y-6 transition-colors">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">ĐIỂM NỔI BẬT</p>
                  <div className="space-y-5">
                    {[
                      { label: 'Kiến thức chuyên môn', score: '5.0', icon: BookOpen },
                      { label: 'Thái độ phục vụ', score: '4.9', icon: Smile },
                      { label: 'Sự nhiệt tình', score: '5.0', icon: Star },
                    ].map((h, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-black text-gray-700 dark:text-gray-300 transition-colors">{h.label}</span>
                        </div>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400 transition-colors">{h.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Review List */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                    <Smile className="w-16 h-16 text-gray-300 mx-auto mb-6 dark:text-gray-700" />
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Chưa có đánh giá nào</h3>
                    <p className="text-gray-500">Hướng dẫn viên này chưa nhận được phản hồi trực tiếp nào từ hệ thống.</p>
                  </div>
                ) : reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-6 animate-in slide-in-from-right-4 duration-500 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-600/20 uppercase">
                          {review.customer_name?.charAt(0) || 'K'}
                        </div>
                        <div>
                          <h5 className="text-lg font-black text-gray-900 dark:text-white transition-colors">{review.customer_name}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest dark:text-gray-500 transition-colors">
                              {review.created_at ? new Date(review.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                            <span className="text-gray-300 dark:text-gray-700 transition-colors">•</span>
                            <span className="flex items-center gap-1 text-[10px] font-black text-gray-500 uppercase tracking-tighter dark:text-gray-400 transition-colors"><Plane className="w-3 h-3" /> {review.tour_name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl dark:bg-amber-900/20 transition-colors">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-800'}`} />)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed font-medium italic text-sm dark:text-gray-300 transition-colors">"{review.comment}"</p>

                    <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-gray-800 transition-colors">
                      <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest dark:text-blue-400"><Reply className="w-4 h-4" /> Trả lời</button>
                      <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-gray-900 transition-all uppercase tracking-widest dark:text-gray-500 dark:hover:text-gray-300"><Tag className="w-4 h-4" /> Gắn thẻ</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <GuideFormModal 
          guide={guide} 
          onClose={() => {
            setIsEditModalOpen(false);
            fetchData();
          }} 
        />
      )}
    </div>
  );
}
