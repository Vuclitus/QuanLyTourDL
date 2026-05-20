'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Làm thế nào để đặt tour tại LuxeVoyage?',
      a: 'Bạn có thể đặt tour trực tiếp trên website bằng cách chọn tour yêu thích, nhấn "Đặt Tour" và điền thông tin cá nhân. Ngoài ra, bạn có thể gọi hotline 1900 6789 để được tư vấn viên hỗ trợ.'
    },
    {
      q: 'Tôi có thể thay đổi lịch trình tour sau khi đã đặt không?',
      a: 'Đối với các tour thiết kế riêng (Private Tour), bạn có thể yêu cầu thay đổi lịch trình trước ngày khởi hành 15 ngày. Các tour cố định sẽ áp dụng theo điều khoản thay đổi cụ thể của từng tour.'
    },
    {
      q: 'Chính sách hoàn tiền khi hủy tour như thế nào?',
      a: 'Hoàn tiền 100% nếu hủy trước 30 ngày. Hoàn tiền 50% nếu hủy từ 15-29 ngày. Rất tiếc chúng tôi không thể hoàn tiền nếu hủy sau 15 ngày trước khởi hành do các chi phí dịch vụ đã được thanh toán cho đối tác.'
    },
    {
      q: 'LuxeVoyage có hỗ trợ làm visa không?',
      a: 'Có, chúng tôi hỗ trợ tư vấn và làm thủ tục visa trọn gói cho tất cả các khách hàng đặt tour quốc tế tại LuxeVoyage.'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-40 pb-32">
      <div className="max-w-3xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-600/20 mb-8">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">Câu hỏi thường gặp</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto">Mọi thắc mắc của bạn về dịch vụ của LuxeVoyage đều có lời giải đáp tại đây.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-8 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-black text-gray-900">{faq.q}</span>
                {openIndex === i ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-gray-400" />}
              </button>
              {openIndex === i && (
                <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-6">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-10 bg-blue-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-600/20">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black">Vẫn còn thắc mắc?</h3>
            <p className="opacity-80 font-medium">Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
          </div>
          <a href="/contact" className="px-10 py-4 bg-white text-blue-600 rounded-full font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-3">
            <MessageCircle className="w-5 h-5" /> Trò chuyện ngay
          </a>
        </div>
      </div>
    </main>
  );
}
