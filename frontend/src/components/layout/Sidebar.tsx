'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  Users,
  ClipboardList,
  Building2,
  Bus,
  UserCog,
  BarChart3,
  Settings,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { settingsService, SystemSettings } from '@/services/settings.service';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: MapPin, label: 'Quản lý Tour', href: '/admin/tours' },
  { icon: Users, label: 'Khách hàng', href: '/admin/customers' },
  { icon: ClipboardList, label: 'Đơn hàng', href: '/admin/orders' },
  { icon: Building2, label: 'Nhà Cung Cấp', href: '/admin/suppliers' },
  { icon: Bus, label: 'HDV/PT', href: '/admin/guides-vehicles' },
  { icon: UserCog, label: 'Nhân sự', href: '/admin/employees' },
  { icon: BarChart3, label: 'Báo cáo', href: '/admin/reports' },
  { icon: Settings, label: 'Cấu hình', href: '/admin/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings', error);
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleSettingsUpdate = () => {
      fetchSettings();
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col dark:bg-gray-900 dark:border-gray-800 transition-colors">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {settings?.logo_url ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-600/10 flex items-center justify-center bg-gray-50">
              <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white font-bold text-sm">
                {settings?.site_name ? settings.site_name.substring(0, 2).toUpperCase() : 'LV'}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-black text-blue-600 text-xl dark:text-blue-500 truncate tracking-tight leading-tight">
              {settings?.site_name || 'LuxeVoyage'}
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] dark:text-gray-500 mt-0.5">
              Hệ Thống Quản Lý Tour
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
