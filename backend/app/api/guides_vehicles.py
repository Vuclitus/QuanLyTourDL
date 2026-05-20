from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.vehicle import Vehicle as VehicleModel
from app.models.tour_guide import TourGuide as TourGuideModel
from app.schemas.tour_guide import TourGuide, TourGuideCreate, TourGuideUpdate
from app.schemas.vehicle import Vehicle, VehicleCreate, VehicleUpdate

from app.models.tour import Tour as TourModel
from app.schemas.tour import Tour as TourSchema
from app.models.review import Review as ReviewModel
from app.schemas.review import Review as ReviewSchema

router = APIRouter()

# --- Vehicles ---
@router.get("/vehicles", response_model=List[Vehicle])
async def get_vehicles(db: Session = Depends(get_db)):
    return db.query(VehicleModel).all()

@router.get("/vehicles/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.get("/vehicles/{vehicle_id}/tours", response_model=List[TourSchema])
async def get_vehicle_tours(vehicle_id: int, db: Session = Depends(get_db)):
    return db.query(TourModel).filter(TourModel.vehicle_id == vehicle_id).all()

@router.post("/vehicles", response_model=Vehicle)
async def create_vehicle(vehicle_in: VehicleCreate, db: Session = Depends(get_db)):
    vehicle = VehicleModel(**vehicle_in.model_dump())
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.put("/vehicles/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(vehicle_id: int, vehicle_in: VehicleUpdate, db: Session = Depends(get_db)):
    vehicle = db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    update_data = vehicle_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vehicle, key, value)
    
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    db.delete(vehicle)
    db.commit()
    return {"message": "Vehicle deleted"}


# --- Guides ---
@router.get("/guides", response_model=List[TourGuide])
async def get_guides(db: Session = Depends(get_db)):
    return db.query(TourGuideModel).all()

@router.get("/guides/{guide_id}", response_model=TourGuide)
async def get_guide(guide_id: int, db: Session = Depends(get_db)):
    guide = db.query(TourGuideModel).filter(TourGuideModel.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Tour guide not found")
    return guide

@router.get("/guides/{guide_id}/tours", response_model=List[TourSchema])
async def get_guide_tours(guide_id: int, db: Session = Depends(get_db)):
    return db.query(TourModel).filter(TourModel.guide_id == guide_id).all()

@router.get("/guides/{guide_id}/reviews")
async def get_guide_reviews(guide_id: int, db: Session = Depends(get_db)):
    reviews = db.query(ReviewModel).filter(ReviewModel.guide_id == guide_id).all()
    result = []
    for r in reviews:
        # Simplified join logic for clarity in this project
        customer_name = "Khách hàng"
        if r.customer and r.customer.user:
            customer_name = r.customer.user.full_name
        
        tour_name = "N/A"
        if r.tour:
            tour_name = r.tour.name
            
        result.append({
            "id": r.id,
            "customer_name": customer_name,
            "tour_name": tour_name,
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at
        })
    return result

@router.post("/guides", response_model=TourGuide)
async def create_guide(guide_in: TourGuideCreate, db: Session = Depends(get_db)):
    guide = TourGuideModel(**guide_in.model_dump())
    db.add(guide)
    db.commit()
    db.refresh(guide)
    return guide

@router.put("/guides/{guide_id}", response_model=TourGuide)
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

@router.delete("/guides/{guide_id}")
async def delete_guide(guide_id: int, db: Session = Depends(get_db)):
    guide = db.query(TourGuideModel).filter(TourGuideModel.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Tour guide not found")
    db.delete(guide)
    db.commit()
    return {"message": "Tour guide deleted"}
