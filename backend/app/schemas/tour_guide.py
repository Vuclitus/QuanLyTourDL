from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

class TourGuideBase(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    image_url: Optional[str] = None
    license_number: Optional[str] = None
    languages: Optional[List[str]] = []
    experience: Optional[str] = None
    certificates: Optional[str] = None
    rating: Optional[Decimal] = Decimal('5.0')
    employee_id: Optional[int] = None

class TourGuideCreate(TourGuideBase):
    pass

class TourGuideUpdate(TourGuideBase):
    pass

class TourGuide(TourGuideBase):
    id: int

    class Config:
        from_attributes = True
