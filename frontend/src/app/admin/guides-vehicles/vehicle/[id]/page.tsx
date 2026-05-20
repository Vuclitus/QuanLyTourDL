'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Settings, 
  Wrench, 
  Calendar, 
  MapPin, 
  Users, 
  Bus, 
  Fuel, 
  ShieldCheck, 
  Activity,
  Wifi,
  Wind,
  Tv,
  Coffee,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronDown,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Clock,
  History,
  FileText,
  DollarSign,
  User as UserIcon,
  Zap,
  Loader2
} from 'lucide-react';

import { VehicleFormModal } from '../../VehicleFormModal';
import { guideVehicleService } from '@/services/guide-vehicle.service';

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const vehicleId = parseInt(resolvedParams.id);

  const [vehicle, setVehicle] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Thông tin chung');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [vehicleId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehicleData, toursData] = await Promise.all([
        guideVehicleService.getVehicleById(vehicleId),
        guideVehicleService.getVehicleTours(vehicleId)
      ]);
      setVehicle(vehicleData);
      setTours(toursData);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicle data:', err);
      setError('Không thể tải thông tin phương tiện.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 dark:bg-gray-950 transition-colors">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Đang tải thông số phương tiện...</p>
      </div>
    );
  }

  if (error || !vehicle) {
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

  const amenities = [
    { name: 'WiFi Tốc độ cao', icon: Wifi },
    { name: 'Điều hòa 2 chiều', icon: Wind },
    { name: 'Màn hình LCD 21"', icon: Tv },
    { name: 'Tủ lạnh mini', icon: Coffee },
    { name: 'Định vị GPS', icon: Navigation },
    { name: 'Cổng sạc USB', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6]/30 dark:bg-gray-950 pb-20 animate-in fade-in duration-500 transition-colors">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800 transition-colors">
        <div className="flex items-center gap-4">
          <Link href="/admin/guides-vehicles" className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-900 dark:text-white">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight transition-colors">Chi tiết Phương tiện</h1>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest dark:bg-blue-900/20 dark:text-blue-400">
              ID: {vehicle.id}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-100 rounded-full text-sm font-black text-gray-700 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/50 dark:hover:text-blue-400"
          >
            <Settings className="w-4 h-4" />
            Cấu hình
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/40 active:scale-95">
            <Wrench className="w-4 h-4" />
            Lịch bảo trì
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-8 space-y-8">
        {/* Vehicle Hero Card */}
        <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-7 relative h-[400px] lg:h-auto bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {/* Default Image for Vehicles */}
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200" 
                alt={vehicle.type} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>
            <div className="col-span-12 lg:col-span-5 p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                    vehicle.status === 'available' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>
                    {vehicle.status === 'available' ? 'Sẵn sàng' : 'Đang bảo trì'}
                  </span>
                  <span className="px-4 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-black rounded-full tracking-widest uppercase dark:bg-gray-800 dark:text-gray-500">
                    Vận tải đường bộ
                  </span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight dark:text-white transition-colors">
                  {vehicle.type || 'Chưa cập nhật loại xe'}
                </h2>
                <p className="text-3xl font-black text-blue-600 tracking-wider dark:text-blue-400 transition-colors uppercase">
                  {vehicle.plate_number}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 dark:text-gray-500">Sức chứa</p>
                  <p className="text-lg font-black text-gray-900 flex items-center gap-2 dark:text-white">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    {vehicle.capacity} Chỗ
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 dark:text-gray-500">Nhiên liệu</p>
                  <p className="text-lg font-black text-gray-900 flex items-center gap-2 dark:text-white">
                    <Fuel className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Diesel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Tab Nav */}
            <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 transition-colors">
              {['Thông tin chung', 'Lịch trình vận hành', 'Bảo trì & Sửa chữa'].map((tab) => (
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

            {/* Content Areas */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'Thông tin chung' && (
                <div className="space-y-8">
                  <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors text-center py-20">
                    <Bus className="w-16 h-16 text-gray-200 mx-auto mb-6 dark:text-gray-700" />
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Dữ liệu thông số kỹ thuật</h3>
                    <p className="text-gray-500">Các thông tin kỹ thuật chi tiết đang được cập nhật từ bộ phận kỹ thuật.</p>
                  </div>

                  <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
                    <h3 className="text-2xl font-black text-[#1e3a8a] tracking-tight mb-8 dark:text-blue-400 transition-colors">Trang thiết bị & Tiện nghi</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {amenities.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl group hover:bg-blue-50 hover:border-blue-100 dark:bg-gray-800/50 dark:border-gray-800 dark:hover:bg-blue-900/20 dark:hover:border-blue-900/30 transition-all">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform dark:bg-gray-900 dark:text-blue-400 dark:shadow-none">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-black text-gray-700 dark:text-gray-300 transition-colors">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Lịch trình vận hành' && (
                 <div className="bg-white p-20 rounded-[40px] text-center border border-dashed border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-colors">
                   <History className="w-16 h-16 text-gray-300 mx-auto mb-6 dark:text-gray-700" />
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Tính năng đang phát triển</h3>
                   <p className="text-gray-500">Dữ liệu hành trình cho phương tiện này đang được đồng bộ hóa.</p>
                 </div>
              )}

              {activeTab === 'Bảo trì & Sửa chữa' && (
                 <div className="bg-white p-20 rounded-[40px] text-center border border-dashed border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-colors">
                   <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-6 dark:text-gray-700" />
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Chưa có lịch sử bảo trì</h3>
                   <p className="text-gray-500">Hệ thống chưa ghi nhận lần bảo trì nào cho phương tiện này trong hệ thống mới.</p>
                 </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-[#1e3a8a] rounded-[40px] p-10 shadow-2xl shadow-blue-900/20 text-white space-y-10 dark:bg-blue-900/40 dark:shadow-none transition-colors">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-400" />
                Vận hành
              </h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 dark:text-blue-400/60">TỔNG CHUYẾN ĐI</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black tracking-tighter">0</span>
                    <span className="text-sm font-bold text-blue-300 mb-1 dark:text-blue-400/60">chuyến kể từ khi đăng ký</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-8 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight dark:text-white transition-colors">Bảo trì định kỳ</h3>
                <span className="p-2 bg-green-50 text-green-600 rounded-xl dark:bg-green-900/20 dark:text-green-400 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              </div>
              <p className="text-xs font-bold text-gray-500 leading-relaxed dark:text-gray-400">Phương tiện hiện đang trong tình trạng tốt và chưa đến hạn bảo trì định kỳ tiếp theo.</p>
              <button className="w-full py-4 bg-gray-900 text-white rounded-full font-black text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10 dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-blue-600/20">
                Lên lịch kiểm tra
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <VehicleFormModal 
          vehicle={vehicle} 
          onClose={() => {
            setIsEditModalOpen(false);
            fetchData();
          }} 
        />
      )}
    </div>
  );
}
