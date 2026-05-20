'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Shield, 
  Lock, 
  Bell, 
  Globe, 
  Camera, 
  CheckCircle2, 
  LogOut,
  Settings,
  Activity,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { uploadService } from '@/services/upload.service';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'react-hot-toast';

export default function AdminProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('Thông tin cá nhân');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Notification states
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    sms: false,
    promotions: false
  });

  // System states
  const [systemSettings, setSystemSettings] = useState({
    theme: 'light',
    language: 'Tiếng Việt (VN)',
    density: 'Tiêu chuẩn'
  });

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      if (user.settings) {
        if (user.settings.notifications) setNotifications(user.settings.notifications);
        if (user.settings.system) setSystemSettings(user.settings.system);
      }
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading('Đang tải ảnh lên...');

    try {
      const uploadResult = await uploadService.uploadFile(file);
      await authService.updateProfile({
        avatar_url: uploadResult.url
      });
      await refreshUser();
      toast.success('Cập nhật ảnh đại diện thành công!', { id: loadingToast });
    } catch (error: any) {
      console.error('Avatar upload failed:', error);
      toast.error('Tải ảnh lên thất bại: ' + (error.message || 'Lỗi không xác định'), { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      await authService.updateProfile({
        full_name: fullName,
        email: email
      });
      await refreshUser();
      toast.success('Cập nhật thông tin cá nhân thành công!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Cập nhật thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    
    setSaving(true);
    try {
      await authService.updateProfile({
        password: newPassword
      });
      toast.success('Đổi mật khẩu thành công!');
      setNewPassword('');
      setConfirmNewPassword('');
      setCurrentPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Đổi mật khẩu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (updatedPrefs?: any) => {
    const prefs = updatedPrefs || notifications;
    setSaving(true);
    try {
      await authService.updateProfile({
        settings: {
          ...(user?.settings || {}),
          notifications: prefs
        }
      });
      await refreshUser();
      setNotifications(prefs);
      toast.success('Cập nhật cài đặt thông báo thành công!');
    } catch (error: any) {
      toast.error('Cập nhật thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSystem = async (updatedSystem?: any) => {
    const sys = updatedSystem || systemSettings;
    setSaving(true);
    try {
      await authService.updateProfile({
        settings: {
          ...(user?.settings || {}),
          system: sys
        }
      });
      await refreshUser();
      setSystemSettings(sys);
      toast.success('Cập nhật tùy chọn hệ thống thành công!');
    } catch (error: any) {
      toast.error('Cập nhật thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSystem = () => {
    const defaults = {
      theme: 'light',
      language: 'Tiếng Việt (VN)',
      density: 'Tiêu chuẩn'
    };
    handleSaveSystem(defaults);
  };

  const getRoleLabel = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'Quản trị viên cấp cao';
      case 'staff': return 'Nhân viên hệ thống';
      case 'user': return 'Khách hàng';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 animate-in fade-in duration-700 pb-20 transition-colors">
      {/* Header / Hero */}
      <div className="relative h-64 bg-gradient-to-r from-[#1e3a8a] to-blue-600 overflow-hidden dark:from-blue-900 dark:to-indigo-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto px-8 h-full flex items-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[40px] border-8 border-white/20 overflow-hidden shadow-2xl dark:border-white/10 bg-blue-600 flex items-center justify-center">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user?.full_name} className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=random&size=200`} alt={user?.full_name} className="w-full h-full object-cover" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm transition-all animate-in fade-in duration-300">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-2 right-2 p-3 bg-white text-blue-600 rounded-2xl shadow-xl hover:scale-110 transition-all active:scale-95 dark:bg-gray-800 dark:text-blue-400 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-4xl font-black text-white tracking-tight">{user?.full_name || 'Người dùng'}</h1>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-full border border-white/30 uppercase tracking-widest">
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <p className="text-blue-100 font-bold flex items-center gap-2 justify-center md:justify-start">
                <Shield className="w-4 h-4" />
                {getRoleLabel(user?.role)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-8 grid grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-2 dark:bg-gray-900 dark:border-gray-800 transition-colors">
            {[
              { id: 'Thông tin cá nhân', icon: UserIcon },
              { id: 'Mật khẩu & Bảo mật', icon: Lock },
              { id: 'Thông báo', icon: Bell },
              { id: 'Tùy chọn hệ thống', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.id}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
              <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm text-red-500 hover:bg-red-50 transition-all dark:hover:bg-red-900/20">
                <LogOut className="w-5 h-5" />
                Đăng xuất tài khoản
              </button>
            </div>
          </div>

          <div className="mt-8 bg-blue-50/50 rounded-[40px] p-8 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-black text-blue-900 uppercase tracking-widest dark:text-blue-400">Trạng thái tài khoản</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-blue-700/60 dark:text-blue-400/60">Xác thực:</span>
                <span className="font-black text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã xác minh
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-blue-700/60 dark:text-blue-400/60">Gia nhập:</span>
                <span className="font-black text-blue-900 dark:text-blue-300">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 min-h-[600px] dark:bg-gray-900 dark:border-gray-800 transition-colors">
            {activeTab === 'Thông tin cá nhân' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">HỌ VÀ TÊN</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800/50 dark:focus:border-blue-500" 
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">EMAIL CÔNG VIỆC</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800/50 dark:focus:border-blue-500" 
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">SỐ ĐIỆN THOẠI</label>
                    <input 
                      type="text" 
                      placeholder="Chưa cập nhật"
                      className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800/50 dark:focus:border-blue-500" 
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">VỊ TRÍ</label>
                    <input 
                      type="text" 
                      placeholder="Việt Nam"
                      className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800/50 dark:focus:border-blue-500" 
                    />
                  </div>
                </div>
                <div className="pt-8 flex justify-end">
                  <button 
                    onClick={handleSaveInfo}
                    disabled={saving}
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Mật khẩu & Bảo mật' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xl font-black">Thay đổi mật khẩu</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">MẬT KHẨU HIỆN TẠI</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800/50 dark:focus:border-blue-500" 
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors dark:text-gray-500 dark:hover:text-blue-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">MẬT KHẨU MỚI</label>
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800/50 dark:focus:border-blue-500" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">XÁC NHẬN MẬT KHẨU MỚI</label>
                        <input 
                          type="password" 
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-gray-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800/50 dark:focus:border-blue-500" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={handleSavePassword}
                      disabled={saving}
                      className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                      Lưu mật khẩu mới
                    </button>
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-100 dark:border-gray-800 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                      <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h3 className="text-lg font-black">Xác thực 2 lớp (2FA)</h3>
                        <p className="text-xs text-gray-400 font-bold dark:text-gray-500">Tăng cường bảo mật cho tài khoản của bạn</p>
                      </div>
                    </div>
                    <button className="px-6 py-2.5 bg-green-50 text-green-600 rounded-xl text-xs font-black hover:bg-green-100 transition-all border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
                      Đã kích hoạt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Thông báo' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xl font-black">Cài đặt thông báo</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { key: 'email', title: 'Email thông báo', desc: 'Nhận báo cáo ngày và cập nhật đơn hàng qua email.' },
                      { key: 'browser', title: 'Thông báo trình duyệt', desc: 'Hiển thị thông báo đẩy khi có sự kiện mới.' },
                      { key: 'sms', title: 'Tin nhắn SMS', desc: 'Nhận cảnh báo bảo mật và đơn hàng khẩn cấp qua điện thoại.' },
                      { key: 'promotions', title: 'Ưu đãi & Khuyến mãi', desc: 'Cập nhật các chương trình mới từ hệ thống.' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-transparent hover:border-blue-100 transition-all dark:bg-gray-800/50 dark:hover:border-blue-900/50">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-gray-900 dark:text-gray-100">{item.title}</p>
                          <p className="text-xs text-gray-400 font-bold dark:text-gray-500">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => {
                            const newPrefs = { ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] };
                            setNotifications(newPrefs);
                          }}
                          className={`w-12 h-6 rounded-full transition-all relative ${notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => handleSaveNotifications()}
                    disabled={saving}
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Lưu cài đặt thông báo
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Tùy chọn hệ thống' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xl font-black">Tùy chỉnh giao diện</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">GIAO DIỆN CHỦ ĐẠO</label>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setSystemSettings({...systemSettings, theme: 'light'})}
                          className={`flex-1 py-3 border-2 rounded-xl text-xs font-black transition-all ${systemSettings.theme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400' : 'border-gray-100 text-gray-400 dark:border-gray-800'}`}
                        >
                          Sáng
                        </button>
                        <button 
                          onClick={() => setSystemSettings({...systemSettings, theme: 'dark'})}
                          className={`flex-1 py-3 border-2 rounded-xl text-xs font-black transition-all ${systemSettings.theme === 'dark' ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400' : 'border-gray-100 text-gray-400 dark:border-gray-800'}`}
                        >
                          Tối
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">NGÔN NGỮ</label>
                      <select 
                        value={systemSettings.language}
                        onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
                        className="w-full px-6 py-3.5 bg-gray-100/50 border border-transparent rounded-2xl outline-none font-bold text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <option>Tiếng Việt (VN)</option>
                        <option>English (US)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-100 dark:border-gray-800 space-y-6">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">MẬT ĐỘ HIỂN THỊ</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Rộng rãi', 'Tiêu chuẩn', 'Gọn gàng'].map((density) => (
                      <button 
                        key={density} 
                        onClick={() => setSystemSettings({...systemSettings, density})}
                        className={`py-4 border-2 rounded-2xl text-xs font-black transition-all ${
                        systemSettings.density === density ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400' : 'border-gray-50 text-gray-400 hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700'
                      }`}>
                        {density}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex justify-between items-center">
                  <button 
                    onClick={handleResetSystem}
                    className="text-xs font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest"
                  >
                    Cài đặt mặc định
                  </button>
                  <button 
                    onClick={() => handleSaveSystem()}
                    disabled={saving}
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Lưu tùy chọn
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
