from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.feedback import Feedback as FeedbackModel
from app.schemas.feedback import Feedback, FeedbackCreate

router = APIRouter()

@router.get("", response_model=List[Feedback])
async def get_feedbacks(
    tour_id: Optional[int] = None,
    guide_id: Optional[int] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    query = db.query(FeedbackModel)
    if tour_id:
        query = query.filter(FeedbackModel.tour_id == tour_id)
    if guide_id:
        query = query.filter(FeedbackModel.guide_id == guide_id)
    feedbacks = query.order_by(FeedbackModel.created_at.desc()).offset(skip).limit(limit).all()
    return feedbacks

@router.post("", response_model=Feedback)
async def create_feedback(feedback_in: FeedbackCreate, db: Session = Depends(get_db)):
    print(f"Creating feedback: {feedback_in}")
    try:
        feedback = FeedbackModel(**feedback_in.model_dump())
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        return feedback
    except Exception as e:
        print(f"Error creating feedback: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
