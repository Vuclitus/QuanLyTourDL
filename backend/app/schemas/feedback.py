from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class FeedbackBase(BaseModel):
    full_name: Optional[str] = None
    email: EmailStr
    rating: int = 5
    comment: str
    tour_id: Optional[int] = None
    guide_id: Optional[int] = None

class FeedbackCreate(FeedbackBase):
    customer_id: Optional[int] = None

class Feedback(FeedbackBase):
    id: int
    customer_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
