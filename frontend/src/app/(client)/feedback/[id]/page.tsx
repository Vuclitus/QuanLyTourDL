'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, MessageSquare, Camera, Send, CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] p-10 text-center shadow-2xl border border-blue-50 space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Cảm ơn bạn đã chia sẻ!</h2>
          <p className="text-gray-500 font-medium">Đánh giá của bạn giúp chúng tôi hoàn thiện dịch vụ và mang lại những hành trình tốt hơn.</p>
          <Link href="/" className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </Link>

        <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Tour Info Sidebar */}
            <div className="md:col-span-2 bg-blue-600 p-10 text-white space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <div className="space-y-4">
                <h1 className="text-2xl font-black leading-tight">Chia sẻ trải nghiệm chuyến đi của bạn</h1>
                <p className="text-blue-100 text-sm font-medium">Chúng tôi luôn lắng nghe để mang lại những hành trình tuyệt vời nhất.</p>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg border border-white/20">
                  <Image 
                    src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800" 
                    alt="Tour" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Chuyến đi đã tham gia</p>
                  <p className="font-black text-lg">Khám Phá Paris Tráng Lệ</p>
                  <p className="text-xs text-blue-100">Khởi hành: 15/10/2023</p>
                </div>
              </div>
            </div>

            {/* Feedback Form */}
            <div className="md:col-span-3 p-10 space-y-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Rating */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">ĐÁNH GIÁ CỦA BẠN</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          rating >= star ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/20' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                    <span className="ml-2 self-center font-black text-gray-900 text-lg">{rating}/5</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">NHẬN XÉT CHI TIẾT</label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-5 top-5 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <textarea 
                      placeholder="Chia sẻ những điều bạn ấn tượng nhất về chuyến đi..." 
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-[24px] border-none outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[160px] font-medium text-gray-900 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Upload Images */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">HÌNH ẢNH THỰC TẾ (NẾU CÓ)</label>
                  <button type="button" className="w-full p-8 border-2 border-dashed border-gray-100 rounded-[24px] hover:border-blue-200 hover:bg-blue-50 transition-all group flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-600">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 group-hover:text-blue-600">Nhấn để tải ảnh lên hoặc kéo thả vào đây</p>
                  </button>
                </div>

                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                  <Send className="w-5 h-5" />
                  Gửi đánh giá ngay
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
