from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CustomerReview(BaseModel):
    id: int
    user: Optional[BaseModel] = None # Will hold full_name

    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    customer_id: int
    tour_id: int
    guide_id: Optional[int] = None
    rating: float
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    created_at: datetime
    customer: Optional[BaseModel] = None # We will use a simplified customer info

    class Config:
        from_attributes = True

class ReviewWithCustomer(Review):
    customer_name: Optional[str] = None
    tour_name: Optional[str] = None
