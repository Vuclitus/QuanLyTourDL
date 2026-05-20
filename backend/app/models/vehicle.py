from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String(50), unique=True, nullable=False)
    type = Column(String(50))
    capacity = Column(Integer)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="SET NULL"))
    status = Column(String(50), default="available")
