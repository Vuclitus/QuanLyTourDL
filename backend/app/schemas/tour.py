from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal

class TourScheduleBase(BaseModel):
    day_number: int
    title: str
    content: str

class TourScheduleCreate(TourScheduleBase):
    pass

class TourSchedule(TourScheduleBase):
    id: int
    tour_id: int

    class Config:
        from_attributes = True

from app.schemas.tour_guide import TourGuide

class TourBase(BaseModel):
    name: str
    description: Optional[str] = None
    destination: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[Decimal] = None
    max_participants: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = "active"
    image_url: Optional[str] = None
    image_size: Optional[int] = None
    guide_ids: Optional[List[int]] = []
    vehicle_id: Optional[int] = None
    supplier_ids: Optional[List[int]] = []

class TourCreate(TourBase):
    schedules: Optional[List[TourScheduleCreate]] = []

class TourUpdate(TourBase):
    name: Optional[str] = None
    schedules: Optional[List[TourScheduleCreate]] = None

from app.schemas.supplier import Supplier as SupplierSchema

class Tour(TourBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    schedules: List[TourSchedule] = []
    guides: List[TourGuide] = []
    suppliers: List[SupplierSchema] = []
    rating: float = 5.0
    review_count: int = 0
    current_booked: int = 0

    class Config:
        from_attributes = True
