'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { customerService } from '@/services/customer.service';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    gender: 'Other'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await customerService.getMe();
        setProfile(data);
        setFormData({
          full_name: data.user?.full_name || '',
          email: data.user?.email || '',
          phone: data.phone || '',
          address: data.address || '',
          birthday: data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '',
          gender: data.gender || 'Other'
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Không thể tải thông tin hồ sơ.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await customerService.updateMe(formData);
      toast.success('Cập nhật hồ sơ thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Header Cover */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute -bottom-16 left-10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2rem] bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-900 overflow-hidden shadow-xl">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name)}&background=2563eb&color=fff&size=200`} 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95 group-hover:scale-110">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="pt-24 px-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Hồ sơ cá nhân</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Quản lý thông tin tài khoản và bảo mật của bạn</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-800">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">{profile?.rank || 'Silver'} Member</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Họ và tên</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-none text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      placeholder="Nhập họ tên của bạn"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative group opacity-60">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={formData.email}
                      readOnly
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl border-none text-sm font-bold text-gray-500 dark:text-gray-500 outline-none cursor-not-allowed"
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-none text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                </div>

                {/* Birthday */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Ngày sinh</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="date" 
                      value={formData.birthday}
                      onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-none text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Địa chỉ</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-none text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
