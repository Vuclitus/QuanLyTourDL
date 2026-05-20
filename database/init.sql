-- Initialize database with sample data

-- Insert admin user (password: admin123)
INSERT INTO users (email, hashed_password, full_name, is_superuser, role) 
VALUES ('admin@example.com', '$2b$12$...', 'Administrator', TRUE, 'admin');

-- Insert sample tours
INSERT INTO tours (name, description, destination, duration, price, max_participants, start_date, end_date)
VALUES 
    ('Tour Hà Nội - Hạ Long', 'Khám phá vịnh Hạ Long kỳ vĩ', 'Hạ Long', 2, 2500000, 30, '2024-01-15', '2024-01-16'),
    ('Tour Đà Nẵng - Hội An', 'Tham quan phố cổ Hội An', 'Hội An', 3, 3500000, 25, '2024-02-01', '2024-02-03'),
    ('Tour Sapa - Fansipan', 'Chinh phục nóc nhà Đông Dương', 'Sapa', 4, 4500000, 20, '2024-03-10', '2024-03-13');
