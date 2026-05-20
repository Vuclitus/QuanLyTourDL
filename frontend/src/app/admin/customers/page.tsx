'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  UserCheck, 
  Mail, 
  Phone, 
  Trash2, 
  Eye,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { CustomerFormModal } from './CustomerFormModal';
import { customerService } from '@/services/customer.service';

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    size: 10,
    pages: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomers(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCustomers(pagination.page);
  }, [pagination.page]);

  const fetchCustomers = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await customerService.getAll(page, pagination.size, debouncedSearch);
      setCustomers(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.total,
        page: data.page,
        pages: data.pages
      }));
      setError(null);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Không thể tải danh sách khách hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
      try {
        await customerService.deleteCustomer(id);
        setCustomers(customers.filter(c => c.id !== id));
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa khách hàng.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Quản lý Khách hàng</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Quản lý cơ sở dữ liệu khách hàng và thông tin liên hệ</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Thêm khách hàng
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 dark:bg-gray-900 dark:border-gray-800 transition-colors">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm khách hàng theo tên, email, sđt..."
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
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
            <button onClick={() => fetchCustomers()} className="text-blue-600 hover:underline">Thử lại</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Khách hàng</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Liên lạc</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Địa chỉ</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right dark:text-gray-400">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {customers.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-gray-500">Không có khách hàng nào</td></tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <Link href={`/admin/customers/${customer.id}`} className="font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors dark:text-gray-100">
                              {customer.user?.full_name || 'N/A'}
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">ID: {customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {customer.user?.email || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {customer.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{customer.address || 'N/A'}</span>
                      </td>
                       <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/customers/${customer.id}`} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(customer.id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                            title="Xóa khách hàng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị <span className="font-medium">{(pagination.page - 1) * pagination.size + 1}</span> đến <span className="font-medium">{Math.min(pagination.page * pagination.size, pagination.total)}</span> trong tổng số <span className="font-medium">{pagination.total}</span> khách hàng
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPagination(p => ({ ...p, page: i + 1 }))}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    pagination.page === i + 1
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && <CustomerFormModal onClose={() => { setIsModalOpen(false); fetchCustomers(pagination.page); }} />}
    </div>
  );
}
