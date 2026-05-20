'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  History, 
  Puzzle, 
  Save, 
  UploadCloud, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Clock, 
  Database, 
  Download, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  CreditCard,
  Loader2,
  User as UserIcon,
  Plus as PlusIcon
} from 'lucide-react';
import { settingsService, SystemSettings } from '@/services/settings.service';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'backup' | 'integration'>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (error) {
        toast.error('Không thể tải cấu hình hệ thống.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      toast.success('Đã lưu cấu hình hệ thống!');
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
    } catch (error) {
      toast.error('Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await settingsService.uploadLogo(file);
      setSettings(prev => prev ? { ...prev, logo_url: res.url } : null);
      toast.success('Đã tải logo lên Supabase!');
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
    } catch (error) {
      toast.error('Tải lên thất bại.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Cấu hình hệ thống</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Quản lý các thông số cốt lõi của nền tảng LuxeVoyage.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu thay đổi
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'}`}
        >
          <Settings className="w-4 h-4" />
          Cấu hình chung
        </button>
        <button 
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'backup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'}`}
        >
          <History className="w-4 h-4" />
          Sao lưu & Nhật ký
        </button>
        <button 
          onClick={() => setActiveTab('integration')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'integration' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'}`}
        >
          <Puzzle className="w-4 h-4" />
          Tích hợp
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-500">
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Branding Section */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8 dark:bg-gray-900 dark:border-gray-800 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thông tin thương hiệu</h3>
                <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Logo và các thông tin liên hệ chính thức của doanh nghiệp.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-12">
                {/* Logo Upload */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">LOGO HỆ THỐNG</label>
                  <div 
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="w-64 h-40 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/10 overflow-hidden"
                  >
                    {settings.logo_url ? (
                      <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain p-4" />
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-white shadow-sm text-blue-600 group-hover:scale-110 transition-transform dark:bg-gray-700 dark:text-blue-400">
                          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                        </div>
                        <p className="text-xs font-bold text-blue-600 mt-3 dark:text-blue-400">{uploading ? 'Đang tải...' : 'Nhấn để tải lên'}</p>
                        <p className="text-[10px] text-gray-400 mt-1 dark:text-gray-500">PNG, JPG, SVG (Tối đa 2MB)</p>
                      </>
                    )}
                    <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </div>
                </div>

                {/* Info Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">TÊN HỆ THỐNG</label>
                    <input 
                      type="text" 
                      value={settings.site_name} 
                      onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">EMAIL LIÊN HỆ</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <input 
                        type="email" 
                        value={settings.contact_email} 
                        onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">SỐ ĐIỆN THOẠI</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <input 
                        type="text" 
                        value={settings.contact_phone} 
                        onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">ĐỊA CHỈ TRỤ SỞ</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <input 
                        type="text" 
                        value={settings.address} 
                        onChange={(e) => setSettings({...settings, address: e.target.value})}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Region Section */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 dark:bg-gray-900 dark:border-gray-800 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Khu vực & Ngôn ngữ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">MÚI GIỜ</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <select 
                      value={settings.timezone}
                      onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium bg-white cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                    >
                      <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                      <option>(GMT+08:00) Singapore, Beijing</option>
                      <option>(GMT+00:00) London, UTC</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">NGÔN NGỮ MẶC ĐỊNH</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <select 
                      value={settings.default_language}
                      onChange={(e) => setSettings({...settings, default_language: e.target.value})}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium bg-white cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                    >
                      <option>Tiếng Việt</option>
                      <option>English (US)</option>
                      <option>Français</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Backup List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col dark:bg-gray-900 dark:border-gray-800 transition-colors">
              <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sao lưu hệ thống</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium dark:text-gray-400">Quản lý và khôi phục các điểm sao lưu dữ liệu.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95">
                  <PlusIcon className="w-3.5 h-3.5" />
                  Tạo bản sao lưu mới
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-500">Tên file</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center dark:text-gray-500">Ngày tạo</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center dark:text-gray-500">Dung lượng</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right dark:text-gray-500">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {[
                      { name: 'system_backup_v2.1.tar.gz', date: '24/10/2023 10:00', size: '1.2 GB' },
                      { name: 'db_dump_daily_2310.sql', date: '23/10/2023 00:00', size: '450 MB' },
                      { name: 'system_backup_v2.0.tar.gz', date: '15/10/2023 10:00', size: '1.1 GB' },
                    ].map((file, i) => (
                      <tr key={i} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{file.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center text-xs font-medium text-gray-600 dark:text-gray-400">{file.date}</td>
                        <td className="py-4 px-6 text-center text-xs font-bold text-gray-900 dark:text-gray-300">{file.size}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition-all" title="Tải xuống"><Download className="w-4 h-4" /></button>
                            <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 dark:hover:text-amber-400 rounded-lg transition-all" title="Khôi phục"><RotateCcw className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logs List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full dark:bg-gray-900 dark:border-gray-800 transition-colors">
              <div className="p-6 border-b border-gray-50 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Nhật ký hoạt động
                </h3>
              </div>
              <div className="p-6 space-y-6 flex-1 overflow-auto">
                {[
                  { time: '10:05 Hôm nay', title: 'Cập nhật cấu hình email SMTP', user: 'Admin', status: 'success' },
                  { time: '09:30 Hôm nay', title: "Xóa người dùng 'test_user_01'", user: 'Admin', status: 'success' },
                  { time: '08:15 Hôm nay', title: 'Đăng nhập thất bại (Sai mật khẩu)', user: 'System (IP: 192.168.1.45)', status: 'fail' },
                  { time: '23:00 Hôm qua', title: 'Tạo bản sao lưu tự động (db_dump)', user: 'CronJob', status: 'success' },
                ].map((log, i) => (
                  <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800 last:before:hidden">
                    <div className={`absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter dark:text-gray-500">{log.time}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${log.status === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {log.status === 'success' ? 'Thành công' : 'Thất bại'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 mt-1">{log.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 flex items-center gap-1"><UserIcon className="w-3 h-3" /> {log.user}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 text-center border-t border-gray-50 dark:border-gray-800">
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Xem tất cả nhật ký</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integration' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMTP Config */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8 dark:bg-gray-900 dark:border-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cấu hình Email (SMTP)</h3>
                  <p className="text-xs text-gray-500 font-medium dark:text-gray-400">Kết nối email để gửi thông báo tự động.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">SMTP HOST</label>
                    <input 
                      type="text" 
                      value={settings.smtp_host} 
                      onChange={(e) => setSettings({...settings, smtp_host: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">SMTP PORT</label>
                    <input 
                      type="number" 
                      value={settings.smtp_port} 
                      onChange={(e) => setSettings({...settings, smtp_port: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-center dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">USERNAME / EMAIL</label>
                  <input 
                    type="email" 
                    value={settings.smtp_user || ''} 
                    onChange={(e) => setSettings({...settings, smtp_user: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">PASSWORD / APP PASSWORD</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={settings.smtp_password || ''} 
                      onChange={(e) => setSettings({...settings, smtp_password: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Gửi email thử nghiệm
                </button>
              </div>
            </div>

            {/* Payment Gateway */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8 dark:bg-gray-900 dark:border-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cổng Thanh toán</h3>
                  <p className="text-xs text-gray-500 font-medium dark:text-gray-400">Quản lý kết nối các cổng thanh toán trực tuyến.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">LỰA CHỌN CỔNG THANH TOÁN MẶC ĐỊNH</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['VNPay', 'MoMo', 'Stripe'].map((gateway) => (
                      <button 
                        key={gateway} 
                        onClick={() => setSettings({...settings, default_payment_gateway: gateway})}
                        className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${settings.default_payment_gateway === gateway ? 'bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-600 dark:border-blue-600' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-600'}`}
                      >
                        {gateway}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/30 space-y-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Cấu hình VNPay</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1 uppercase tracking-tight">
                      <div className="w-1 h-1 rounded-full bg-green-600 dark:bg-green-400"></div> Đang hoạt động
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-500">VNPAY TMNCODE</label>
                      <input 
                        type="text" 
                        value={settings.vnpay_config.tmn_code} 
                        onChange={(e) => setSettings({...settings, vnpay_config: {...settings.vnpay_config, tmn_code: e.target.value}})}
                        className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium bg-white dark:bg-gray-800 dark:border-blue-900/30 dark:text-gray-200" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-500">HASH SECRET</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          value={settings.vnpay_config.hash_secret} 
                          onChange={(e) => setSettings({...settings, vnpay_config: {...settings.vnpay_config, hash_secret: e.target.value}})}
                          className="w-full pl-4 pr-10 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium bg-white dark:bg-gray-800 dark:border-blue-900/30 dark:text-gray-200" 
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input 
                        type="checkbox" 
                        checked={settings.vnpay_config.is_sandbox} 
                        onChange={(e) => setSettings({...settings, vnpay_config: {...settings.vnpay_config, is_sandbox: e.target.checked}})}
                        className="w-4 h-4 rounded border-blue-300 dark:border-blue-900/50 text-blue-600 focus:ring-blue-500 dark:bg-gray-800" 
                      />
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-400">Chế độ Sandbox (Thử nghiệm)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

