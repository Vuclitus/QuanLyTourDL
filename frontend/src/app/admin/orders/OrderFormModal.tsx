'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  User, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft, 
  Ticket, 
  Users, 
  CheckCircle2, 
  Wallet, 
  Banknote, 
  ArrowRight,
  Loader2,
  PackageCheck
} from 'lucide-react';
import { customerService } from '@/services/customer.service';
import { tourService } from '@/services/tour.service';
import { orderService } from '@/services/order.service';

interface OrderFormModalProps {
  onClose: () => void;
  order?: any;
}

export function OrderFormModal({ onClose, order }: OrderFormModalProps) {
  const isEdit = !!order;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Data from DB
  const [customers, setCustomers] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    customer_id: order?.customer_id || '',
    tour_id: order?.tour_id || '',
    quantity: order?.quantity || 1,
    status: order?.status || 'pending',
    payment_status: order?.payment_status || 'unpaid',
    notes: order?.notes || '',
    payment_method: 'transfer'
  });

  // Search State
  const [customerSearch, setCustomerSearch] = useState('');
  const [tourSearch, setTourSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showTourDropdown, setShowTourDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [customersData, toursData] = await Promise.all([
          customerService.getAll(1, 100),
          tourService.getAll()
        ]);
        setCustomers(customersData.items || []);
        setTours(toursData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedCustomer = customers.find(c => c.id === Number(formData.customer_id));
  const selectedTour = tours.find(t => t.id === Number(formData.tour_id));

  const filteredCustomers = customers.filter(c => 
    c.user?.full_name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone?.includes(customerSearch) ||
    c.user?.email?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredTours = tours.filter(t => 
    t.name?.toLowerCase().includes(tourSearch.toLowerCase()) ||
    t.destination?.toLowerCase().includes(tourSearch.toLowerCase())
  );

  const calculateTotal = () => {
    if (!selectedTour) return 0;
    return selectedTour.price * formData.quantity;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const apiData = {
        ...formData,
        total_price: calculateTotal(),
      };

      if (isEdit) {
        await orderService.update(order.id, apiData);
      } else {
        await orderService.create(apiData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Có lỗi xảy ra khi lưu đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (formData.customer_id && formData.tour_id) {
      if (selectedTour) {
        const remainingSeats = selectedTour.max_participants - (selectedTour.current_booked || 0);
        if (formData.quantity > remainingSeats && !isEdit) {
          alert(`Tour này chỉ còn ${remainingSeats} chỗ trống. Vui lòng giảm số lượng khách.`);
          return;
        }
      }
      setStep(2);
    } else {
      alert('Vui lòng chọn khách hàng và tour trước khi tiếp tục.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 dark:bg-gray-900 border border-white/20 dark:border-gray-800 flex flex-col h-[700px]">
        
        {/* Progress Header */}
        <div className="px-10 py-8 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-3 transition-all duration-500 ${step === 1 ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 font-black">1</div>
              <div>
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Bước 01</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">Chọn Tour & Khách</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300" />
            <div className={`flex items-center gap-3 transition-all duration-500 ${step === 2 ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${step === 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-200 text-gray-400 dark:bg-gray-700'}`}>2</div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bước 02</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">Thanh toán & Chốt</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-white rounded-2xl transition-all dark:hover:bg-gray-800 dark:hover:text-white shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
          {dataLoading && (
            <div className="absolute inset-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Đang tải dữ liệu hệ thống...</p>
            </div>
          )}

          {step === 1 ? (
            <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-left-8 duration-500">
              {/* Select Customer */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-2">Tìm kiếm khách hàng</label>
                <div className="relative">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={selectedCustomer ? selectedCustomer.user?.full_name : customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        if (selectedCustomer) {
                          setFormData({ ...formData, customer_id: '' });
                        }
                        setShowCustomerDropdown(true);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      placeholder="Tên khách hàng, Email hoặc Số điện thoại..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-30 max-h-64 overflow-y-auto p-2">
                      {filteredCustomers.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setFormData({ ...formData, customer_id: c.id });
                            setCustomerSearch(c.user?.full_name);
                            setShowCustomerDropdown(false);
                          }}
                          className="w-full text-left p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all group"
                        >
                          <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{c.user?.full_name}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">{c.phone} • {c.user?.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Select Tour */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-2">Chọn Tour du lịch</label>
                <div className="relative">
                  <div className="relative group">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={selectedTour ? selectedTour.name : tourSearch}
                      onChange={(e) => {
                        setTourSearch(e.target.value);
                        if (selectedTour) {
                          setFormData({ ...formData, tour_id: '' });
                        }
                        setShowTourDropdown(true);
                      }}
                      onFocus={() => setShowTourDropdown(true)}
                      placeholder="Tìm theo tên tour hoặc địa điểm..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  {showTourDropdown && filteredTours.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-30 max-h-64 overflow-y-auto p-2">
                      {filteredTours.map((t) => {
                        const isFull = t.max_participants - t.current_booked <= 0;
                        return (
                          <button
                            key={t.id}
                            disabled={isFull}
                            onClick={() => {
                              setFormData({ ...formData, tour_id: t.id });
                              setTourSearch(t.name);
                              setShowTourDropdown(false);
                            }}
                            className={`w-full text-left p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all group ${isFull ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                          >
                            <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{t.name}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">{t.price.toLocaleString('vi-VN')}₫ • {t.duration}</p>
                              <p className={`text-[10px] font-bold uppercase tracking-tight ${t.max_participants - t.current_booked <= 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                {t.max_participants - t.current_booked <= 0 ? 'Hết chỗ' : `Còn ${t.max_participants - t.current_booked} chỗ`}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-2">Số lượng khách</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="number"
                      min={1}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-2">Trạng thái đơn</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-8 duration-500">
              {/* Order Summary Card */}
              <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <PackageCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Tóm tắt đơn hàng</p>
                      <h4 className="text-xl font-black truncate max-w-md">{selectedTour?.name}</h4>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/20">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Khách hàng</p>
                      <p className="text-sm font-black">{selectedCustomer?.user?.full_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Số lượng</p>
                      <p className="text-sm font-black">{formData.quantity} người</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-2">Trạng thái thanh toán</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, payment_status: 'unpaid' })}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${formData.payment_status === 'unpaid' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-100 text-gray-400 hover:border-amber-200'}`}
                  >
                    Chưa thanh toán
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, payment_status: 'paid', status: 'confirmed' })}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${formData.payment_status === 'paid' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-100 text-gray-400 hover:border-green-200'}`}
                  >
                    Đã thanh toán
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-2">Phương thức thanh toán</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'transfer', label: 'Chuyển khoản', icon: Wallet },
                    { id: 'cash', label: 'Tiền mặt', icon: Banknote },
                    { id: 'credit', label: 'Thẻ tín dụng', icon: CreditCard },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setFormData({ ...formData, payment_method: method.id })}
                      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 group ${formData.payment_method === method.id 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-100 hover:border-blue-200 dark:border-gray-800'
                      }`}
                    >
                      <method.icon className={`w-8 h-8 ${formData.payment_method === method.id ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`text-xs font-black uppercase tracking-wider ${formData.payment_method === method.id ? 'text-blue-600' : 'text-gray-500'}`}>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-2">Ghi chú yêu cầu</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Yêu cầu đặc biệt: Ăn uống, vị trí ngồi, khách sạn..."
                  className="w-full px-6 py-5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-8 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Tổng cộng dự kiến</p>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{calculateTotal().toLocaleString('vi-VN')}₫</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 text-xs font-black text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all uppercase tracking-widest"
            >
              Hủy bỏ
            </button>
            {step === 1 ? (
              <button
                onClick={nextStep}
                className="px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all flex items-center gap-3 active:scale-95"
              >
                Tiếp tục
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-[1.5rem] text-xs font-black text-gray-500 dark:text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Quay lại
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-12 py-4 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {isEdit ? 'Cập nhật đơn' : 'Tạo đơn ngay'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
