'use client';

import React, { useState } from 'react';
import { X, Save, Bus, Hash, Users, Palette, Calendar, Fuel, Activity, Wind, Power, Loader2 } from 'lucide-react';
import { guideVehicleService } from '@/services/guide-vehicle.service';

interface VehicleFormModalProps {
  vehicle?: any;
  onClose: () => void;
}

export function VehicleFormModal({ vehicle, onClose }: VehicleFormModalProps) {
  const isEdit = !!vehicle;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    plate_number: vehicle?.plate_number || '',
    type: vehicle?.type || '',
    capacity: vehicle?.capacity || 0,
    status: vehicle?.status || 'available'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await guideVehicleService.updateVehicle(vehicle.id, formData);
      } else {
        await guideVehicleService.createVehicle(formData);
      }
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      alert('Có lỗi xảy ra khi lưu thông tin phương tiện.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e3a8a]/20 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/20 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white dark:bg-gray-900 dark:border-gray-800 transition-colors">
        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-transparent dark:from-gray-800/50 dark:border-gray-800">
          <div>
            <h2 className="text-3xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight">
              {isEdit ? 'Cấu hình Phương tiện' : 'Thêm Phương tiện Mới'}
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 dark:text-gray-500">
              Thông số kỹ thuật & Vận hành
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar dark:bg-gray-900 transition-colors">
          <form id="vehicle-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Loại xe</label>
              <div className="relative group">
                <Bus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                <input 
                  type="text" 
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  placeholder="Ví dụ: Limousine, Xe 45 chỗ..." 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Biển số xe</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                <input 
                  type="text" 
                  required
                  value={formData.plate_number}
                  onChange={(e) => setFormData({...formData, plate_number: e.target.value})}
                  placeholder="29B-123.45" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Sức chứa (Hành khách)</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                <input 
                  type="number" 
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  placeholder="09" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                />
              </div>
            </div>

            <div className="col-span-2 p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-center justify-between dark:bg-blue-900/20 dark:border-blue-900/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400 dark:border dark:border-gray-700">
                  <Power className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 tracking-tight dark:text-gray-100">Trạng thái sẵn sàng</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest dark:text-gray-500">Cho phép xếp lịch tour</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.status === 'available'} 
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'available' : 'maintenance'})}
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4 dark:border-gray-800 dark:bg-gray-800/30 transition-colors">
          <button 
            onClick={onClose} 
            className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-full font-black text-sm hover:border-gray-200 hover:bg-gray-50 transition-all active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:border-gray-600"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            form="vehicle-form"
            disabled={loading}
            className="px-10 py-4 bg-[#1e3a8a] text-white rounded-full font-black text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Lưu cấu hình' : 'Thêm mới'}
          </button>
        </div>
      </div>
    </div>
  );
}
