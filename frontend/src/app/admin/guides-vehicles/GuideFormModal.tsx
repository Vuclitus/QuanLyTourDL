'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Briefcase, 
  Globe, 
  Save, 
  Award, 
  Power, 
  Mail, 
  Star, 
  MapPin,
  Camera,
  Loader2,
  Check
} from 'lucide-react';
import { uploadService } from '@/services/upload.service';
import { guideVehicleService } from '@/services/guide-vehicle.service';
import Image from 'next/image';

interface GuideFormModalProps {
  guide?: any;
  onClose: () => void;
}

export function GuideFormModal({ guide, onClose }: GuideFormModalProps) {
  const isEdit = !!guide;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: guide?.full_name || '',
    email: guide?.email || '',
    phone: guide?.phone || '',
    image_url: guide?.image_url || '',
    license_number: guide?.license_number || '',
    languages: guide?.languages || [],
    experience: guide?.experience || '',
    certificates: guide?.certificates || '',
    rating: guide?.rating || 5.0,
    status: guide?.status || 'Sẵn sàng'
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadService.uploadFile(file);
      setFormData(prev => ({ ...prev, image_url: result.url }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Không thể tải ảnh lên.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await guideVehicleService.updateGuide(guide.id, formData);
      } else {
        await guideVehicleService.createGuide(formData);
      }
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      alert('Có lỗi xảy ra khi lưu thông tin.');
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
              {isEdit ? 'Cập nhật hồ sơ' : 'Thêm Hướng dẫn viên'}
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 dark:text-gray-500">
              Quản lý thông tin nhân sự & chuyên môn
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
        <div className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar dark:bg-gray-900 transition-colors">
          <form id="guide-form" onSubmit={handleSubmit} className="space-y-10">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-32 h-32 rounded-full bg-gray-50 border-4 border-white shadow-xl overflow-hidden cursor-pointer group dark:bg-gray-800 dark:border-gray-700"
              >
                {formData.image_url ? (
                  <Image src={formData.image_url} alt="Avatar" fill className="object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    {uploading ? <Loader2 className="w-8 h-8 animate-spin text-blue-600" /> : <Camera className="w-8 h-8" />}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase">
                  Thay đổi ảnh
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>

            {/* Section: Personal Info */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 dark:text-blue-400">
                <User className="w-4 h-4" /> Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Họ và tên</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                    <input 
                      type="text" 
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      placeholder="Nguyễn Văn A" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Số điện thoại</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+84 90 123 4567" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="name@luxevoyage.com" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Professional Info */}
            <div className="space-y-6 pt-4">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 dark:text-blue-400">
                <Award className="w-4 h-4" /> Năng lực chuyên môn
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Số thẻ HDV</label>
                  <div className="relative group">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                    <input 
                      type="text" 
                      value={formData.license_number}
                      onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                      placeholder="VD: 123456789" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Kinh nghiệm công tác</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                    <input 
                      type="text" 
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      placeholder="VD: 5 năm chuyên tuyến..." 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Ngôn ngữ (phân cách dấu phẩy)</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                    <input 
                      type="text" 
                      value={formData.languages.join(', ')}
                      onChange={(e) => setFormData({...formData, languages: e.target.value.split(',').map(l => l.trim()).filter(l => l !== '')})}
                      placeholder="Tiếng Anh, Tiếng Nhật..." 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Chứng chỉ & Bằng cấp</label>
                  <div className="relative group">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors dark:text-gray-600 dark:group-focus-within:text-blue-400" />
                    <input 
                      type="text" 
                      value={formData.certificates}
                      onChange={(e) => setFormData({...formData, certificates: e.target.value})}
                      placeholder="Thẻ HDV Quốc tế, Chứng chỉ Sơ cấp cứu..." 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-800/50 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Operational Status */}
            <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-center justify-between dark:bg-blue-900/20 dark:border-blue-900/30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400 dark:border dark:border-gray-700">
                  <Power className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-base font-black text-gray-900 tracking-tight dark:text-gray-100">Kích hoạt trạng thái vận hành</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest dark:text-gray-500">Cho phép xếp lịch dẫn tour ngay lập tức</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.status === 'Sẵn sàng'} 
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'Sẵn sàng' : 'Nghỉ phép'})}
                />
                <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600"></div>
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
            form="guide-form"
            disabled={loading || uploading}
            className="px-10 py-4 bg-[#1e3a8a] text-white rounded-full font-black text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </div>
    </div>
  );
}
