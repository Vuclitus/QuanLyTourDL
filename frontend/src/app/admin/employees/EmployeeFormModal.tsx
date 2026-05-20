'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Briefcase, Camera, ChevronDown, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { employeeService } from '@/services/employee.service';
import { toast } from 'react-hot-toast';

interface EmployeeFormModalProps {
  employee?: any;
  onClose: (refresh?: boolean) => void;
}

export function EmployeeFormModal({ employee, onClose }: EmployeeFormModalProps) {
  const isEdit = !!employee;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: employee?.user?.full_name || '',
    email: employee?.user?.email || '',
    phone: employee?.phone || '',
    position: employee?.position || 'Nhân viên',
    department: employee?.department || 'Sales',
    status: employee?.status || 'Đang làm việc',
    image_url: employee?.image_url || '',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tours') // Using existing 'tours' bucket for simplicity if employee bucket doesn't exist
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tours')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Tải ảnh lên thành công!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Lỗi khi tải ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await employeeService.updateEmployee(employee.id, formData);
        toast.success('Cập nhật nhân sự thành công!');
      } else {
        await employeeService.createEmployee(formData);
        toast.success('Thêm nhân sự mới thành công!');
      }
      onClose(true);
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast.error(error.response?.data?.detail || 'Lỗi khi lưu thông tin nhân sự');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors">
        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between dark:border-gray-800">
          <h2 className="text-2xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight">
            {isEdit ? 'Chỉnh sửa thông tin nhân sự' : 'Thêm nhân sự mới'}
          </h2>
          <button 
            onClick={() => onClose()} 
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="p-10 space-y-10 dark:bg-gray-900 transition-colors max-h-[70vh] overflow-y-auto">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">Ảnh đại diện</p>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Định dạng JPG, PNG. Kích thước tối đa 5MB.</p>
                <label className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 cursor-pointer">
                  {uploading ? 'Đang tải...' : 'Tải ảnh mới'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-8">
              <div className="col-span-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Nguyễn Văn An" 
                  className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-800 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="an.nguyen@luxevoyage.com" 
                  className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-800 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Số điện thoại</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="0901234567" 
                  className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-800 dark:focus:border-blue-500 dark:placeholder-gray-600" 
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">
                  Chức vụ <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <select 
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 appearance-none cursor-pointer dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-800 dark:focus:border-blue-500"
                  >
                    <option value="Nhân viên">Nhân viên</option>
                    <option value="Quản trị viên">Quản trị viên</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform dark:text-gray-600" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 dark:text-gray-500">Trạng thái</label>
                <div className="relative group">
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 appearance-none cursor-pointer dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-800 dark:focus:border-blue-500"
                  >
                    <option value="Đang làm việc">Đang làm việc</option>
                    <option value="Nghỉ phép">Nghỉ phép</option>
                    <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform dark:text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-4 dark:border-gray-800 dark:bg-gray-800/30 transition-colors">
            <button 
              type="button"
              onClick={() => onClose()} 
              className="px-10 py-3.5 bg-gray-200 text-gray-700 rounded-xl font-black text-sm hover:bg-gray-300 transition-all active:scale-95 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              type="submit"
              disabled={loading || uploading}
              className="px-10 py-3.5 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? 'Lưu thay đổi' : 'Thêm nhân sự'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
