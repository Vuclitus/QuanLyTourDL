from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class OrderBase(BaseModel):
    customer_id: Optional[int] = None
    tour_id: Optional[int] = None
    quantity: int = 1
    total_price: Optional[Decimal] = None
    status: Optional[str] = "pending"
    payment_status: Optional[str] = "unpaid"
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(OrderBase):
    quantity: Optional[int] = None

from app.schemas.customer import Customer
from app.schemas.tour import Tour

class Order(OrderBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    customer: Optional[Customer] = None
    tour: Optional[Tour] = None

    class Config:
        from_attributes = True
