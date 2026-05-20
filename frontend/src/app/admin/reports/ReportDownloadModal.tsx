'use client';

import React from 'react';
import { X, FileText, Download, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';

interface ReportDownloadModalProps {
  onClose: () => void;
}

export function ReportDownloadModal({ onClose }: ReportDownloadModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors">
        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/30 dark:border-gray-800 transition-colors">
          <div>
            <h2 className="text-2xl font-black text-[#1e3a8a] dark:text-blue-400 tracking-tight">Xuất báo cáo hệ thống</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 dark:text-gray-500">LuxeVoyage Administration</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 space-y-8 dark:bg-gray-900 transition-colors">
          {/* Report Type */}
          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">LOẠI BÁO CÁO</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'revenue', name: 'Doanh thu & Lợi nhuận', icon: FileText },
                { id: 'tours', name: 'Hiệu suất Tour', icon: FileText },
                { id: 'customers', name: 'Dữ liệu Khách hàng', icon: FileText },
                { id: 'staff', name: 'Hiệu quả Nhân sự', icon: FileText },
              ].map((type) => (
                <button 
                  key={type.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 border border-transparent rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all text-left group dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:border-blue-900/50"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform dark:bg-gray-700 dark:text-blue-400">
                    <type.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">KHOẢNG THỜI GIAN</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                />
              </div>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-800/50" 
                />
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 dark:text-gray-500">ĐỊNH DẠNG TỆP</label>
            <div className="flex gap-4">
              {['Excel (.xlsx)', 'PDF (.pdf)', 'CSV (.csv)'].map((format, i) => (
                <label key={i} className="flex-1 cursor-pointer">
                  <input type="radio" name="format" className="sr-only peer" defaultChecked={i === 0} />
                  <div className="py-3 px-4 border-2 border-gray-100 rounded-xl text-center text-xs font-black text-gray-400 peer-checked:border-blue-600 peer-checked:text-blue-600 peer-checked:bg-blue-50 transition-all dark:border-gray-800 dark:text-gray-500 dark:peer-checked:border-blue-500 dark:peer-checked:text-blue-400 dark:peer-checked:bg-blue-900/20">
                    {format}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-4 dark:border-gray-800 dark:bg-gray-800/30 transition-colors">
          <button 
            onClick={onClose} 
            className="px-10 py-3.5 text-gray-500 font-black text-sm hover:text-gray-900 transition-all dark:text-gray-500 dark:hover:text-gray-300"
          >
            Hủy bỏ
          </button>
          <button className="px-12 py-3.5 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Tải báo cáo ngay
          </button>
        </div>
      </div>
    </div>
  );
}
