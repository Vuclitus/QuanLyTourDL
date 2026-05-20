from sqlalchemy import Column, Integer, String, Text, Numeric, Date, DateTime, func, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.core.database import Base


# Association table for Many-to-Many relationship between Tour and TourGuide
tour_guide_assignments = Table(
    "tour_guide_assignments",
    Base.metadata,
    Column("tour_id", Integer, ForeignKey("tours.id", ondelete="CASCADE"), primary_key=True),
    Column("guide_id", Integer, ForeignKey("tour_guides.id", ondelete="CASCADE"), primary_key=True),
)

# Association table for Many-to-Many relationship between Tour and Supplier
tour_supplier_assignments = Table(
    "tour_supplier_assignments",
    Base.metadata,
    Column("tour_id", Integer, ForeignKey("tours.id", ondelete="CASCADE"), primary_key=True),
    Column("supplier_id", Integer, ForeignKey("suppliers.id", ondelete="CASCADE"), primary_key=True),
)


class Tour(Base):
    __tablename__ = "tours"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    destination = Column(String(255))
    duration = Column(String(100))
    price = Column(Numeric(10, 2))
    max_participants = Column(Integer)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String(50), default="active")
    category = Column(String(100), default="Nghỉ dưỡng")
    image_url = Column(String(500))
    image_size = Column(Integer)
    
    # Relationships
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    schedules = relationship("TourSchedule", back_populates="tour", cascade="all, delete-orphan")
    guides = relationship("TourGuide", secondary=tour_guide_assignments)
    vehicle = relationship("Vehicle")
    supplier = relationship("Supplier") # Keeping for legacy/single access
    suppliers = relationship("Supplier", secondary=tour_supplier_assignments)


class TourSchedule(Base):
    __tablename__ = "tour_schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    tour_id = Column(Integer, ForeignKey("tours.id"))
    day_number = Column(Integer)
    title = Column(String(255))
    content = Column(Text)
    
    tour = relationship("Tour", back_populates="schedules")
