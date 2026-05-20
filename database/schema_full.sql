-- ============================================================
-- QLTourDuLich - Tour Management System
-- PostgreSQL Database Schema (Full)
-- Database: QLTourDuLich
-- ============================================================

-- Tạo database (chạy lệnh này với user postgres nếu chưa có)
-- CREATE DATABASE "QLTourDuLich";

-- ============================================================
-- BẢNG 1: users - Tài khoản người dùng hệ thống
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    is_active       BOOLEAN DEFAULT TRUE,
    is_superuser    BOOLEAN DEFAULT FALSE,
    role            VARCHAR(50) DEFAULT 'user',   -- 'user' | 'admin' | 'staff'
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BẢNG 2: customers - Khách hàng
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    phone      VARCHAR(20),
    address    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BẢNG 3: suppliers - Nhà cung cấp dịch vụ
-- ============================================================
CREATE TABLE IF NOT EXISTS suppliers (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone          VARCHAR(20),
    email          VARCHAR(255),
    address        TEXT,
    service_type   VARCHAR(100),   -- 'transport' | 'hotel' | 'food' | 'other'
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BẢNG 4: employees - Nhân viên công ty
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    position   VARCHAR(100),    -- Chức vụ
    department VARCHAR(100),    -- Phòng ban
    salary     DECIMAL(10, 2),
    hire_date  DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BẢNG 5: tour_guides - Hướng dẫn viên du lịch
-- ============================================================
CREATE TABLE IF NOT EXISTS tour_guides (
    id             SERIAL PRIMARY KEY,
    employee_id    INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    license_number VARCHAR(100),    -- Số thẻ hướng dẫn viên
    languages      TEXT[],          -- Ngôn ngữ: {'Tiếng Việt','English','中文'}
    rating         DECIMAL(2, 1) DEFAULT 5.0 CHECK (rating BETWEEN 0 AND 5)
);

-- ============================================================
-- BẢNG 6: vehicles - Phương tiện vận chuyển
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id           SERIAL PRIMARY KEY,
    plate_number VARCHAR(50) UNIQUE NOT NULL,   -- Biển số xe
    type         VARCHAR(50),                   -- 'bus' | 'van' | 'car' | 'boat'
    capacity     INTEGER,                       -- Sức chứa (người)
    supplier_id  INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    status       VARCHAR(50) DEFAULT 'available'  -- 'available' | 'in_use' | 'maintenance'
);

-- ============================================================
-- BẢNG 7: tours - Tour du lịch
-- ============================================================
CREATE TABLE IF NOT EXISTS tours (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    destination      VARCHAR(255),
    duration         INTEGER,          -- Số ngày
    price            DECIMAL(10, 2),   -- Giá (VNĐ)
    max_participants  INTEGER,
    start_date       DATE,
    end_date         DATE,
    status           VARCHAR(50) DEFAULT 'active',  -- 'active' | 'inactive' | 'completed'
    image_url        VARCHAR(500),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BẢNG 8: orders - Đơn đặt tour
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id             SERIAL PRIMARY KEY,
    customer_id    INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    tour_id        INTEGER REFERENCES tours(id) ON DELETE SET NULL,
    quantity       INTEGER NOT NULL DEFAULT 1,      -- Số lượng khách
    total_price    DECIMAL(10, 2),
    status         VARCHAR(50) DEFAULT 'pending',   -- 'pending' | 'confirmed' | 'cancelled'
    payment_status VARCHAR(50) DEFAULT 'unpaid',    -- 'unpaid' | 'paid' | 'refunded'
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEX tối ưu tìm kiếm
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_customers_user_id  ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id  ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_guides_emp_id ON tour_guides(employee_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_supplier  ON vehicles(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer    ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_tour        ON orders(tour_id);
CREATE INDEX IF NOT EXISTS idx_tours_status       ON tours(status);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(status);

-- ============================================================
-- DỮ LIỆU MẪU (seed data)
-- ============================================================

-- Admin user (password: admin123 - bcrypt hashed)
INSERT INTO users (email, hashed_password, full_name, is_superuser, role)
VALUES ('admin@qltour.vn', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Quản trị viên', TRUE, 'admin')
ON CONFLICT (email) DO NOTHING;

-- Nhà cung cấp mẫu
INSERT INTO suppliers (name, contact_person, phone, email, address, service_type)
VALUES
    ('Công ty Vận tải Phương Đông', 'Nguyễn Văn An', '0901234567', 'phuongdong@transport.vn', 'Hà Nội', 'transport'),
    ('Khách sạn Sài Gòn Star', 'Trần Thị Bình', '0912345678', 'saigonstar@hotel.vn', 'TP.HCM', 'hotel'),
    ('Dịch vụ ẩm thực Việt', 'Lê Văn Cường', '0923456789', 'vietfood@food.vn', 'Đà Nẵng', 'food')
ON CONFLICT DO NOTHING;

-- Tour mẫu
INSERT INTO tours (name, description, destination, duration, price, max_participants, start_date, end_date, status)
VALUES
    ('Tour Hà Nội – Hạ Long', 'Khám phá vịnh Hạ Long kỳ vĩ, di sản thiên nhiên thế giới', 'Hạ Long, Quảng Ninh', 2, 2500000, 30, '2025-06-15', '2025-06-16', 'active'),
    ('Tour Đà Nẵng – Hội An', 'Tham quan phố cổ Hội An, bãi biển Mỹ Khê', 'Hội An, Quảng Nam', 3, 3500000, 25, '2025-07-01', '2025-07-03', 'active'),
    ('Tour Sapa – Fansipan', 'Chinh phục nóc nhà Đông Dương 3143m', 'Sapa, Lào Cai', 4, 4500000, 20, '2025-08-10', '2025-08-13', 'active'),
    ('Tour Phú Quốc', 'Nghỉ dưỡng đảo ngọc Phú Quốc, lặn biển san hô', 'Phú Quốc, Kiên Giang', 5, 6800000, 40, '2025-09-05', '2025-09-09', 'active')
ON CONFLICT DO NOTHING;
