'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, UserCircle, Calendar } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { customerService } from '@/services/customer.service';
import AIChatBubble from '@/components/AIChatBubble';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    if (auth === 'true') {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await authService.getCurrentUser();
      setUserData(user);
      const customer = await customerService.getMe();
      setCustomerData(customer);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserData(null);
    setCustomerData(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">LuxeVoyage</Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-bold hover:text-blue-600 transition-colors">Trang chủ</Link>
              <Link href="/tours" className="text-sm font-bold hover:text-blue-600 transition-colors">Tour</Link>
              <Link href="/feedback" className="text-sm font-bold hover:text-blue-600 transition-colors">Feedback</Link>
              <Link href="/contact" className="text-sm font-bold hover:text-blue-600 transition-colors">Liên hệ</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn && userData ? (
              <div className="relative group">
                <button className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-100">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/20 overflow-hidden">
                    {userData.avatar_url ? (
                      <img src={userData.avatar_url} alt={userData.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden md:block text-left pr-2">
                    <p className="text-xs font-bold text-gray-900 leading-tight">{userData.full_name || 'Khách hàng'}</p>
                    <p className="text-[10px] text-gray-400 leading-tight">
                      {customerData?.rank ? `Hạng ${customerData.rank}` : 'Khách hàng mới'}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden py-2">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-black text-gray-900">{userData.full_name || 'Khách hàng'}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{userData.email}</p>
                    </div>
                    <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                      <UserCircle className="w-4 h-4" />
                      Hồ sơ của tôi
                    </Link>
                    <Link href="/my-bookings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                      <Calendar className="w-4 h-4" />
                      Chuyến đi của tôi
                    </Link>

                    <div className="h-px bg-gray-50 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 px-4 transition-colors">Đăng nhập</Link>
                <Link href="/register" className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-blue-600">LuxeVoyage</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">© 2026 LuxeVoyage. Đẳng cấp lữ hành thượng lưu.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Khám Phá</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-500">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/tours" className="hover:text-blue-600 transition-colors">Các điểm đến</Link></li>
              <li><Link href="/tours?sort=newest" className="hover:text-blue-600 transition-colors">Tour mới nhất</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Pháp Lý</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-500">
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Hỗ Trợ</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-500">
              <li><Link href="/feedback" className="hover:text-blue-600 transition-colors">Góp ý dịch vụ</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Liên hệ hỗ trợ</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600 transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
        </div>
      </footer>
      <AIChatBubble mode="client" />
    </div>
  );
}
