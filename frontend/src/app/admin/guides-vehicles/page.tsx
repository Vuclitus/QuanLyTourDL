'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Bus, 
  UserCheck, 
  Wrench, 
  CheckCircle2,
  Clock, 
  Eye,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { GuideFormModal } from './GuideFormModal';
import { VehicleFormModal } from './VehicleFormModal';
import { guideVehicleService } from '@/services/guide-vehicle.service';

export default function GuidesVehiclesPage() {
  const [activeTab, setActiveTab] = useState<'guides' | 'vehicles'>('guides');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [guides, setGuides] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'guides') {
        const data = await guideVehicleService.getGuides();
        setGuides(data);
      } else {
        const data = await guideVehicleService.getVehicles();
        setVehicles(data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, type: 'guide' | 'vehicle') => {
    if (confirm(`Bạn có chắc muốn xóa ${type === 'guide' ? 'hướng dẫn viên' : 'phương tiện'} này?`)) {
      try {
        if (type === 'guide') {
          await guideVehicleService.deleteGuide(id);
        } else {
          await guideVehicleService.deleteVehicle(id);
        }
        fetchData();
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Quản lý Hướng dẫn viên & Phương tiện</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Quản lý danh sách, trạng thái và lịch trình của đội ngũ.</p>
        </div>
        <button 
          onClick={() => activeTab === 'guides' ? setIsGuideModalOpen(true) : setIsVehicleModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'guides' ? 'Thêm Hướng dẫn viên' : 'Thêm phương tiện'}
        </button>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button 
          onClick={() => setActiveTab('guides')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'guides' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          Hướng dẫn viên
        </button>
        <button 
          onClick={() => setActiveTab('vehicles')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'vehicles' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          Phương tiện
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
            <AlertCircle className="w-10 h-10" />
            <p>{error}</p>
            <button onClick={fetchData} className="text-blue-600 hover:underline">Thử lại</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
                  {activeTab === 'guides' ? (
                    <>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-400">Hướng dẫn viên</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-400">Số thẻ HDV</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-400">Ngôn ngữ</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-400">Đánh giá</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-400">Biển số</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-400">Loại xe</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-400">Sức chứa</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center dark:text-gray-400">Trạng thái</th>
                    </>
                  )}
                  <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right dark:text-gray-400">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {activeTab === 'guides' ? (
                  guides.length === 0 ? (
                    <tr><td colSpan={5} className="py-10 text-center text-gray-500">Không có dữ liệu</td></tr>
                  ) : guides.map((guide) => (
                    <tr key={guide.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-white dark:border-gray-800 dark:bg-gray-800 relative">
                            {guide.image_url ? (
                              <img src={guide.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <UserCheck className="w-5 h-5 absolute inset-0 m-auto text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{guide.full_name || 'N/A'}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {guide.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-200">{guide.license_number}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{guide.languages?.join(', ') || 'N/A'}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{guide.rating} / 5.0</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/guides-vehicles/guide/${guide.id}`} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(guide.id, 'guide')} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                            title="Xóa hướng dẫn viên"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  vehicles.length === 0 ? (
                    <tr><td colSpan={5} className="py-10 text-center text-gray-500">Không có dữ liệu</td></tr>
                  ) : vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900 dark:text-gray-100">{vehicle.plate_number}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400 uppercase">{vehicle.type}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{vehicle.capacity} chỗ</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/guides-vehicles/vehicle/${vehicle.id}`} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(vehicle.id, 'vehicle')} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                            title="Xóa phương tiện"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isGuideModalOpen && <GuideFormModal onClose={() => { setIsGuideModalOpen(false); fetchData(); }} />}
      {isVehicleModalOpen && <VehicleFormModal onClose={() => { setIsVehicleModalOpen(false); fetchData(); }} />}
    </div>
  );
}
