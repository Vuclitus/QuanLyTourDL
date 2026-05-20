from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    phone = Column(String(20))
    address = Column(Text)
    birthday = Column(DateTime(timezone=True), nullable=True)
    gender = Column(String(10), default="Nam")
    type = Column(String(50), default="Cá nhân")
    rank = Column(String(50), default="Silver")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User")
    orders = relationship("Order", back_populates="customer")
