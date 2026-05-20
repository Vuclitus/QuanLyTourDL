from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.supplier import Supplier as SupplierModel
from app.schemas.supplier import Supplier, SupplierCreate, SupplierUpdate

router = APIRouter()


@router.get("/", response_model=List[Supplier])
async def get_suppliers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    suppliers = db.query(SupplierModel).offset(skip).limit(limit).all()
    return suppliers


@router.get("/{supplier_id}", response_model=Supplier)
async def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(SupplierModel).filter(SupplierModel.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier


@router.post("/", response_model=Supplier)
async def create_supplier(supplier_in: SupplierCreate, db: Session = Depends(get_db)):
    supplier = SupplierModel(**supplier_in.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


@router.put("/{supplier_id}", response_model=Supplier)
async def update_supplier(supplier_id: int, supplier_in: SupplierUpdate, db: Session = Depends(get_db)):
    supplier = db.query(SupplierModel).filter(SupplierModel.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    update_data = supplier_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(supplier, key, value)
    
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


from app.models.tour import Tour as TourModel
from app.models.order import Order as OrderModel
from app.models.customer import Customer as CustomerModel

@router.get("/{supplier_id}/bookings")
async def get_supplier_bookings(supplier_id: int, db: Session = Depends(get_db)):
    # Find all tours by this supplier (via many-to-many relationship)
    tours = db.query(TourModel).filter(TourModel.suppliers.any(SupplierModel.id == supplier_id)).all()
    tour_ids = [tour.id for tour in tours]
    
    if not tour_ids:
        return []
        
    # Find all orders for these tours
    bookings = db.query(OrderModel).filter(OrderModel.tour_id.in_(tour_ids)).all()
    
    # Enrich with customer name and tour name
    result = []
    for booking in bookings:
        customer = db.query(CustomerModel).filter(CustomerModel.id == booking.customer_id).first()
        tour = db.query(TourModel).filter(TourModel.id == booking.tour_id).first()
        
        customer_name = "N/A"
        if customer and customer.user:
            customer_name = customer.user.full_name or customer.user.email
        elif customer:
            # Fallback if user relationship is not loaded or missing
            customer_name = customer.phone or "Khách hàng"

        result.append({
            "id": f"#B-{booking.id:04d}",
            "customer": customer_name,
            "date": booking.created_at.strftime("%d/%m/%Y") if booking.created_at else "N/A",
            "amount": f"{booking.total_price:,.0f}đ" if booking.total_price else "0đ",
            "status": booking.status,
            "tour_name": tour.name if tour else "N/A"
        })
    
    return result

@router.delete("/{supplier_id}")
async def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(SupplierModel).filter(SupplierModel.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.delete(supplier)
    db.commit()
    return {"message": f"Supplier {supplier_id} deleted"}
