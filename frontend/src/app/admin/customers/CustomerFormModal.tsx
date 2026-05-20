'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IdCard,
  LayoutGrid,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ChevronRight,
  Camera
} from 'lucide-react';
import { customerService } from '@/services/customer.service';

interface CustomerFormModalProps {
  onClose: () => void;
  customer?: any;
}

export function CustomerFormModal({ onClose, customer }: CustomerFormModalProps) {
  const isEdit = !!customer;
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    full_name: customer?.user?.full_name || '',
    email: customer?.user?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    birthday: customer?.birthday || '',
    gender: customer?.gender || 'Nam',
    type: customer?.type || 'Cá nhân',
    rank: customer?.isVip ? 'Gold' : 'Silver'
  });

  const sections = [
    { id: 'personal', title: 'Thông tin cá nhân', icon: User, desc: 'Tên, ngày sinh & giới tính' },
    { id: 'contact', title: 'Liên hệ & Địa chỉ', icon: Mail, desc: 'Email, SĐT & nơi ở' },
    { id: 'rank', title: 'Phân loại khách', icon: Zap, desc: 'Hạng thành viên & loại khách' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare data for API
      const apiData = {
        ...formData,
        birthday: formData.birthday || null,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
      };

      if (isEdit) {
        await customerService.updateCustomer(customer.id, apiData);
      } else {
        await customerService.createCustomer(apiData);
      }
      onClose();
    } catch (err) {
      console.error('Error saving customer:', err);
      alert('Có lỗi xảy ra khi lưu thông tin khách hàng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 dark:bg-gray-900 border border-white/20 dark:border-gray-800 flex flex-col md:flex-row h-[650px]">

        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-800/50 p-8 border-r border-gray-100 dark:border-gray-800 flex flex-col shrink-0">
          <div className="mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mb-4">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isEdit ? 'Cập nhật hồ sơ' : 'Đăng ký khách mới'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase font-black tracking-widest">Customer Insight</p>
          </div>

          <nav className="flex-1 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${isActive
                      ? 'bg-white dark:bg-gray-800 shadow-md translate-x-2'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-200/50 text-gray-400 dark:bg-gray-700/50'
                    }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {section.title}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{section.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-green-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Hệ thống bảo mật SSL</span>
            </div>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-gray-900">
          {/* Header Action */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <form id="customer-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar scroll-smooth">
            <div className="max-w-xl mx-auto space-y-12 pb-10">

              {/* Section: Personal Information */}
              <div id="personal" className={`space-y-8 transition-all duration-500 ${activeSection === 'personal' ? 'opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'}`}>
                <div className="flex items-center justify-center mb-10">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800 flex flex-col items-center justify-center gap-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-all overflow-hidden">
                      <Camera className="w-6 h-6 text-blue-500" />
                      <span className="text-[10px] font-bold text-blue-500 uppercase">Avatar</span>
                    </div>
                    <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 scale-0 group-hover:scale-100 transition-transform">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="relative group">
                    <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 block ml-1">Họ và Tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Nhập đầy đủ tên khách hàng"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative group">
                      <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 block ml-1">Ngày sinh</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10" />
                        <input
                          type="date"
                          value={formData.birthday ? formData.birthday.split('T')[0] : ''}
                          onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 block ml-1">Giới tính</label>
                      <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-1.5 rounded-2xl flex gap-1">
                        {['Nam', 'Nữ'].map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender })}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${formData.gender === gender
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                              }`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveSection('contact')}
                    className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-4 transition-all"
                  >
                    Tiếp theo
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section: Contact & Address */}
              <div id="contact" className={`space-y-8 transition-all duration-500 ${activeSection === 'contact' ? 'opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'}`}>
                <div className="grid grid-cols-1 gap-8">
                  <div className="relative group">
                    <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 block ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nguyenvana@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 block ml-1">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0901 234 567"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 block ml-1">Địa chỉ</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Số nhà, tên đường, quận/huyện, thành phố..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveSection('personal')}
                    className="text-gray-400 font-bold text-sm hover:text-gray-600 transition-all"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('rank')}
                    className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-4 transition-all"
                  >
                    Tiếp theo
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section: Ranking & Category */}
              <div id="rank" className={`space-y-8 transition-all duration-500 ${activeSection === 'rank' ? 'opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'}`}>
                <div className="grid grid-cols-1 gap-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative group">
                      <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 block ml-1">Loại khách</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white appearance-none"
                      >
                        <option value="Cá nhân">Cá nhân</option>
                        <option value="Doanh nghiệp">Doanh nghiệp</option>
                        <option value="Đoàn thể">Đoàn thể</option>
                      </select>
                    </div>
                    <div className="relative group">
                      <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 block ml-1">Hạng thành viên</label>
                      <select
                        value={formData.rank}
                        onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                        className="w-full px-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white appearance-none"
                      >
                        <option value="Silver">Silver Member</option>
                        <option value="Gold">Gold Member</option>
                        <option value="Platinum">Platinum Member</option>
                        <option value="Diamond">Diamond Member</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-blue-900 dark:text-blue-400 uppercase tracking-tight">Đặc quyền hội viên</h4>
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/60 mt-1 leading-relaxed">
                        Thành viên hạng <span className="font-bold text-blue-600 dark:text-blue-400">{formData.rank}</span> sẽ được hưởng các ưu đãi đặc biệt về giá tour và dịch vụ cao cấp.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveSection('contact')}
                    className="text-gray-400 font-bold text-sm hover:text-gray-600 transition-all"
                  >
                    Quay lại
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Footer Bar */}
          <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 uppercase tracking-widest"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="customer-form"
              disabled={loading}
              className="px-12 py-4 bg-blue-600 rounded-2xl text-xs font-black text-white hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {isEdit ? 'Cập nhật' : 'Hoàn tất đăng ký'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
