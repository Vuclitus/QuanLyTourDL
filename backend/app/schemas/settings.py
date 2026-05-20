from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class SystemSettingsBase(BaseModel):
    site_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    logo_url: Optional[str] = None
    timezone: Optional[str] = None
    default_language: Optional[str] = None
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    default_payment_gateway: Optional[str] = None
    vnpay_config: Optional[dict] = None

class SystemSettingsUpdate(SystemSettingsBase):
    pass

class SystemSettings(SystemSettingsBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
