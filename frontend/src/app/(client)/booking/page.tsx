'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users,
  ChevronLeft,
  Lock,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { tourService } from '@/services/tour.service';
import { customerService } from '@/services/customer.service';
import { orderService } from '@/services/order.service';
import { toast } from 'react-hot-toast';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tourId = searchParams.get('tourId');
  const initialGuests = parseInt(searchParams.get('guests') || '1');

  const [tour, setTour] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    paymentMethod: 'bank',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!tourId) {
          router.push('/tours');
          return;
        }

        const [tourData, customerData] = await Promise.all([
          tourService.getById(parseInt(tourId)),
          customerService.getMe().catch(() => null)
        ]);

        setTour(tourData);
        if (customerData) {
          setCustomer(customerData);
          setFormData({
            ...formData,
            fullName: customerData.user?.full_name || '',
            phone: customerData.phone_number || '',
            email: customerData.user?.email || ''
          });
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
        toast.error('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      toast.error('Vui lòng đăng nhập để đặt tour');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        customer_id: customer.id,
        tour_id: parseInt(tourId!),
        quantity: initialGuests,
        total_price: tour.price * initialGuests,
        payment_method: formData.paymentMethod,
        notes: formData.notes,
        status: 'confirmed',
        payment_status: 'paid'
      };

      await orderService.create(orderData);
      setSuccess(true);
      toast.success('Đặt tour thành công!');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/customers/my-bookings'); // Need to check if this page exists
      }, 3000);
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.detail || 'Có lỗi xảy ra khi đặt tour');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Đang chuẩn bị đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-6">
        <div className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-2xl shadow-blue-900/10 border border-blue-50 space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900">Thành công!</h2>
            <p className="text-gray-500 font-medium">Đơn hàng của bạn đã được tiếp nhận. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
          </div>
          <Link href="/" className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href={`/tour-detail/${tourId}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại chi tiết tour
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                Thông tin đặt tour
              </h1>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Contact Info */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-blue-600">
                    <User className="w-5 h-5" />
                    <h3 className="text-lg font-black uppercase tracking-widest">Thông tin liên hệ</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">HỌ VÀ TÊN</label>
                      <input 
                        type="text" 
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="Nguyễn Văn A" 
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SỐ ĐIỆN THOẠI</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="090 123 4567" 
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">EMAIL</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="example@gmail.com" 
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" 
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-blue-600">
                    <CreditCard className="w-5 h-5" />
                    <h3 className="text-lg font-black uppercase tracking-widest">Phương thức thanh toán</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'bank', title: 'Chuyển khoản ngân hàng', desc: 'Vietcombank, Techcombank...' },
                      { id: 'card', title: 'Thẻ tín dụng / Ghi nợ', desc: 'Visa, Mastercard, JCB...' },
                      { id: 'wallet', title: 'Ví điện tử', desc: 'Momo, VNPay, ZaloPay...' },
                      { id: 'office', title: 'Tại văn phòng', desc: 'Thanh toán tiền mặt trực tiếp' }
                    ].map((method) => (
                      <label key={method.id} className={`relative flex items-center p-6 bg-gray-50 rounded-[24px] border-2 cursor-pointer transition-all group ${formData.paymentMethod === method.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:border-blue-100'}`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={formData.paymentMethod === method.id}
                          onChange={() => setFormData({...formData, paymentMethod: method.id})}
                          className="peer hidden" 
                        />
                        <div className="flex-1">
                          <p className="font-black text-gray-900">{method.title}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">{method.desc}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMethod === method.id ? 'border-blue-600 bg-blue-600' : 'border-gray-200'}`}>
                          <div className={`w-2 h-2 rounded-full bg-white transition-opacity ${formData.paymentMethod === method.id ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                <div className="pt-6 border-t border-gray-50 flex items-center gap-4 text-gray-400">
                  <Lock className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Dữ liệu của bạn được bảo mật tuyệt đối</p>
                </div>

                <button 
                  type="submit"
                  disabled={submitting || !customer}
                  className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:shadow-none"
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Xác nhận đặt tour'}
                </button>
                {!customer && (
                  <p className="text-center text-red-500 font-bold text-xs uppercase tracking-widest">
                    Vui lòng <Link href="/login" className="underline">đăng nhập</Link> để tiến hành đặt tour
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-blue-900/10 border border-blue-50">
                <div className="relative h-48">
                  <Image 
                    src={tour.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800"} 
                    alt={tour.name} 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Tóm tắt đơn hàng</p>
                    <h4 className="text-xl font-black text-white leading-tight">{tour.name}</h4>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-gray-400 font-bold">
                        <Calendar className="w-4 h-4" />
                        Ngày đi:
                      </div>
                      <span className="font-black text-gray-900">{new Date(tour.start_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-gray-400 font-bold">
                        <Users className="w-4 h-4" />
                        Số lượng:
                      </div>
                      <span className="font-black text-gray-900">{initialGuests.toString().padStart(2, '0')} Khách</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400">Tạm tính</span>
                      <span className="font-bold text-gray-900">{formatPrice(tour.price * initialGuests)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                      <span className="text-lg font-black text-gray-900">Tổng cộng</span>
                      <span className="text-2xl font-black text-blue-600">{formatPrice(tour.price * initialGuests)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-[32px] p-8 text-white flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-black leading-tight">Đảm bảo giá tốt nhất</p>
                  <p className="text-xs font-bold text-blue-100">Hoàn tiền 100% nếu tìm thấy mức giá thấp hơn ở bất kỳ đâu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
