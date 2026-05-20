'use client';

import React, { useState, useEffect } from 'react';
import { Star, Send, MessageSquare, User, Mail, Loader2, CheckCircle2, Ticket, Users } from 'lucide-react';
import { feedbackService } from '@/services/feedback.service';
import { customerService } from '@/services/customer.service';
import { tourService } from '@/services/tour.service';
import { guideVehicleService } from '@/services/guide-vehicle.service';
import { toast } from 'react-hot-toast';

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'tour' | 'guide'>('tour');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [tours, setTours] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    comment: '',
    tour_id: '',
    guide_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursData, guidesData] = await Promise.all([
          tourService.getAll(),
          guideVehicleService.getGuides()
        ]);
        setTours(toursData || []);
        setGuides(guidesData || []);

        const auth = localStorage.getItem('isLoggedIn');
        if (auth === 'true') {
          const data = await customerService.getMe();
          setFormData(prev => ({
            ...prev,
            full_name: data.user?.full_name || '',
            email: data.user?.email || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching data for feedback:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      toast.error('Vui lòng nhập nội dung góp ý.');
      return;
    }

    try {
      setLoading(true);
      const submissionData = {
        full_name: formData.full_name.trim() || null,
        email: formData.email.trim(),
        comment: formData.comment.trim(),
        tour_id: activeTab === 'tour' && formData.tour_id ? parseInt(formData.tour_id) : null,
        guide_id: activeTab === 'guide' && formData.guide_id ? parseInt(formData.guide_id) : null,
        rating: rating
      };
      
      await feedbackService.submit(submissionData);
      setSubmitted(true);
      toast.success('Cảm ơn bạn đã gửi góp ý!');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Có lỗi xảy ra khi gửi góp ý.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-green-600/10">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Gửi góp ý thành công!</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-md mx-auto">
              Cảm ơn bạn đã dành thời gian chia sẻ trải nghiệm. Ý kiến của bạn là động lực để LuxeVoyage hoàn thiện dịch vụ tốt hơn mỗi ngày.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
          >
            Quay lại trang chủ
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050810] pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Content Left (2/5) */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 backdrop-blur-md">
                <MessageSquare className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Feedback Hub</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
                Ý kiến của <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">bạn là tất cả.</span>
              </h1>
              <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm">
                Chúng tôi không ngừng hoàn thiện để mang đến những hành trình đẳng cấp nhất dành cho bạn.
              </p>
            </div>
            
            <div className="space-y-4 pt-4">
              {[
                { title: 'Hỗ trợ 24/7', desc: 'Đội ngũ chăm sóc luôn lắng nghe.', icon: '01' },
                { title: 'Cải tiến dịch vụ', desc: 'Góp ý của bạn thay đổi chúng tôi.', icon: '02' },
                { title: 'Bảo mật thông tin', desc: 'Sự riêng tư được đặt lên hàng đầu.', icon: '03' }
              ].map((item, i) => (
                <div key={i} className="group flex gap-5 p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center text-blue-400 font-black border border-blue-500/20 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white group-hover:text-blue-400 transition-colors">{item.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Right (3/5) */}
          <div className="lg:col-span-3">
            <div className="bg-[#0f1420]/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-14 shadow-2xl border border-white/5 relative">
              {/* Tabs */}
              <div className="flex p-1.5 bg-[#161d2b] rounded-2xl mb-10 w-fit">
                <button
                  onClick={() => setActiveTab('tour')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'tour' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  Đánh giá Tour
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'guide' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Đánh giá HDV
                </button>
              </div>

              {/* Form header inside */}
              <div className="mb-10">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {activeTab === 'tour' ? 'Góp Ý Về Chuyến Đi' : 'Đánh Giá Hướng Dẫn Viên'}
                </h2>
                <p className="text-gray-500 text-sm font-medium mt-1">
                  {activeTab === 'tour' 
                    ? 'Chia sẻ trải nghiệm của bạn về chất lượng dịch vụ tour.' 
                    : 'Góp ý về sự nhiệt tình và chuyên nghiệp của hướng dẫn viên.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dynamic Selection based on Tab */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                    {activeTab === 'tour' ? 'Chọn Tour (Nếu có)' : 'Chọn Hướng dẫn viên'}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 flex items-center justify-center pointer-events-none">
                      {activeTab === 'tour' ? <Ticket className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                    </div>
                    {activeTab === 'tour' ? (
                      <select 
                        value={formData.tour_id}
                        onChange={(e) => setFormData({...formData, tour_id: e.target.value})}
                        className="w-full pl-14 pr-12 py-5 bg-[#161d2b] rounded-2xl border border-white/5 text-sm font-bold text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Góp ý chung cho hệ thống</option>
                        {tours.map(tour => (
                          <option key={tour.id} value={tour.id}>{tour.name}</option>
                        ))}
                      </select>
                    ) : (
                      <select 
                        value={formData.guide_id}
                        onChange={(e) => setFormData({...formData, guide_id: e.target.value})}
                        className="w-full pl-14 pr-12 py-5 bg-[#161d2b] rounded-2xl border border-white/5 text-sm font-bold text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Chọn hướng dẫn viên</option>
                        {guides.map(guide => (
                          <option key={guide.id} value={guide.id}>{guide.full_name}</option>
                        ))}
                      </select>
                    )}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Họ và tên (Tùy chọn)</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full pl-14 pr-5 py-5 bg-[#161d2b] rounded-2xl border border-white/5 text-sm font-bold text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        placeholder="Để trống để ẩn danh"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email liên hệ</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-14 pr-5 py-5 bg-[#161d2b] rounded-2xl border border-white/5 text-sm font-bold text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Đánh giá của bạn</label>
                  <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#161d2b] p-6 rounded-[2rem] border border-white/5">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-all hover:scale-125 active:scale-90"
                        >
                          <Star 
                            className={`w-10 h-10 transition-all duration-300 ${
                              (hoverRating || rating) >= star 
                                ? 'fill-blue-500 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                                : 'text-gray-700'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                    <div className="h-8 w-px bg-white/5 hidden md:block" />
                    <span className="text-sm font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-xl">
                      {rating === 5 ? '⭐ Rất tuyệt vời' : rating === 4 ? '✨ Hài lòng' : rating === 3 ? '👌 Bình thường' : rating === 2 ? '👎 Kém' : '🤮 Rất tệ'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nội dung chi tiết</label>
                  <textarea 
                    rows={5}
                    required
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="w-full px-8 py-6 bg-[#161d2b] rounded-[2.5rem] border border-white/5 text-sm font-bold text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                    placeholder="Chia sẻ trải nghiệm hoặc góp ý của bạn để chúng tôi ngày một tốt hơn..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center gap-4 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.5)] hover:-translate-y-1.5 transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  Gửi góp ý của bạn
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
