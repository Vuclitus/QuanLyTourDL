from sqlalchemy import Column, Integer, String, DateTime, func
from app.core.database import Base


class Upload(Base):
    __tablename__ = "uploads"
    
    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String(255))
    filename = Column(String(255))
    url = Column(String(500))
    content_type = Column(String(100))
    size = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
