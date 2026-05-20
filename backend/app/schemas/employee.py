from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
from decimal import Decimal

class EmployeeBase(BaseModel):
    position: Optional[str] = "Nhân viên"
    department: Optional[str] = "Sales"
    salary: Optional[Decimal] = 0
    hire_date: Optional[date] = None
    phone: Optional[str] = None
    status: Optional[str] = "Đang làm việc"
    image_url: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    full_name: str
    email: EmailStr
    password: Optional[str] = "123456"

class EmployeeUpdate(EmployeeBase):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

from app.schemas.customer import User

class Employee(EmployeeBase):
    id: int
    user_id: int
    created_at: datetime
    user: Optional[User] = None

    class Config:
        from_attributes = True
