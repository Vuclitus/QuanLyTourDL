'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Download, ChevronLeft, ChevronRight, Hotel, Truck, Utensils, Globe, Eye, Edit, Trash2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { SupplierFormModal } from './SupplierFormModal';
import { supplierService } from '@/services/supplier.service';

export default function SuppliersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Không thể tải danh sách nhà cung cấp.');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'hotel':
      case 'Khách sạn': return Hotel;
      case 'transport':
      case 'Vận chuyển': return Truck;
      case 'food':
      case 'Ẩm thực': return Utensils;
      case 'Vé tham quan': return Sparkles;
      default: return Globe;
    }
  };

  const getServiceLabel = (type: string) => {
    switch (type) {
      case 'hotel':
      case 'Khách sạn': return 'Khách sạn';
      case 'transport':
      case 'Vận chuyển': return 'Vận chuyển';
      case 'food':
      case 'Ẩm thực': return 'Ẩm thực';
      case 'Vé tham quan': return 'Vé tham quan';
      default: return type || 'Khác';
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) {
      try {
        await supplierService.deleteSupplier(id);
        setSuppliers(suppliers.filter(s => s.id !== id));
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa nhà cung cấp.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Quản lý nhà cung cấp</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Danh sách và thông tin đối tác cung cấp dịch vụ.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Thêm nhà cung cấp
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 dark:bg-gray-900 dark:border-gray-800 transition-colors">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Tìm tên nhà cung cấp, dịch vụ..."
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
            <AlertCircle className="w-10 h-10" />
            <p>{error}</p>
            <button onClick={fetchSuppliers} className="text-blue-600 hover:underline">Thử lại</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 dark:bg-gray-800/30 dark:border-gray-800">
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-500">Tên nhà cung cấp</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-500">Loại dịch vụ</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-500">Liên hệ</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-gray-500">Địa chỉ</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right dark:text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {suppliers.length === 0 ? (
                   <tr><td colSpan={5} className="py-10 text-center text-gray-500">Không có dữ liệu</td></tr>
                ) : (
                  suppliers.map((supplier) => {
                    const Icon = getServiceIcon(supplier.service_type);
                    return (
                      <tr key={supplier.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-blue-600 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-blue-400">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <Link href={`/admin/suppliers/${supplier.id}`} className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors dark:text-gray-100">
                                {supplier.name}
                              </Link>
                              <p className="text-[10px] text-gray-500 font-medium mt-0.5 tracking-wider">ID: {supplier.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            {getServiceLabel(supplier.service_type)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-xs space-y-1">
                            <p className="text-gray-600 font-medium dark:text-gray-300">{supplier.email}</p>
                            <p className="text-gray-400 dark:text-gray-500">{supplier.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs text-gray-600 font-medium leading-relaxed dark:text-gray-400">{supplier.address}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link 
                              href={`/admin/suppliers/${supplier.id}`} 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(supplier.id)} 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                              title="Xóa nhà cung cấp"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && <SupplierFormModal onClose={() => { setIsModalOpen(false); fetchSuppliers(); }} />}
    </div>
  );
}
