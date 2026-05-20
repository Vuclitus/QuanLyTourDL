from sqlalchemy import Column, Integer, ForeignKey, Numeric, String, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    tour_id = Column(Integer, ForeignKey("tours.id"))
    quantity = Column(Integer, nullable=False)
    total_price = Column(Numeric(10, 2))
    status = Column(String(50), default="pending")
    payment_status = Column(String(50), default="unpaid")
    payment_method = Column(String(50), nullable=True)
    notes = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    customer = relationship("Customer", back_populates="orders")
    tour = relationship("Tour")
