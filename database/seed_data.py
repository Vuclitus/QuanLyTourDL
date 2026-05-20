import sys
import os
from datetime import date, datetime, timedelta
import random
from decimal import Decimal

# Add the backend directory to sys.path to import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.tour import Tour
from app.models.customer import Customer
from app.models.employee import Employee
from app.models.supplier import Supplier
from app.models.order import Order
from app.models.vehicle import Vehicle
from app.models.tour_guide import TourGuide

def seed():
    db = SessionLocal()
    try:
        # 1. Create more Users (Customers & Employees)
        print("Seeding Users...")
        for i in range(1, 21):
            email = f"user{i}@example.com"
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    email=email,
                    hashed_password="hashed_password", # Simplified
                    full_name=f"User Number {i}",
                    role="user" if i <= 15 else "staff"
                )
                db.add(user)
        db.commit()

        # 2. Create Customers
        print("Seeding Customers...")
        users = db.query(User).filter(User.role == "user").all()
        for user in users:
            customer = db.query(Customer).filter(Customer.user_id == user.id).first()
            if not customer:
                customer = Customer(
                    user_id=user.id,
                    phone=f"09{random.randint(10000000, 99999999)}",
                    address=f"Address {random.randint(1, 100)}, City {random.randint(1, 5)}"
                )
                db.add(customer)
        db.commit()

        # 3. Create Employees
        print("Seeding Employees...")
        staff_users = db.query(User).filter(User.role == "staff").all()
        for user in staff_users:
            employee = db.query(Employee).filter(Employee.user_id == user.id).first()
            if not employee:
                employee = Employee(
                    user_id=user.id,
                    position="Tour Guide" if random.random() > 0.5 else "Office Staff",
                    department="Operations",
                    salary=Decimal(random.randint(10000000, 20000000)),
                    hire_date=date.today() - timedelta(days=random.randint(100, 1000))
                )
                db.add(employee)
        db.commit()

        # 4. Create Suppliers
        print("Seeding Suppliers...")
        suppliers_data = [
            ("Hotel Sunshine", "Alice", "0911111111", "sunshine@hotel.com", "Da Nang", "hotel"),
            ("Trans-Viet Transport", "Bob", "0922222222", "transviet@transport.com", "HCMC", "transport"),
            ("Good Food Catering", "Charlie", "0933333333", "goodfood@catering.com", "Ha Noi", "food"),
            ("Mountain Lodge", "David", "0944444444", "mountain@lodge.com", "Sapa", "hotel"),
        ]
        for name, cp, phone, email, addr, stype in suppliers_data:
            supplier = db.query(Supplier).filter(Supplier.name == name).first()
            if not supplier:
                supplier = Supplier(
                    name=name,
                    contact_person=cp,
                    phone=phone,
                    email=email,
                    address=addr,
                    service_type=stype
                )
                db.add(supplier)
        db.commit()

        # 5. Create Tours
        print("Seeding Tours...")
        tours_data = [
            ("Ha Long Bay 2D1N", "Cruising Ha Long Bay", "Quảng Ninh", 2, 2500000, 20),
            ("Sapa Trekking 3D2N", "Explore Sapa mountains", "Lào Cai", 3, 3200000, 15),
            ("Da Nang Beach Holiday", "Sun and sand", "Đà Nẵng", 4, 4500000, 30),
            ("Hue Imperial City", "Historical tour", "Huế", 2, 1800000, 25),
            ("Nha Trang Scuba", "Underwater adventure", "Khánh Hòa", 3, 3800000, 12),
            ("Can Tho Floating Market", "Mekong Delta", "Cần Thơ", 1, 1200000, 40),
        ]
        for name, desc, dest, dur, price, max_p in tours_data:
            tour = db.query(Tour).filter(Tour.name == name).first()
            if not tour:
                start_date = date.today() + timedelta(days=random.randint(10, 60))
                tour = Tour(
                    name=name,
                    description=desc,
                    destination=dest,
                    duration=dur,
                    price=Decimal(price),
                    max_participants=max_p,
                    start_date=start_date,
                    end_date=start_date + timedelta(days=dur-1),
                    status="active"
                )
                db.add(tour)
        db.commit()

        # 6. Create Orders
        print("Seeding Orders...")
        customers = db.query(Customer).all()
        tours = db.query(Tour).all()
        for _ in range(30):
            cust = random.choice(customers)
            tour = random.choice(tours)
            quantity = random.randint(1, 4)
            order = Order(
                customer_id=cust.id,
                tour_id=tour.id,
                quantity=quantity,
                total_price=tour.price * quantity,
                status=random.choice(["pending", "confirmed", "cancelled"]),
                payment_status=random.choice(["unpaid", "paid"])
            )
            db.add(order)
        db.commit()

        # 7. Create Vehicles
        print("Seeding Vehicles...")
        supplier = db.query(Supplier).filter(Supplier.service_type == "transport").first()
        if supplier:
            for i in range(1, 6):
                plate = f"29A-{random.randint(10000, 99999)}"
                vehicle = db.query(Vehicle).filter(Vehicle.plate_number == plate).first()
                if not vehicle:
                    vehicle = Vehicle(
                        plate_number=plate,
                        type=random.choice(["bus", "van", "car"]),
                        capacity=random.choice([4, 7, 16, 29, 45]),
                        supplier_id=supplier.id,
                        status="available"
                    )
                    db.add(vehicle)
        db.commit()

        # 8. Create Tour Guides
        print("Seeding Tour Guides...")
        tour_guide_employees = db.query(Employee).filter(Employee.position == "Tour Guide").all()
        languages_list = ["English", "French", "Japanese", "Korean", "Chinese", "German", "Spanish"]
        
        for employee in tour_guide_employees:
            guide = db.query(TourGuide).filter(TourGuide.employee_id == employee.id).first()
            if not guide:
                # Assign random languages (2-4 languages per guide)
                num_languages = random.randint(2, 4)
                guide_languages = random.sample(languages_list, num_languages)
                
                guide = TourGuide(
                    employee_id=employee.id,
                    license_number=f"HG-{random.randint(10000, 99999)}",
                    languages=guide_languages,
                    rating=Decimal(random.uniform(3.5, 5.0)).quantize(Decimal('0.1'))
                )
                db.add(guide)
        db.commit()

        print("Seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
