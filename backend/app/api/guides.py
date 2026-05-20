from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.tour_guide import TourGuide as TourGuideModel
from app.schemas.tour_guide import TourGuide, TourGuideCreate, TourGuideUpdate

router = APIRouter()

@router.get("/", response_model=List[TourGuide])
async def get_guides(db: Session = Depends(get_db)):
    return db.query(TourGuideModel).all()

@router.get("/{guide_id}", response_model=TourGuide)
async def get_guide(guide_id: int, db: Session = Depends(get_db)):
    guide = db.query(TourGuideModel).filter(TourGuideModel.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Tour guide not found")
    return guide

@router.post("/", response_model=TourGuide)
async def create_guide(guide_in: TourGuideCreate, db: Session = Depends(get_db)):
    guide = TourGuideModel(**guide_in.model_dump())
    db.add(guide)
    db.commit()
    db.refresh(guide)
    return guide

@router.put("/{guide_id}", response_model=TourGuide)
async def update_guide(guide_id: int, guide_in: TourGuideUpdate, db: Session = Depends(get_db)):
    guide = db.query(TourGuideModel).filter(TourGuideModel.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Tour guide not found")
    
    update_data = guide_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(guide, key, value)
    
    db.add(guide)
    db.commit()
    db.refresh(guide)
    return guide

@router.delete("/{guide_id}")
async def delete_guide(guide_id: int, db: Session = Depends(get_db)):
    guide = db.query(TourGuideModel).filter(TourGuideModel.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Tour guide not found")
    db.delete(guide)
    db.commit()
    return {"message": "Tour guide deleted"}
