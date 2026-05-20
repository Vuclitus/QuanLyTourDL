'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, User, Loader2, CheckCircle2, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { contactService } from '@/services/contact.service';
import { customerService } from '@/services/customer.service';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = localStorage.getItem('isLoggedIn');
        if (auth === 'true') {
          const data = await customerService.getMe();
          setFormData(prev => ({
            ...prev,
            full_name: data.user?.full_name || '',
            email: data.user?.email || '',
            phone: data.phone || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error('Vui lòng nhập nội dung tin nhắn.');
      return;
    }

    try {
      setLoading(true);
      await contactService.submit(formData);
      setSubmitted(true);
      toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm.');
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Có lỗi xảy ra khi gửi tin nhắn.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#050810] pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500 bg-[#0f1420]/50 backdrop-blur-2xl p-16 rounded-[4rem] border border-white/5 shadow-2xl">
          <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tight">Gửi Thành Công!</h1>
            <p className="text-gray-400 font-medium text-lg max-w-md mx-auto leading-relaxed">
              Cảm ơn bạn đã liên hệ với LuxeVoyage. Đội ngũ chuyên viên của chúng tôi đã nhận được thông tin và sẽ phản hồi bạn trong vòng 24 giờ làm việc.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all active:scale-95"
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20">
          {/* Info Side (2/5) */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 backdrop-blur-md">
                <Send className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contact Us</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
                Kết nối với <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">LuxeVoyage.</span>
              </h1>
              <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm">
                Bất kể bạn có câu hỏi nào hay muốn lên kế hoạch cho chuyến đi trong mơ, chúng tôi luôn sẵn sàng lắng nghe.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { title: 'Địa chỉ trụ sở', content: '123 Đường du lịch, Quận 1, TP. Hồ Chí Minh', icon: <MapPin className="w-6 h-6" />, color: 'blue' },
                { title: 'Hotline 24/7', content: '1900 6789 - 090 123 4567', icon: <Phone className="w-6 h-6" />, color: 'indigo' },
                { title: 'Email hỗ trợ', content: 'support@luxevoyage.vn', icon: <Mail className="w-6 h-6" />, color: 'blue' },
                { title: 'Giờ làm việc', content: 'Thứ 2 - Chủ Nhật: 08:00 - 21:00', icon: <Clock className="w-6 h-6" />, color: 'indigo' }
              ].map((item, i) => (
                <div key={i} className="group flex gap-6 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
                  <div className={`w-14 h-14 bg-${item.color}-500/10 rounded-2xl flex items-center justify-center text-${item.color}-400 border border-${item.color}-500/20 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest">{item.title}</h4>
                    <p className="text-white font-bold">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Form Side (3/5) */}
          <div className="lg:col-span-3">
            <div className="bg-[#0f1420]/80 backdrop-blur-2xl rounded-[4rem] p-8 md:p-16 shadow-2xl border border-white/5 relative">
              <div className="mb-12">
                <h2 className="text-3xl font-black text-white tracking-tight">Gửi lời nhắn</h2>
                <p className="text-gray-500 font-medium mt-2">Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Họ và tên</label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full pl-16 pr-6 py-5 bg-[#161d2b] rounded-2xl border border-white/5 text-sm font-bold text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-16 pr-6 py-5 bg-[#161d2b] rounded-2xl border border-white/5 text-sm font-bold text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        placeholder="example@gmail.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Số điện thoại</label>
                    <div className="relative group">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-16 pr-6 py-5 bg-[#161d2b] rounded-2xl border border-white/5 text-sm font-bold text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        placeholder="0901 234 567"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Chủ đề</label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full pl-16 pr-6 py-5 bg-[#161d2b] rounded-2xl border border-white/5 text-sm font-bold text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        placeholder="Tư vấn tour, Hợp tác, ..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Nội dung chi tiết</label>
                  <textarea 
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-8 py-6 bg-[#161d2b] rounded-[2.5rem] border border-white/5 text-sm font-bold text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                    placeholder="Nhập nội dung bạn muốn trao đổi..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center gap-4 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.5)] hover:-translate-y-1.5 transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  Gửi yêu cầu liên hệ
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
