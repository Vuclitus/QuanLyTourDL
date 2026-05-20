'use client';

import React from 'react';
import { X, UploadCloud, Calendar, Loader2, Plus, Trash2, CheckCircle2, ChevronRight, ChevronLeft, MapPin, DollarSign, Users, Clock, Info, ListTodo, Settings, Search, Building2, Bus } from 'lucide-react';
import { tourService } from '@/services/tour.service';
import { uploadService } from '@/services/upload.service';
import { guideVehicleService } from '@/services/guide-vehicle.service';
import { supplierService } from '@/services/supplier.service';

interface TourFormModalProps {
  onClose: () => void;
  tour?: any; // For simplicity using any, but should be a proper Tour type
}

export function TourFormModal({ onClose, tour }: TourFormModalProps) {
  const isEdit = !!tour;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: tour?.name || '',
    destination: tour?.destination || '',
    price: tour?.price || '',
    max_participants: tour?.max_participants || 20,
    start_date: tour?.start_date || '',
    duration: tour?.duration || '3 ngày 2 đêm',
    duration_days: tour?.schedules?.length || 3,
    status: tour?.status || 'active',
    description: tour?.description || '',
    image_url: tour?.image_url || '',
    guide_ids: tour?.guides?.map((g: any) => g.id) || [],
    vehicle_id: tour?.vehicle_id || '',
    supplier_ids: tour?.suppliers?.map((s: any) => s.id) || []
  });

  const [schedules, setSchedules] = React.useState<any[]>(
    tour?.schedules || Array.from({ length: 3 }, (_, i) => ({ day_number: i + 1, title: '', content: '' }))
  );

  const [resources, setResources] = React.useState({
    guides: [],
    vehicles: [],
    suppliers: []
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>(tour?.image_url || '');
  const [loading, setLoading] = React.useState(false);
  const [guideSearch, setGuideSearch] = React.useState('');
  const [supplierSearch, setSupplierSearch] = React.useState('');
  const [vehicleSearch, setVehicleSearch] = React.useState('');

  React.useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const [guides, vehicles, suppliers] = await Promise.all([
        guideVehicleService.getGuides(),
        guideVehicleService.getVehicles(),
        supplierService.getAll()
      ]);
      setResources({ guides, vehicles, suppliers });
    } catch (err) {
      console.error('Error fetching resources:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-update schedules if duration_days changed
      if (name === 'duration_days') {
        const numDays = parseInt(value) || 0;
        setSchedules(prevSch => {
          if (numDays > prevSch.length) {
            return [
              ...prevSch,
              ...Array.from({ length: numDays - prevSch.length }, (_, i) => ({
                day_number: prevSch.length + i + 1,
                title: '',
                content: ''
              }))
            ];
          } else {
            return prevSch.slice(0, numDays);
          }
        });
      }
      
      return newData;
    });
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    setSchedules(prev => {
      const newSch = [...prev];
      newSch[index] = { ...newSch[index], [field]: value };
      return newSch;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let image_url = formData.image_url;
      let image_size = tour?.image_size || 0;

      if (selectedFile) {
        const uploadRes = await uploadService.uploadFile(selectedFile);
        image_url = uploadRes.url;
        image_size = uploadRes.size;
      }

      const tourData = {
        ...formData,
        price: formData.price ? Number(String(formData.price).split('.')[0].replace(/[^0-9]/g, '')) : 0,
        max_participants: Number(formData.max_participants) || 0,
        guide_ids: formData.guide_ids,
        vehicle_id: formData.vehicle_id ? Number(formData.vehicle_id) : null,
        supplier_ids: formData.supplier_ids,
        image_url,
        image_size,
        schedules
      };

      console.log('--- TOUR DATA TO SAVE ---', tourData);
      
      if (isEdit) {
        await tourService.update(tour.id, tourData);
      } else {
        await tourService.create(tourData);
      }
      onClose();
    } catch (err) {
      console.error('Error saving tour:', err);
      alert('Có lỗi xảy ra khi lưu tour.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Thông tin chung', icon: Info },
    { id: 2, name: 'Lịch trình', icon: ListTodo },
    { id: 3, name: 'Dịch vụ & Lưu', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 dark:bg-gray-950 dark:border dark:border-gray-800 transition-all">
        {/* Header with Steps */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {isEdit ? 'Chỉnh sửa Tour' : 'Khởi tạo Tour mới'}
              </h2>
              <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">Hoàn thành các bước để thiết lập chuyến đi hoàn hảo.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all dark:hover:bg-gray-800 dark:hover:text-gray-200 shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 relative">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div 
                  className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300 ${
                    step === s.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                      : step > s.id 
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                        : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${step === s.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap">{s.name}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 h-0.5 rounded-full ${step > s.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-10 py-8 max-h-[calc(100vh-280px)] overflow-y-auto dark:bg-gray-950 transition-colors custom-scrollbar">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tên tour */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">
                    <Info className="w-4 h-4 text-blue-500" />
                    Tên tour công bố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Khám phá Sapa Mùa Lúa Chín"
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm dark:bg-gray-900 dark:text-gray-200 font-medium"
                  />
                </div>

                {/* Điểm đến */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Điểm đến chính
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="VD: Hạ Long, Sapa, Phú Quốc..."
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm dark:bg-gray-900 dark:text-gray-200 font-medium"
                  />
                </div>

                {/* Giá */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Giá tour (VNĐ)
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="5,200,000"
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm dark:bg-gray-900 font-bold text-green-600 dark:text-green-400"
                  />
                </div>

                {/* Thời gian mô tả */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-orange-500" />
                    Thời gian hiển thị
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="VD: 3 ngày 2 đêm"
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm dark:bg-gray-900 dark:text-gray-200 font-medium"
                  />
                </div>

                {/* Số ngày (để sinh lịch trình) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Số ngày thực tế
                  </label>
                  <input
                    type="number"
                    name="duration_days"
                    value={formData.duration_days}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm dark:bg-gray-900 dark:text-gray-200 font-medium"
                  />
                </div>

                {/* Số chỗ */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">
                    <Users className="w-4 h-4 text-purple-500" />
                    Số khách tối đa
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm dark:bg-gray-900 dark:text-gray-200 font-medium"
                  />
                </div>

                {/* Ngày khởi hành */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-red-500" />
                    Ngày khởi hành đầu tiên
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm dark:bg-gray-900 dark:text-gray-200 font-medium"
                  />
                </div>
              </div>

              {/* Hình ảnh */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 dark:text-gray-300">Hình ảnh đại diện Tour</label>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-3xl p-6 min-h-[220px] flex flex-col items-center justify-center bg-gray-50/50 hover:bg-blue-50/30 hover:border-blue-400 transition-all cursor-pointer group dark:border-gray-800 dark:bg-gray-900/30 dark:hover:bg-gray-900 dark:hover:border-blue-500/50 overflow-hidden relative"
                >
                  {imagePreview ? (
                    <div className="absolute inset-0 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-bold text-sm">Thay đổi ảnh</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Kéo thả hoặc click để tải ảnh lên</p>
                      <p className="text-xs text-gray-400 mt-2 dark:text-gray-500">Kích thước khuyên dùng: 1200x800px (Tối đa 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-blue-500" />
                  Chi tiết hành trình {formData.duration_days} ngày
                </h3>
              </div>
              
              <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
                {schedules.map((sch, idx) => (
                  <div key={idx} className="relative pl-14 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="absolute left-0 top-0 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-blue-500/30 z-10">
                      D{sch.day_number}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl space-y-4 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50 transition-all">
                      <input
                        type="text"
                        value={sch.title}
                        onChange={(e) => handleScheduleChange(idx, 'title', e.target.value)}
                        placeholder={`Tiêu đề ngày ${sch.day_number} (VD: Hà Nội - Sapa)`}
                        className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 pb-2 focus:border-blue-500 outline-none text-base font-bold dark:text-gray-200 transition-colors"
                      />
                      <textarea
                        rows={3}
                        value={sch.content}
                        onChange={(e) => handleScheduleChange(idx, 'content', e.target.value)}
                        placeholder="Mô tả chi tiết các hoạt động, điểm tham quan, ăn uống..."
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm dark:text-gray-400 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Điều phối dịch vụ & Tài nguyên
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Hướng dẫn viên */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Hướng dẫn viên điều hành (Chọn nhiều)</label>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          placeholder="Tìm tên, ngôn ngữ..."
                          value={guideSearch}
                          onChange={(e) => setGuideSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    
                    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                            <tr className="border-b border-gray-100 dark:border-gray-700">
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-12 text-center">Chọn</th>
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Họ tên</th>
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngôn ngữ</th>
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kinh nghiệm</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {resources.guides
                              .filter((g: any) => 
                                !guideSearch || 
                                g.full_name?.toLowerCase().includes(guideSearch.toLowerCase()) ||
                                g.languages?.some((l: string) => l.toLowerCase().includes(guideSearch.toLowerCase()))
                              )
                              .map((g: any) => {
                                const isSelected = formData.guide_ids.includes(g.id);
                                return (
                                  <tr 
                                    key={g.id}
                                    onClick={() => {
                                      const newIds = isSelected 
                                        ? formData.guide_ids.filter((id: number) => id !== g.id)
                                        : [...formData.guide_ids, g.id];
                                      setFormData(prev => ({ ...prev, guide_ids: newIds }));
                                    }}
                                    className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-colors ${
                                      isSelected ? 'bg-blue-50/20 dark:bg-blue-900/5' : ''
                                    }`}
                                  >
                                    <td className="py-3 px-4 text-center">
                                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-200 dark:border-gray-700'
                                      }`}>
                                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 dark:border-gray-800">
                                          {g.image_url ? (
                                            <img src={g.image_url} alt={g.full_name} className="w-full h-full object-cover" />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-[10px] uppercase">
                                              {g.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                            </div>
                                          )}
                                        </div>
                                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{g.full_name}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex flex-wrap gap-1">
                                        {g.languages?.slice(0, 3).map((l: string, i: number) => (
                                          <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded text-[9px] font-bold">
                                            {l}
                                          </span>
                                        ))}
                                        {g.languages?.length > 3 && <span className="text-[9px] text-gray-400">+{g.languages.length - 3}</span>}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{g.experience || 'Chưa cập nhật'}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Phương tiện */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Phương tiện di chuyển chính</label>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          placeholder="Tìm biển số, loại xe..."
                          value={vehicleSearch}
                          onChange={(e) => setVehicleSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    
                    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                            <tr className="border-b border-gray-100 dark:border-gray-700">
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-12 text-center">Chọn</th>
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Biển số</th>
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại xe</th>
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Số chỗ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {resources.vehicles
                              .filter((v: any) => 
                                !vehicleSearch || 
                                v.plate_number?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                                v.type?.toLowerCase().includes(vehicleSearch.toLowerCase())
                              )
                              .map((v: any) => {
                                const isSelected = formData.vehicle_id === v.id;
                                return (
                                  <tr 
                                    key={v.id}
                                    onClick={() => setFormData(prev => ({ ...prev, vehicle_id: isSelected ? '' : v.id }))}
                                    className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-colors ${
                                      isSelected ? 'bg-blue-50/20 dark:bg-blue-900/5' : ''
                                    }`}
                                  >
                                    <td className="py-3 px-4 text-center">
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-200 dark:border-gray-700'
                                      }`}>
                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                          <Bus className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black text-gray-900 dark:text-gray-100">{v.plate_number}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{v.type}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-black">
                                        {v.capacity} chỗ
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Nhà cung cấp dịch vụ */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Nhà cung cấp dịch vụ (Chọn nhiều)</label>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          placeholder="Tìm tên nhà cung cấp, địa chỉ..."
                          value={supplierSearch}
                          onChange={(e) => setSupplierSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    
                    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                            <tr className="border-b border-gray-100 dark:border-gray-700">
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-12 text-center">Chọn</th>
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên nhà cung cấp</th>
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại hình</th>
                              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Địa chỉ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {resources.suppliers
                              .filter((s: any) => 
                                !supplierSearch || 
                                s.name?.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                                s.address?.toLowerCase().includes(supplierSearch.toLowerCase())
                              )
                              .map((s: any) => {
                                const isSelected = formData.supplier_ids.includes(s.id);
                                return (
                                  <tr 
                                    key={s.id}
                                    onClick={() => {
                                      const newIds = isSelected 
                                        ? formData.supplier_ids.filter((id: number) => id !== s.id)
                                        : [...formData.supplier_ids, s.id];
                                      setFormData(prev => ({ ...prev, supplier_ids: newIds }));
                                    }}
                                    className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-colors ${
                                      isSelected ? 'bg-blue-50/20 dark:bg-blue-900/5' : ''
                                    }`}
                                  >
                                    <td className="py-3 px-4 text-center">
                                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-200 dark:border-gray-700'
                                      }`}>
                                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 dark:border-gray-800 flex items-center justify-center">
                                          {s.image_url ? (
                                            <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                          )}
                                        </div>
                                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{s.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        s.service_type === 'hotel' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                        s.service_type === 'restaurant' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                      }`}>
                                        {s.service_type}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[200px] block">{s.address || 'N/A'}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mô tả tổng quan */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 dark:text-gray-300">Mô tả tổng quan (SEO/Marketing)</label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả hấp dẫn để thu hút khách hàng..."
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm dark:bg-gray-900 dark:text-gray-200 font-medium resize-none shadow-inner"
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-gray-100 flex items-center justify-between dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
          <button 
            onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 transition-all dark:bg-transparent dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {step === 1 ? 'Đóng' : <><ChevronLeft className="w-4 h-4" /> Quay lại</>}
          </button>
          
          {step < 3 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-10 py-3 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            >
              Tiếp theo <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-12 py-3 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Cập nhật Tour' : 'Hoàn tất & Lưu'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
