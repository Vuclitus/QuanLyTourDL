from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.vehicle import Vehicle as VehicleModel
from app.schemas.vehicle import Vehicle, VehicleCreate, VehicleUpdate

router = APIRouter()

@router.get("/", response_model=List[Vehicle])
async def get_vehicles(db: Session = Depends(get_db)):
    return db.query(VehicleModel).all()

@router.get("/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.post("/", response_model=Vehicle)
async def create_vehicle(vehicle_in: VehicleCreate, db: Session = Depends(get_db)):
    vehicle = VehicleModel(**vehicle_in.model_dump())
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.put("/{vehicle_id}", response_model=Vehicle)
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

@router.delete("/{vehicle_id}")
async def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    db.delete(vehicle)
    db.commit()
    return {"message": "Vehicle deleted"}
