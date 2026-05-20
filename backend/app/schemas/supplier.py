from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SupplierBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    service_type: Optional[str] = None
    image_url: Optional[str] = None
    image_size: Optional[int] = None
    contract_url: Optional[str] = None
    contract_size: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[str] = "Đang hoạt động"

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(SupplierBase):
    name: Optional[str] = None

class Supplier(SupplierBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
