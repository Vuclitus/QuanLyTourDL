from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ContactMessageBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessage(ContactMessageBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
