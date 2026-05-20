from sqlalchemy import Column, Integer, String, JSON, DateTime, func
from app.core.database import Base


class SystemSettings(Base):
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # General settings
    site_name = Column(String(255), default="LuxeVoyage")
    contact_email = Column(String(255), default="contact@luxevoyage.vn")
    contact_phone = Column(String(50), default="+84 123 456 789")
    address = Column(String(500), default="Tầng 15, Tòa nhà Bitexco, Quận 1, TP.HCM")
    logo_url = Column(String(1000), nullable=True)
    
    # Region settings
    timezone = Column(String(100), default="(GMT+07:00) Bangkok, Hanoi, Jakarta")
    default_language = Column(String(50), default="Tiếng Việt")
    
    # SMTP settings
    smtp_host = Column(String(255), default="smtp.gmail.com")
    smtp_port = Column(Integer, default=587)
    smtp_user = Column(String(255), nullable=True)
    smtp_password = Column(String(255), nullable=True)
    
    # Payment settings
    default_payment_gateway = Column(String(50), default="VNPay")
    vnpay_config = Column(JSON, default={
        "tmn_code": "GH73KD92",
        "hash_secret": "A1B2C3D4E5F6G7H8I9J0K1L2M3N405P6",
        "is_sandbox": True
    })
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
