'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Award, Heart, Globe, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden bg-blue-600">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" 
            fill 
            className="object-cover" 
            alt="About Hero" 
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center text-white space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Về LuxeVoyage</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight">
            Nâng tầm trải nghiệm <br /> lữ hành thượng lưu.
          </h1>
          <p className="text-xl font-medium opacity-90 max-w-2xl mx-auto">
            Chúng tôi không chỉ bán những chuyến đi, chúng tôi kiến tạo những kỷ niệm vô giá và những trải nghiệm độc bản dành riêng cho bạn.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Sứ mệnh của chúng tôi</h2>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              LuxeVoyage ra đời với khát vọng thay đổi cách mọi người trải nghiệm du lịch. Chúng tôi tin rằng mỗi hành trình đều xứng đáng là một tác phẩm nghệ thuật, được chăm chút tỉ mỉ từ những chi tiết nhỏ nhất.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-50 rounded-[2.5rem] space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-gray-900">Tận tâm</h4>
              <p className="text-sm text-gray-500 font-medium">Luôn đặt khách hàng làm trung tâm trong mọi quyết định.</p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-[2.5rem] space-y-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-gray-900">Chất lượng</h4>
              <p className="text-sm text-gray-500 font-medium">Tiêu chuẩn dịch vụ 5 sao quốc tế xuyên suốt hành trình.</p>
            </div>
          </div>
        </div>
        <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
          <Image 
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1200" 
            fill 
            className="object-cover" 
            alt="Our Story" 
          />
        </div>
      </section>

      {/* Numbers */}
      <section className="py-24 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Khách hàng hài lòng', value: '10,000+' },
            { label: 'Điểm đến toàn cầu', value: '50+' },
            { label: 'Năm kinh nghiệm', value: '15+' },
            { label: 'Giải thưởng du lịch', value: '25+' }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="text-5xl font-black text-blue-500 tracking-tight">{stat.value}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Tại sao chọn LuxeVoyage?</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto italic">Chúng tôi mang lại những giá trị vượt xa sự mong đợi của bạn.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Hành trình thiết kế riêng', 
                desc: 'Mỗi tour du lịch được tùy chỉnh hoàn toàn để phù hợp với sở thích và phong cách của bạn.',
                icon: <Globe className="w-8 h-8" />
              },
              { 
                title: 'Đội ngũ chuyên gia', 
                desc: 'Những hướng dẫn viên am hiểu kiến thức và tận tâm sẽ là người bạn đồng hành tin cậy.',
                icon: <Users className="w-8 h-8" />
              },
              { 
                title: 'Cam kết an toàn', 
                desc: 'Bảo hiểm du lịch quốc tế và hỗ trợ khẩn cấp 24/7 trên mọi hành trình.',
                icon: <ShieldCheck className="w-8 h-8" />
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-4">{feature.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 max-w-5xl mx-auto px-6 text-center space-y-10">
        <h2 className="text-5xl font-black text-gray-900 tracking-tight">Sẵn sàng để bắt đầu hành trình?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/tours" className="px-10 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3">
            Khám phá Tours ngay <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/contact" className="px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-full font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
            Liên hệ tư vấn
          </Link>
        </div>
      </section>
    </main>
  );
}
