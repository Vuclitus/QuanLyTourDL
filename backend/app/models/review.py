from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func, Float
from sqlalchemy.orm import relationship
from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    tour_id = Column(Integer, ForeignKey("tours.id"))
    guide_id = Column(Integer, ForeignKey("tour_guides.id"), nullable=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    customer = relationship("Customer")
    tour = relationship("Tour")
    guide = relationship("TourGuide")
