'use client';

import React from 'react';
import { Scale, Info, AlertTriangle, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white pt-40 pb-32">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-600/20 mb-8">
            <Scale className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">Điều khoản dịch vụ</h1>
          <p className="text-gray-500 font-medium italic">Chào mừng bạn đến với LuxeVoyage. Vui lòng đọc kỹ các điều khoản sau.</p>
        </div>

        <div className="space-y-12">
          <div className="flex gap-8 items-start p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">1. Chấp nhận điều khoản</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định bởi LuxeVoyage. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-start p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">2. Quy định đặt tour và Thanh toán</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                Mọi đơn đặt tour phải được xác nhận qua hệ thống email của chúng tôi. Việc thanh toán phải được thực hiện theo đúng lộ trình đã cam kết trong hợp đồng tour. LuxeVoyage có quyền hủy đơn nếu việc thanh toán không đúng hạn.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-start p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">3. Chính sách hoàn hủy</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                Khách hàng có thể hủy tour trước ngày khởi hành theo các mốc thời gian quy định để nhận hoàn tiền một phần hoặc toàn bộ. Chi tiết mức phí hoàn hủy sẽ được áp dụng tùy theo từng loại tour cụ thể.
              </p>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-[3rem] p-12 text-center text-white space-y-6">
            <h3 className="text-2xl font-black">Cần hỗ trợ thêm?</h3>
            <p className="opacity-80 font-medium">Đội ngũ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn về các quy định.</p>
            <a href="/contact" className="inline-block px-10 py-4 bg-white text-indigo-900 rounded-full font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Liên hệ ngay</a>
          </div>
        </div>
      </div>
    </main>
  );
}
