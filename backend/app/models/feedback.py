from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from app.models.tour_guide import TourGuide

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    tour_id = Column(Integer, ForeignKey("tours.id"), nullable=True)
    guide_id = Column(Integer, ForeignKey("tour_guides.id"), nullable=True)
    full_name = Column(String(255), nullable=True) # Optional for anonymous
    email = Column(String(255), nullable=False)
    rating = Column(Integer, default=5)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer")
    tour = relationship("Tour")
    guide = relationship("TourGuide")
