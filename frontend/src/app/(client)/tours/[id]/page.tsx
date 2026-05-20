import React from 'react';
import Image from 'next/image';
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
  ChevronRight
} from 'lucide-react';

export default function TourDetailPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image 
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2000" 
          alt="Paris"
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
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Khám Phá Paris Tráng Lệ</h1>
                <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-black">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.9 (128 đánh giá)</span>
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                Trải nghiệm 7 ngày 6 đêm tại kinh đô ánh sáng, tận hưởng dịch vụ lưu trú 5 sao và các hoạt động văn hóa độc quyền.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Thời gian</p>
                    <p className="text-sm font-black text-gray-900">7 Ngày 6 Đêm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Quy mô nhóm</p>
                    <p className="text-sm font-black text-gray-900">Tối đa 12 người</p>
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
                {[
                  { 
                    day: 'N1', 
                    title: 'Đến Paris & Nhận phòng khách sạn 5 sao', 
                    desc: 'Xe sang trọng đón quý khách tại sân bay Charles de Gaulle. Nhận phòng tại khách sạn Le Meurice. Buổi tối thưởng thức bữa tối chào mừng tại nhà hàng Michelin 3 sao.' 
                  },
                  { 
                    day: 'N2', 
                    title: 'Khám phá Louvre & Du thuyền sông Seine', 
                    desc: 'Tham quan bảo tàng Louvre với hướng dẫn viên riêng. Buổi chiều trải nghiệm du thuyền VIP trên sông Seine lúc hoàng hôn, ngắm nhìn tháp Eiffel lên đèn.' 
                  },
                  { 
                    day: 'N3', 
                    title: 'Montmartre & Trải nghiệm mua sắm đẳng cấp', 
                    desc: 'Khám phá khu phố nghệ sĩ Montmartre và vương cung thánh đường Sacré-Cœur. Chiều mua sắm cá nhân cùng stylist tại Galeries Lafayette với phòng thử đồ VIP.' 
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">
                      {item.day}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  Bao gồm
                </h3>
                <ul className="space-y-4">
                  {[
                    'Vé máy bay khứ hồi hạng thương gia',
                    '6 đêm tại khách sạn 5 sao Le Meurice',
                    'Các bữa ăn tinh hoa ẩm thực Pháp',
                    'Xe limousine đưa đón xuyên suốt hành trình',
                    'Hướng dẫn viên riêng thông thạo tiếng Việt'
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
                    'Chi phí làm visa Schengen',
                    'Bảo hiểm du lịch cá nhân',
                    'Chi phí mua sắm cá nhân',
                    'Tiền tip cho hướng dẫn viên và tài xế'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/10 border border-blue-50 space-y-8">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Giá chỉ từ</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-blue-600">185.000.000₫</span>
                  <span className="text-sm font-bold text-gray-400">/ khách</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Chỉ còn 4 chỗ trống
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-widest ml-1">Ngày khởi hành</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="mm/dd/yyyy"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-widest ml-1">Số lượng khách</label>
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2">
                    <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-black text-gray-900">2</span>
                    <button className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-lg shadow-blue-600/10">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95">
                  Đặt ngay
                </button>
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Không yêu cầu thanh toán ngay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
