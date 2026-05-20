from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.tour import Tour as TourModel, TourSchedule as TourScheduleModel
from app.models.tour_guide import TourGuide as TourGuideModel
from app.models.supplier import Supplier as SupplierModel
from app.models.review import Review as ReviewModel
from app.models.order import Order as OrderModel
from app.schemas.tour import Tour, TourCreate, TourUpdate
from sqlalchemy import func

router = APIRouter()


@router.get("/", response_model=List[Tour])
async def get_tours(
    skip: int = 0,
    limit: int = 100,
    q: Optional[str] = None,
    destination: Optional[str] = None,
    start_date: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(TourModel)
    
    if q:
        search = f"%{q}%"
        query = query.filter(
            (TourModel.name.ilike(search)) | 
            (TourModel.description.ilike(search)) |
            (TourModel.destination.ilike(search))
        )
    
    if destination:
        query = query.filter(TourModel.destination.ilike(f"%{destination}%"))

    if start_date:
        query = query.filter(TourModel.start_date >= start_date)
        
    if min_price is not None:
        query = query.filter(TourModel.price >= min_price)
        
    if max_price is not None:
        query = query.filter(TourModel.price <= max_price)
        
    tours = query.offset(skip).limit(limit).all()
    
    result = []
    for tour in tours:
        # Calculate rating: Start with 5.0 and decrease as reviews come in
        review_data = db.query(
            func.count(ReviewModel.id),
            func.sum(ReviewModel.rating)
        ).filter(ReviewModel.tour_id == tour.id).first()
        
        count = review_data[0] or 0
        total_rating = review_data[1] or 0
        
        # Convert to dict to ensure runtime attributes are included in serialization
        tour_dict = {
            "id": tour.id,
            "name": tour.name,
            "description": tour.description,
            "destination": tour.destination,
            "duration": tour.duration,
            "price": tour.price,
            "max_participants": tour.max_participants,
            "start_date": tour.start_date,
            "end_date": tour.end_date,
            "status": tour.status,
            "image_url": tour.image_url,
            "image_size": tour.image_size,
            "guides": tour.guides,
            "suppliers": tour.suppliers,
            "vehicle_id": tour.vehicle_id,
            "supplier_ids": [s.id for s in tour.suppliers],
            "created_at": tour.created_at,
            "updated_at": tour.updated_at,
            "schedules": tour.schedules,
            "review_count": count,
            "rating": round((5.0 + float(total_rating)) / (count + 1), 1),
            "current_booked": db.query(func.sum(OrderModel.quantity)).filter(
                OrderModel.tour_id == tour.id,
                OrderModel.status != "cancelled"
            ).scalar() or 0
        }
        result.append(tour_dict)
        
    return result


@router.get("/{tour_id}", response_model=Tour)
async def get_tour(tour_id: int, db: Session = Depends(get_db)):
    tour = db.query(TourModel).filter(TourModel.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    # Calculate rating: Start with 5.0 and decrease as reviews come in
    # Formula: (5.0 + sum(ratings)) / (count + 1)
    review_data = db.query(
        func.count(ReviewModel.id),
        func.sum(ReviewModel.rating)
    ).filter(ReviewModel.tour_id == tour_id).first()
    
    count = review_data[0] or 0
    total_rating = review_data[1] or 0
    
    # Convert to dict to ensure runtime attributes are included in serialization
    tour_data = {
        "id": tour.id,
        "name": tour.name,
        "description": tour.description,
        "destination": tour.destination,
        "duration": tour.duration,
        "price": tour.price,
        "max_participants": tour.max_participants,
        "start_date": tour.start_date,
        "end_date": tour.end_date,
        "status": tour.status,
        "image_url": tour.image_url,
        "image_size": tour.image_size,
        "guides": tour.guides,
        "suppliers": tour.suppliers,
        "vehicle_id": tour.vehicle_id,
        "supplier_ids": [s.id for s in tour.suppliers],
        "created_at": tour.created_at,
        "updated_at": tour.updated_at,
        "schedules": tour.schedules,
        "review_count": count,
        "rating": round((5.0 + float(total_rating)) / (count + 1), 1),
        "current_booked": db.query(func.sum(OrderModel.quantity)).filter(
            OrderModel.tour_id == tour_id,
            OrderModel.status != "cancelled"
        ).scalar() or 0
    }
    
    return tour_data


@router.post("/", response_model=Tour)
async def create_tour(tour_in: TourCreate, db: Session = Depends(get_db)):
    tour_data = tour_in.model_dump(exclude={"schedules", "guide_ids", "supplier_ids"})
    schedules_data = tour_in.schedules or []
    guide_ids = tour_in.guide_ids or []
    supplier_ids = tour_in.supplier_ids or []
    
    tour = TourModel(**tour_data)
    
    # Handle guides
    if guide_ids:
        guides = db.query(TourGuideModel).filter(TourGuideModel.id.in_(guide_ids)).all()
        tour.guides = guides
        
    # Handle suppliers
    if supplier_ids:
        suppliers = db.query(SupplierModel).filter(SupplierModel.id.in_(supplier_ids)).all()
        tour.suppliers = suppliers
        
    db.add(tour)
    db.commit()
    db.refresh(tour)
    
    # Create schedules
    for sch in schedules_data:
        db_sch = TourScheduleModel(**sch.model_dump(), tour_id=tour.id)
        db.add(db_sch)
    
    db.commit()
    db.refresh(tour)
    return tour


@router.put("/{tour_id}", response_model=Tour)
async def update_tour(tour_id: int, tour_in: TourUpdate, db: Session = Depends(get_db)):
    tour = db.query(TourModel).filter(TourModel.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    update_data = tour_in.model_dump(exclude={"schedules", "guide_ids", "supplier_ids"}, exclude_unset=True)
    for key, value in update_data.items():
        setattr(tour, key, value)
    
    # Update guides if provided
    if tour_in.guide_ids is not None:
        guides = db.query(TourGuideModel).filter(TourGuideModel.id.in_(tour_in.guide_ids)).all()
        tour.guides = guides
        
    # Update suppliers if provided
    if tour_in.supplier_ids is not None:
        suppliers = db.query(SupplierModel).filter(SupplierModel.id.in_(tour_in.supplier_ids)).all()
        tour.suppliers = suppliers
    
    # Update schedules if provided
    if tour_in.schedules is not None:
        # Simple approach: delete existing and recreate
        db.query(TourScheduleModel).filter(TourScheduleModel.tour_id == tour_id).delete()
        for sch in tour_in.schedules:
            # Exclude id to avoid conflicts when recreating
            sch_data = sch.model_dump(exclude={"id"})
            db_sch = TourScheduleModel(**sch_data, tour_id=tour.id)
            db.add(db_sch)
    
    db.add(tour)
    db.commit()
    db.refresh(tour)
    return tour


@router.delete("/{tour_id}")
async def delete_tour(tour_id: int, db: Session = Depends(get_db)):
    tour = db.query(TourModel).filter(TourModel.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    db.delete(tour)
    db.commit()
    return {"message": f"Tour {tour_id} deleted"}
