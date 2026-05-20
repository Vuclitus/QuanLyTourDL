'use client';

import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-40 pb-32">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-600/20 mb-8">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">Chính sách bảo mật</h1>
          <p className="text-gray-500 font-medium italic">Cập nhật lần cuối: Ngày 16 tháng 5 năm 2026</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-blue-600">
              <Lock className="w-6 h-6" />
              <h2 className="text-2xl font-black text-gray-900">1. Thu thập thông tin</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              Chúng tôi thu thập các thông tin cá nhân mà bạn cung cấp khi đăng ký tài khoản, đặt tour hoặc liên hệ với chúng tôi. Thông tin này bao gồm:
            </p>
            <ul className="space-y-3">
              {[
                'Họ tên và thông tin liên lạc (Email, số điện thoại)',
                'Thông tin thanh toán và giao dịch',
                'Thông tin về sở thích du lịch và yêu cầu đặc biệt',
                'Dữ liệu kỹ thuật (Địa chỉ IP, loại trình duyệt, lịch sử truy cập)'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-500 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 text-blue-600">
              <Eye className="w-6 h-6" />
              <h2 className="text-2xl font-black text-gray-900">2. Sử dụng thông tin</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              Thông tin của bạn được sử dụng để:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Xác nhận và quản lý các đơn đặt tour',
                'Cải thiện chất lượng dịch vụ khách hàng',
                'Gửi thông báo về tour mới và ưu đãi đặc biệt',
                'Đảm bảo an ninh và ngăn chặn gian lận'
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-700 italic">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 text-blue-600">
              <FileText className="w-6 h-6" />
              <h2 className="text-2xl font-black text-gray-900">3. Bảo mật dữ liệu</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              LuxeVoyage cam kết bảo vệ dữ liệu cá nhân của bạn bằng các biện pháp an ninh kỹ thuật và tổ chức tiên tiến nhất. Chúng tôi sử dụng mã hóa SSL cho mọi giao dịch và kiểm soát nghiêm ngặt quyền truy cập nội bộ.
            </p>
          </section>

          <div className="pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng <a href="/contact" className="text-blue-600 font-black hover:underline">liên hệ với chúng tôi</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
