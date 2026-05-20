from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Define User schemas first
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    role: Optional[str] = "user"

class User(UserBase):
    id: int
    created_at: datetime
    # updated_at: datetime # Remove if not in model

    class Config:
        from_attributes = True

# Define Customer schemas
class CustomerBase(BaseModel):
    user_id: Optional[int] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    birthday: Optional[datetime] = None
    gender: Optional[str] = "Nam"
    type: Optional[str] = "Cá nhân"
    rank: Optional[str] = "Silver"

class CustomerCreate(CustomerBase):
    full_name: str
    email: EmailStr
    password: Optional[str] = "123456" # Default password for new customers

class CustomerUpdate(CustomerBase):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

class OrderShort(BaseModel):
    id: int
    tour_id: Optional[int] = None
    quantity: int
    total_price: Optional[float] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class Customer(CustomerBase):
    id: int
    created_at: datetime
    user: Optional[User] = None
    orders: list[OrderShort] = []

    class Config:
        from_attributes = True

class CustomerPagination(BaseModel):
    items: list[Customer]
    total: int
    page: int
    size: int
    pages: int
