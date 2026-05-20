from pydantic import BaseModel
from typing import Optional

class VehicleBase(BaseModel):
    plate_number: str
    type: Optional[str] = None
    capacity: Optional[int] = None
    supplier_id: Optional[int] = None
    status: Optional[str] = "available"

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: int

    class Config:
        from_attributes = True
