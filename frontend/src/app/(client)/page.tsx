'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Calendar, Star, ArrowRight, ShieldCheck, Headphones, CircleDollarSign } from 'lucide-react';

import { tourService } from '@/services/tour.service';

export default function LandingPage() {
  const [featuredTours, setFeaturedTours] = React.useState<any[]>([]);
  const [destinations, setDestinations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchDest, setSearchDest] = React.useState('');
  const [searchDate, setSearchDate] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const tours = await tourService.getAll();
        // Just take top 3 for featured
        setFeaturedTours(tours.slice(0, 3));

        // Group by destination to get counts
        const destMap = new Map();
        tours.forEach((t: any) => {
          if (!destMap.has(t.destination)) {
            destMap.set(t.destination, { name: t.destination, count: 0, image: t.image_url });
          }
          destMap.get(t.destination).count++;
        });

        const destList = Array.from(destMap.values())
          .map(d => ({ ...d, count: `${d.count} Tours` }))
          .slice(0, 4);
        
        // Add default images if missing or use unsplash
        const fallbackImages = [
          'https://images.unsplash.com/photo-1555432384-3b2d1e5e013a?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1537956961113-53721387d853?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1504457047772-27fad17438ef?auto=format&fit=crop&q=80&w=600'
        ];

        setDestinations(destList.map((d, i) => ({
          ...d,
          image: d.image || fallbackImages[i % 4]
        })));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchDest) params.append('destination', searchDest);
    if (searchDate) params.append('start_date', searchDate);
    window.location.href = `/tours?${params.toString()}`;
  };

  return (
    <>
      {/* Hero Section */}
      <header className="relative pt-32 pb-48 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070" 
            fill
            priority
            className="object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center text-white space-y-8">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-2xl text-shadow">
            Khám Phá Thế Giới Theo Cách Riêng Của Bạn
          </h2>
          <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto drop-shadow-lg">
            Trải nghiệm những chuyến đi đẳng cấp với dịch vụ tận tâm và thiết kế hành trình độc bản chỉ dành cho bạn.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mt-12 bg-white/90 backdrop-blur-xl p-3 rounded-[32px] shadow-2xl flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full relative group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                value={searchDest}
                onChange={(e) => setSearchDest(e.target.value)}
                placeholder="Bạn muốn đi đâu?" 
                className="w-full pl-14 pr-6 py-4 bg-transparent outline-none text-sm font-bold text-gray-800"
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-200"></div>
            <div className="flex-1 w-full relative group">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="date" 
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-transparent outline-none text-sm font-bold text-gray-800"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white rounded-full text-sm font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Search className="w-5 h-5" />
              Tìm Kiếm
            </button>
          </div>
        </div>
      </header>

      {/* Featured Tours */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Tour Nổi Bật</h3>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Những hành trình được yêu thích nhất tháng này</p>
          </div>
          <Link href="/tours" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-[400px] rounded-[32px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <Link 
                key={tour.id} 
                href={`/tour-detail/${tour.id}`}
                className="group bg-white rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-64">
                  <Image 
                    src={tour.image_url || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800'} 
                    alt={tour.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  {tour.status === 'featured' && (
                    <span className="absolute top-4 left-4 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      Hot Deal
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">{tour.duration}</p>
                      <h4 className="text-lg font-black text-gray-900 truncate max-w-[200px]" title={tour.name}>{tour.name}</h4>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-400 rounded-lg text-[10px] font-black">
                      <Star className="w-3 h-3 fill-current" /> {tour.rating || 5.0}
                    </div>
                  </div>
                </div>
                <div className="p-8 flex items-center justify-between">
                  <div>
                    {tour.old_price && <p className="text-xs text-gray-400 line-through font-bold mb-1">{formatPrice(tour.old_price)}</p>}
                    <p className="text-2xl font-black text-blue-600">{formatPrice(tour.price)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular Destinations */}
      <section className="py-32 bg-blue-50/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">Điểm Đến Yêu Thích</h3>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest max-w-xl mx-auto">Lựa chọn hàng đầu cho những kỳ nghỉ khó quên</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
              <div className="md:col-span-2 bg-gray-200 animate-pulse rounded-[40px]"></div>
              <div className="space-y-6 flex flex-col">
                <div className="flex-1 bg-gray-200 animate-pulse rounded-[40px]"></div>
                <div className="flex-1 bg-gray-200 animate-pulse rounded-[40px]"></div>
              </div>
              <div className="bg-gray-200 animate-pulse rounded-[40px]"></div>
            </div>
          ) : destinations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
              {destinations[0] && (
                <Link 
                  href={`/tours?destination=${destinations[0].name}`}
                  className="md:col-span-2 relative group overflow-hidden rounded-[40px] shadow-2xl"
                >
                  <Image src={destinations[0].image} fill className="object-cover group-hover:scale-110 transition-transform duration-700" alt={destinations[0].name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white space-y-2">
                    <h4 className="text-4xl font-black">{destinations[0].name}</h4>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{destinations[0].count}</p>
                  </div>
                </Link>
              )}
              <div className="space-y-6 flex flex-col">
                {destinations[1] && (
                  <Link 
                    href={`/tours?destination=${destinations[1].name}`}
                    className="flex-1 relative group overflow-hidden rounded-[40px] shadow-xl"
                  >
                    <Image src={destinations[1].image} fill className="object-cover group-hover:scale-110 transition-transform duration-700" alt={destinations[1].name} />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute bottom-6 left-6 text-white"><h4 className="text-xl font-black">{destinations[1].name}</h4></div>
                  </Link>
                )}
                {destinations[3] && (
                  <Link 
                    href={`/tours?destination=${destinations[3].name}`}
                    className="flex-1 relative group overflow-hidden rounded-[40px] shadow-xl"
                  >
                    <Image src={destinations[3].image} fill className="object-cover group-hover:scale-110 transition-transform duration-700" alt={destinations[3].name} />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute bottom-6 left-6 text-white"><h4 className="text-xl font-black">{destinations[3].name}</h4></div>
                  </Link>
                )}
              </div>
              {destinations[2] && (
                <Link 
                  href={`/tours?destination=${destinations[2].name}`}
                  className="relative group overflow-hidden rounded-[40px] shadow-2xl"
                >
                  <Image src={destinations[2].image} fill className="object-cover group-hover:scale-110 transition-transform duration-700" alt={destinations[2].name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white space-y-2">
                    <h4 className="text-3xl font-black">{destinations[2].name}</h4>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{destinations[2].count}</p>
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-100 rounded-[32px] flex items-center justify-center text-blue-600 shadow-xl shadow-blue-600/5">
            <CircleDollarSign className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-gray-900">Mức Giá Tốt Nhất</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Cam kết mang đến cho bạn những trải nghiệm tuyệt vời với chi phí hợp lý và minh bạch nhất.</p>
          </div>
        </div>
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-gray-900">Dịch Vụ Đẳng Cấp</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Đối tác uy tín, chất lượng dịch vụ được kiểm định nghiêm ngặt để đảm bảo sự hài lòng tuyệt đối.</p>
          </div>
        </div>
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-100 rounded-[32px] flex items-center justify-center text-blue-600 shadow-xl shadow-blue-600/5">
            <Headphones className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-gray-900">Hỗ Trợ 24/7</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Đội ngũ chuyên gia luôn sẵn lòng lắng nghe và giải quyết mọi vấn đề của bạn mọi lúc mọi nơi.</p>
          </div>
        </div>
      </section>
    </>
  );
}
