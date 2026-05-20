'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Award, 
  Star, 
  Activity,
  Edit2,
  Send,
  MoreHorizontal,
  Compass,
  MessageSquare,
  Shield,
  Clock,
  CheckCircle2,
  Save
} from 'lucide-react';
import { EmployeeFormModal } from '../EmployeeFormModal';

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: empId } = React.use(params);
  const [activeTab, setActiveTab] = useState('Thông tin chung');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data for the employee
  // Mock data for the employee
  const employee = {
    id: empId,
    name: 'Nguyễn Thị Mai',
    role: 'Quản trị viên',
    subRole: 'Senior Admin',
    department: 'Vận hành Hệ thống',
    email: 'mai.nguyen@luxevoyage.com',
    phone: '+84 901 234 567',
    joinDate: '15/03/2021',
    status: 'Đang hoạt động',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    stats: {
      totalTours: '1,428',
      feedbackRate: 98.5,
      rating: 4.9
    }
  };

  const [permissions, setPermissions] = useState([
    { name: 'Quản lý Tour', values: [true, true, true, false] },
    { name: 'Quản lý Đơn hàng', values: [true, true, true, true] },
    { name: 'Quản lý Khách hàng', values: [true, true, true, false] },
    { name: 'Quản lý Tài chính', values: [true, false, false, false] },
    { name: 'Quản lý Nhân sự', values: [true, true, true, true] },
    { name: 'Cấu hình Hệ thống', values: [true, false, false, false] },
  ]);

  const togglePermission = (rowIdx: number, colIdx: number) => {
    const newPerms = [...permissions];
    newPerms[rowIdx].values[colIdx] = !newPerms[rowIdx].values[colIdx];
    setPermissions(newPerms);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 pb-20 animate-in fade-in duration-500 transition-colors">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-8 pt-8 flex items-center justify-between">
        <Link href="/admin/employees" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors group">
          <div className="p-2 group-hover:bg-white dark:group-hover:bg-gray-800 rounded-full transition-all">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold">Danh sách nhân sự</span>
        </Link>
        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30 transition-colors">
          HỒ SƠ NỘI BỘ
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-8 grid grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Hero Card */}
          <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-blue-600/10 dark:border-gray-800">
                  <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg dark:border-gray-900" />
              </div>

              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight dark:text-white transition-colors">{employee.name}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 font-bold text-sm dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-blue-500 dark:text-blue-400" /> {employee.role}</span>
                    <span className="text-gray-200 dark:text-gray-700">•</span>
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" /> {employee.email}</span>
                    <span className="text-gray-200 dark:text-gray-700">•</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-blue-500 dark:text-blue-400" /> {employee.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Container */}
          <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden dark:bg-gray-900 dark:border-gray-800 dark:shadow-none transition-colors">
            <div className="px-10 pt-8 border-b border-gray-100 dark:border-gray-800 transition-colors">
              <div className="flex gap-10">
                {['Thông tin chung', 'Lịch làm việc', 'Quyền hạn', 'Đánh giá hiệu suất'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-6 text-sm font-black transition-all relative ${
                      activeTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-10">
              {activeTab === 'Thông tin chung' && (
                <div className="grid grid-cols-2 gap-y-12 gap-x-10 animate-in fade-in duration-500">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 dark:text-gray-500">PHÒNG BAN</p>
                    <p className="text-base font-black text-gray-900 dark:text-white transition-colors">{employee.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 dark:text-gray-500">NGÀY GIA NHẬP</p>
                    <p className="text-base font-black text-gray-900 dark:text-white transition-colors">{employee.joinDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 dark:text-gray-500">CẤP BẬC</p>
                    <p className="text-base font-black text-gray-900 dark:text-white transition-colors">{employee.subRole}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 dark:text-gray-500">TRẠNG THÁI</p>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full w-fit dark:bg-blue-900/20 dark:text-blue-400 transition-colors">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse dark:bg-blue-400" />
                      <span className="text-xs font-black uppercase tracking-widest">{employee.status}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Lịch làm việc' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white transition-colors">Ca làm việc trong tuần</h3>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Tuần này</button>
                      <button className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl text-xs font-bold hover:text-gray-600 transition-all dark:bg-gray-900 dark:border-gray-800 dark:text-gray-500 dark:hover:text-gray-300">Tuần tới</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-4">
                    {['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'].map((day, i) => (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">{day}</span>
                        <div className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                          i < 5 ? 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30' : 'bg-gray-50 border-transparent opacity-50 dark:bg-gray-800'
                        }`}>
                          {i < 5 ? (
                            <>
                              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                              <span className="text-[10px] font-black text-blue-700 dark:text-blue-300">08:00</span>
                              <span className="text-[10px] font-black text-blue-700 dark:text-blue-300">17:30</span>
                            </>
                          ) : (
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-600">OFF</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4 dark:bg-gray-800 dark:border-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">Thống kê chuyên cần tháng 05</p>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-black text-gray-900 dark:text-white transition-colors">22</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày công</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-amber-600">0</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đi muộn</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-blue-600">2</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nghỉ phép</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Quyền hạn' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white transition-colors">Ma trận phân quyền chi tiết</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 dark:text-gray-500">Phân quyền dựa trên chức vụ: Senior Admin</p>
                    </div>
                    <button className="px-6 py-2.5 bg-[#1e3a8a] text-white rounded-xl text-xs font-black hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                      <Save className="w-4 h-4" />
                      Lưu thay đổi
                    </button>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-colors">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 dark:bg-gray-900/50 dark:border-gray-700 transition-colors">
                          <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500">Module Hệ thống</th>
                          <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center dark:text-gray-500">Xem</th>
                          <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center dark:text-gray-500">Thêm</th>
                          <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center dark:text-gray-500">Sửa</th>
                          <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center dark:text-gray-500">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700 transition-colors">
                        {permissions.map((item, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                            <td className="py-5 px-8">
                              <p className="text-sm font-black text-gray-900 dark:text-gray-200 transition-colors">{item.name}</p>
                            </td>
                            {item.values.map((p, colIdx) => (
                              <td key={colIdx} className="py-5 px-4 text-center">
                                <button 
                                  onClick={() => togglePermission(rowIdx, colIdx)}
                                  className="flex justify-center mx-auto focus:outline-none transition-transform active:scale-90"
                                >
                                  {p ? (
                                    <div className="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30 transition-colors">
                                      <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 bg-gray-50 text-gray-300 rounded-xl flex items-center justify-center border border-gray-100 font-black text-xs dark:bg-gray-900 dark:text-gray-700 dark:border-gray-800 transition-colors">
                                      -
                                    </div>
                                  )}
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-4 dark:bg-blue-900/10 dark:border-blue-900/30 transition-colors">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0 dark:bg-gray-900 dark:text-blue-400 transition-colors">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-[#1e3a8a] dark:text-blue-300 transition-colors">Quyền quản trị cấp cao</p>
                        <p className="text-xs text-blue-800 font-bold leading-relaxed opacity-70 dark:text-blue-400">
                          Nhân sự này có quyền can thiệp vào các cài đặt quan trọng và quản lý tài khoản cấp dưới.
                        </p>
                      </div>
                    </div>
                    <div className="p-6 bg-amber-50/50 rounded-[32px] border border-amber-100 flex items-start gap-4 dark:bg-amber-900/10 dark:border-amber-900/30 transition-colors">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0 dark:bg-gray-900 dark:text-amber-400 transition-colors">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-amber-900 dark:text-amber-300 transition-colors">Nhật ký truy cập</p>
                        <p className="text-xs text-amber-800 font-bold leading-relaxed opacity-70 dark:text-amber-400">
                          Lần đăng nhập cuối: 14/05/2024 - 08:30 từ địa chỉ IP: 113.190.x.x
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Đánh giá hiệu suất' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white transition-colors">Chỉ số KPI quý 2/2024</h3>
                    <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full dark:bg-green-900/20 dark:text-green-400 transition-colors">Vượt mục tiêu 12%</span>
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: 'Xử lý yêu cầu khách hàng', value: 98, target: 90, color: 'bg-blue-600' },
                      { label: 'Độ chính xác dữ liệu', value: 99.5, target: 95, color: 'bg-purple-600' },
                      { label: 'Thời gian phản hồi (AVG)', value: 85, target: 80, color: 'bg-cyan-600' },
                    ].map((kpi, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <p className="text-xs font-black text-gray-900 uppercase tracking-widest dark:text-gray-400 transition-colors">{kpi.label}</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white transition-colors">{kpi.value}% <span className="text-[10px] text-gray-400 font-bold ml-1 dark:text-gray-600">/ {kpi.target}%</span></p>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 transition-colors">
                          <div className={`h-full ${kpi.color} rounded-full transition-all duration-1000 dark:opacity-80`} style={{ width: `${kpi.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 dark:text-gray-500">Nhận xét từ quản lý</p>
                    <div className="p-6 bg-gray-50 rounded-[32px] italic text-sm text-gray-600 font-medium leading-relaxed dark:bg-gray-800 dark:text-gray-400 transition-colors">
                      "Mai luôn thể hiện tinh thần trách nhiệm cao trong công việc. Khả năng điều phối và xử lý tình huống khẩn cấp rất ấn tượng. Cần phát triển thêm kỹ năng đào tạo nhân sự cấp dưới trong quý tới."
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa hồ sơ
            </button>
            <button className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-black text-sm hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/50 dark:hover:text-blue-400">
              <Send className="w-4 h-4" />
              Gửi thông báo
            </button>
          </div>

          {/* Stats Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-6 group hover:shadow-2xl hover:shadow-blue-900/10 transition-all dark:bg-gray-900 dark:border-gray-800 dark:shadow-none dark:hover:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500 transition-colors">TỔNG SỐ TOUR ĐÃ XỬ LÝ</p>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform dark:bg-blue-900/20 dark:text-blue-400">
                  <Compass className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-4xl font-black text-gray-900 dark:text-white transition-colors">{employee.stats.totalTours}</h4>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-6 group hover:shadow-2xl hover:shadow-blue-900/10 transition-all dark:bg-gray-900 dark:border-gray-800 dark:shadow-none dark:hover:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500 transition-colors">TỶ LỆ PHẢN HỒI KHÁCH HÀNG</p>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform dark:bg-blue-900/20 dark:text-blue-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-4xl font-black text-gray-900 dark:text-white transition-colors">{employee.stats.feedbackRate}%</h4>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800 transition-colors">
                  <div className="h-full bg-blue-600 rounded-full dark:bg-blue-500" style={{ width: `${employee.stats.feedbackRate}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-6 group hover:shadow-2xl hover:shadow-blue-900/10 transition-all dark:bg-gray-900 dark:border-gray-800 dark:shadow-none dark:hover:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest dark:text-gray-500 transition-colors">ĐIỂM ĐÁNH GIÁ NỘI BỘ</p>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform dark:bg-blue-900/20 dark:text-blue-400">
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-4xl font-black text-gray-900 dark:text-white transition-colors">{employee.stats.rating}<span className="text-sm text-gray-400 font-bold ml-1 dark:text-gray-600">/ 5.0</span></h4>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= 4.9 ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400' : 'text-gray-200 dark:text-gray-800'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EmployeeFormModal 
          employee={employee} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
}
