'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Building2, 
  LayoutGrid, 
  Mail, 
  Phone, 
  MapPin, 
  Power, 
  Check, 
  Camera, 
  FileText, 
  Upload, 
  Trash2, 
  Plus,
  Loader2,
  ExternalLink,
  Info,
  User
} from 'lucide-react';
import { uploadService } from '@/services/upload.service';
import { supplierService } from '@/services/supplier.service';
import Image from 'next/image';

interface SupplierFormModalProps {
  onClose: () => void;
  supplier?: any;
}

export function SupplierFormModal({ onClose, supplier }: SupplierFormModalProps) {
  const isEdit = !!supplier;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<'image' | 'contract' | null>(null);
  
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    service_type: supplier?.service_type || '',
    contact_person: supplier?.contact_person || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    notes: supplier?.notes || '',
    image_url: supplier?.image_url || '',
    image_size: supplier?.image_size || 0,
    contract_url: supplier?.contract_url || '',
    contract_size: supplier?.contract_size || 0,
    status: supplier?.status || 'Đang hoạt động'
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const contractInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'contract') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(type);
      const result = await uploadService.uploadFile(file);
      setFormData(prev => ({
        ...prev,
        [type === 'image' ? 'image_url' : 'contract_url']: result.url,
        [type === 'image' ? 'image_size' : 'contract_size']: result.size
      }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Không thể tải tệp lên. Vui lòng thử lại.');
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await supplierService.updateSupplier(supplier.id, formData);
      } else {
        await supplierService.createSupplier(formData);
      }
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      alert('Có lỗi xảy ra khi lưu thông tin nhà cung cấp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-white/20 dark:bg-gray-900 dark:border-gray-800 transition-colors flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {isEdit ? 'Chỉnh sửa Nhà cung cấp' : 'Thêm Nhà Cung Cấp Mới'}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 dark:text-gray-500">Quản lý hệ thống đối tác dịch vụ</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <form id="supplier-form" onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Left Column: Image & Basic Status */}
              <div className="md:col-span-1 space-y-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest ml-2 dark:text-blue-400">Ảnh Poster / Banner</label>
                  <div 
                    onClick={() => imageInputRef.current?.click()}
                    className="relative w-full aspect-[16/9] rounded-[2rem] bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer group hover:border-blue-400 dark:hover:border-blue-500 transition-all overflow-hidden shadow-inner"
                  >
                    {formData.image_url ? (
                      <>
                        <Image src={formData.image_url} alt="Poster" fill className="object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                          <Camera className="w-6 h-6" />
                          Thay đổi poster
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-3 p-6 text-center">
                        {uploading === 'image' ? (
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-sm">
                              <Upload className="w-8 h-8" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">Tải lên Poster quảng bá</span>
                              <span className="text-[10px] text-gray-400 block mt-1 uppercase tracking-tighter">Kích thước gợi ý: 1920x1080</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={imageInputRef} 
                      onChange={(e) => handleFileUpload(e, 'image')} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Trạng thái</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.status === 'Đang hoạt động'} 
                        onChange={(e) => setFormData({...formData, status: e.target.checked ? 'Đang hoạt động' : 'Ngừng hoạt động'})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic dark:text-gray-400 transition-colors">
                    * Nhà cung cấp ở trạng thái hoạt động mới có thể tham gia vào các tour và đơn hàng.
                  </p>
                </div>
              </div>

              {/* Middle & Right Column: Details */}
              <div className="md:col-span-2 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  {/* Tên thương hiệu */}
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 dark:text-gray-500">Tên Thương Hiệu</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="VD: Vinpearl Resort..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Người đại diện */}
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 dark:text-gray-500">Người Đại Diện</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        value={formData.contact_person}
                        onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                        placeholder="Họ và tên người đại diện..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Loại dịch vụ */}
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 dark:text-gray-500">Loại Dịch Vụ</label>
                    <div className="relative group">
                      <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <select 
                        required
                        value={formData.service_type}
                        onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                        className="w-full pl-12 pr-10 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm font-bold text-gray-900 appearance-none cursor-pointer dark:text-white"
                      >
                        <option value="">Chọn loại dịch vụ</option>
                        <option value="Khách sạn">Khách sạn & Nghỉ dưỡng</option>
                        <option value="Vận chuyển">Vận chuyển & Đi lại</option>
                        <option value="Ẩm thực">Ẩm thực & Nhà hàng</option>
                        <option value="Vé tham quan">Vé tham quan & Vui chơi</option>
                      </select>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 dark:text-gray-500">Email Liên Hệ</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="contact@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 dark:text-gray-500">Số Điện Thoại</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+84 901 234 567"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="col-span-2 space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 dark:text-gray-500">Địa Chỉ Văn Phòng</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <textarea
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Nhập địa chỉ đầy đủ của nhà cung cấp..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm font-bold text-gray-900 resize-none dark:text-white"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Service Notes */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest ml-2 dark:text-blue-400">Ghi chú dịch vụ & Ưu đãi</label>
                  <div className="relative group">
                    <Info className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Các dịch vụ đi kèm, mức chiết khấu, hoặc lưu ý đặc biệt khi đặt dịch vụ..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm font-bold text-gray-900 resize-none dark:text-white"
                    ></textarea>
                  </div>
                </div>

                {/* Contract Upload */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest ml-2 dark:text-blue-400">Hợp đồng & Pháp lý (PDF/Image)</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => contractInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800/50 transition-all group"
                    >
                      {uploading === 'contract' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      )}
                      <span className="text-sm font-bold text-gray-500 group-hover:text-blue-600">
                        {formData.contract_url ? 'Thay đổi hợp đồng' : 'Tải lên bản scan hợp đồng'}
                      </span>
                    </button>
                    {formData.contract_url && (
                      <a 
                        href={formData.contract_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-100 transition-all shadow-sm"
                        title="Xem hợp đồng"
                      >
                        <ExternalLink className="w-6 h-6" />
                      </a>
                    )}
                    <input 
                      type="file" 
                      ref={contractInputRef} 
                      onChange={(e) => handleFileUpload(e, 'contract')} 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Buttons */}
        <div className="px-10 py-8 border-t border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-4 text-xs font-black text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            form="supplier-form"
            disabled={loading || !!uploading}
            className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Check className="w-4 h-4 stroke-[3px]" />}
            {isEdit ? 'Cập nhật' : 'Tạo nhà cung cấp'}
          </button>
        </div>
      </div>
    </div>
  );
}
