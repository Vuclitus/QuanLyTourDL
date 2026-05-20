# Tour Management System - QLTourDL

Hệ thống quản lý tour du lịch với kiến trúc hiện đại: NextJS Frontend + FastAPI Backend + PostgreSQL Database.

## 🏗️ Kiến trúc hệ thống

```
QLTourDL/
├── frontend/              # NextJS 14 (Client + Admin UI)
├── backend/               # FastAPI (API + Business Logic)
├── database/              # PostgreSQL + Alembic migrations
├── docs/                  # UML, API documentation
├── docker/                # Docker configuration
├── .env                   # Environment variables
└── README.md
```

## 🚀 Công nghệ sử dụng

### Frontend
- **Next.js 14** - React framework với App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form validation

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM cho database
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **JWT** - Authentication

### Database
- **PostgreSQL** - Relational database

## 📁 Cấu trúc thư mục chi tiết

### Frontend (NextJS)
```
frontend/
├── src/app/
│   ├── (auth)/           # Nhóm route xác thực
│   │   ├── login/
│   │   └── register/
│   ├── (admin)/          # Admin dashboard (layout riêng)
│   │   ├── dashboard/
│   │   ├── tours/
│   │   ├── customers/
│   │   ├── orders/
│   │   ├── employees/
│   │   ├── suppliers/
│   │   ├── guides-vehicles/
│   │   ├── reports/
│   │   └── settings/
│   └── (client)/         # Frontend khách hàng
│       ├── tours/
│       ├── tour-detail/
│       └── booking/
├── src/components/       # UI reusable components
├── src/services/         # API calls
├── src/store/           # Zustand stores
└── src/hooks/           # Custom React hooks
```

### Backend (FastAPI - Clean Architecture)
```
backend/
├── app/
│   ├── main.py          # Entry point
│   ├── core/            # Config, security, database
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   ├── api/             # API routes
│   ├── modules/         # Domain modules
│   └── dependencies/    # DI containers
└── tests/               # Unit & integration tests
```

## 🛠️ Hướng dẫn cài đặt

### 1. Clone repository
```bash
cd d:\BTL_CNPM\QuanLyTourDL
```

### 2. Cài đặt Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
```

### 4. Cấu hình môi trường
Tạo file `.env` ở root:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/tour_management
SECRET_KEY=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 5. Chạy database migrations
```bash
cd backend
alembic upgrade head
```

### 6. Khởi động ứng dụng

**Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```
API docs: http://localhost:8000/docs

**Frontend:**
```bash
cd frontend
npm run dev
```
App: http://localhost:3000

## 📊 Chức năng chính

| Module | Mô tả |
|--------|-------|
| 🔐 Auth | Đăng nhập, đăng ký, phân quyền |
| 🧭 Dashboard | Thống kê tổng quan |
| 🌍 Tour | Quản lý tour du lịch |
| 👥 Khách hàng | Quản lý thông tin KH |
| 🧾 Đơn hàng | Quản lý booking |
| 💳 Thanh toán | Xử lý thanh toán |
| 🏢 Nhà cung cấp | Quản lý suppliers |
| 🧭 HDV + Phương tiện | Quản lý tour guide & vehicles |
| 🧑‍💼 Nhân sự | Quản lý nhân viên |
| 📊 Báo cáo | Báo cáo doanh thu, tour |
| ⚙️ Cấu hình | System settings |

## 🔗 API Endpoints

- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `GET /api/v1/tours` - Danh sách tour
- `GET /api/v1/tours/{id}` - Chi tiết tour
- `GET /api/v1/customers` - Danh sách KH
- `GET /api/v1/orders` - Danh sách đơn hàng
- `GET /api/v1/reports/revenue` - Báo cáo doanh thu

## 👥 Tác giả

BTL CNPM - QuanLyTourDL


1. Chạy Backend:

# Đảm bảo bạn đang ở thư mục backend
cd d:\BTL_CNPM\QuanlyTourDL\backend

# Cài đặt thư viện
..\.venv\Scripts\pip.exe install -r requirements.txt

# Chạy file run.py bằng python trong môi trường ảo
..\.venv\Scripts\python.exe run.py


2. Chạy Frontend:

cd frontend
npm run dev
