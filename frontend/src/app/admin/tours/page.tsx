'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Plus, Image as ImageIcon, Eye, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { TourFormModal } from './TourFormModal';
import { tourService } from '@/services/tour.service';

export default function ToursPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await tourService.getAll();
      setTours(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Không thể tải danh sách tour. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTour = () => {
    setSelectedTour(null);
    setIsModalOpen(true);
  };

  const handleEditTour = (tour: any) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const handleDeleteTour = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      try {
        await tourService.delete(id);
        setTours(tours.filter(t => t.id !== id));
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa tour');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Danh sách Tour</h1>
        <p className="text-gray-500 dark:text-gray-400">Quản lý và cập nhật thông tin các chuyến đi</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 dark:bg-gray-900 dark:border-gray-800 transition-colors">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm tour theo tên, mã..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500 transition-all"
            />
          </div>
        </div>
        <button 
          onClick={handleAddTour}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Thêm tour
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
            <AlertCircle className="w-10 h-10" />
            <p>{error}</p>
            <button onClick={fetchTours} className="text-blue-600 hover:underline text-sm font-medium">Thử lại</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Hình ảnh</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Tên tour</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Điểm đến</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Giá</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Thời gian</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Trạng thái</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right dark:text-gray-400">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {tours.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-500">Không tìm thấy tour nào</td>
                  </tr>
                ) : (
                  tours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-800">
                          {tour.image_url ? (
                            <img src={tour.image_url} alt={tour.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Link href={`/admin/tours/${tour.id}`} className="font-semibold text-gray-900 line-clamp-1 max-w-[300px] hover:text-blue-600 transition-colors dark:text-gray-100" title={tour.name}>
                          {tour.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">ID: {tour.id}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{tour.destination}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {Number(tour.price).toLocaleString('vi-VN')} đ
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{tour.duration}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          tour.status === 'active' 
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                        }`}>
                          {tour.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/tours/${tour.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all dark:hover:text-blue-400 dark:hover:bg-blue-900/20">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleEditTour(tour)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all dark:hover:text-amber-400 dark:hover:bg-amber-900/20">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteTour(tour.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all dark:hover:text-red-400 dark:hover:bg-red-900/20">
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
      </div>

      {isModalOpen && (
        <TourFormModal 
          tour={selectedTour} 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTour(null);
            fetchTours();
          }} 
        />
      )}
    </div>
  );
}
