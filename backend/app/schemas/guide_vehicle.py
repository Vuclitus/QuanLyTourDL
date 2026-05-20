from pydantic import BaseModel
from typing import Optional, List

class VehicleBase(BaseModel):
    plate_number: str
    type: Optional[str] = None
    capacity: Optional[int] = None
    supplier_id: Optional[int] = None
    status: Optional[str] = "available"

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(VehicleBase):
    plate_number: Optional[str] = None

class Vehicle(VehicleBase):
    id: int

    class Config:
        from_attributes = True

class TourGuideBase(BaseModel):
    employee_id: int
    license_number: Optional[str] = None
    languages: Optional[List[str]] = None
    rating: Optional[float] = 5.0

class TourGuideCreate(TourGuideBase):
    pass

class TourGuideUpdate(TourGuideBase):
    employee_id: Optional[int] = None

class TourGuide(TourGuideBase):
    id: int

    class Config:
        from_attributes = True
