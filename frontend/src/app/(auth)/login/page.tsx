'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Chrome, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { decodeToken } from '@/utils/auth';
import { useAuth } from '@/components/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@luxevoyage.vn');
  const [password, setPassword] = useState('admin123');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      
      // Refresh user state in AuthContext
      await refreshUser();
      
      // Decode token to get role
      const decoded = decodeToken(data.access_token);
      const role = decoded?.role || 'user';

      // Redirect based on role
      if (role === 'admin' || role === 'staff') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left side: Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070" 
          alt="Scenic Mountain" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px]"></div>
        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <h1 className="text-6xl font-black tracking-tight mb-4">LuxeVoyage</h1>
          <p className="text-xl font-medium opacity-90 max-w-md leading-relaxed">
            Kiến tạo những hành trình vô tiền khoáng hậu cho những du khách tinh tế. Chuyến phiêu lưu của bạn bắt đầu từ đây.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-blue-50/30">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white p-10 rounded-[32px] shadow-xl shadow-blue-900/5 border border-white">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 mb-8">
              <button className="flex-1 pb-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600 transition-all">
                Đăng nhập
              </button>
              <Link href="/register" className="flex-1 pb-4 text-sm font-bold text-gray-400 hover:text-gray-600 text-center transition-all">
                Đăng ký
              </Link>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ĐỊA CHỈ EMAIL</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="concierge@luxevoyage.com" 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MẬT KHẨU</label>
                  <button type="button" className="text-[10px] font-black text-blue-600 uppercase hover:underline">Quên mật khẩu?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-gray-900"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="remember" className="text-xs font-bold text-gray-500 cursor-pointer">Ghi nhớ đăng nhập</label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative px-4 text-[10px] font-bold text-gray-400 bg-white uppercase tracking-widest">Hoặc tiếp tục với</span>
              </div>

              <button 
                type="button"
                className="w-full py-3.5 bg-white border border-gray-100 text-gray-700 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                Google
              </button>
            </form>
          </div>
          
          <p className="text-center text-[10px] font-medium text-gray-400 leading-relaxed max-w-[280px] mx-auto">
            Bằng cách tiếp tục, bạn đồng ý với <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản dịch vụ</span> & <span className="text-blue-600 cursor-pointer hover:underline">Chính sách bảo mật</span> của LuxeTravel
          </p>
        </div>
      </div>
    </div>
  );
}
