from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.order import Order as OrderModel
from app.schemas.order import Order, OrderCreate, OrderUpdate

from app.models.customer import Customer as CustomerModel
from app.models.tour import Tour as TourModel
from app.models.user import User as UserModel
from app.dependencies.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[Order])
async def get_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    orders = (
        db.query(OrderModel)
        .outerjoin(CustomerModel, OrderModel.customer_id == CustomerModel.id)
        .outerjoin(TourModel, OrderModel.tour_id == TourModel.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return orders
 
 
@router.get("/my-orders", response_model=List[Order])
async def get_my_orders(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    customer = db.query(CustomerModel).filter(CustomerModel.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
        
    orders = (
        db.query(OrderModel)
        .filter(OrderModel.customer_id == customer.id)
        .order_by(OrderModel.created_at.desc())
        .all()
    )
    return orders


@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/", response_model=Order)
async def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    # Check tour capacity
    tour = db.query(TourModel).filter(TourModel.id == order_in.tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    # Calculate current bookings (only count non-cancelled orders)
    current_booked = db.query(func.sum(OrderModel.quantity)).filter(
        OrderModel.tour_id == tour.id,
        OrderModel.status != "cancelled"
    ).scalar() or 0
    
    if current_booked + order_in.quantity > tour.max_participants:
        remaining = tour.max_participants - current_booked
        detail = "Tour đã hết chỗ." if remaining <= 0 else f"Tour không đủ chỗ. Còn lại: {remaining} chỗ."
        raise HTTPException(status_code=400, detail=detail)

    order = OrderModel(**order_in.model_dump())
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.put("/{order_id}", response_model=Order)
async def update_order(order_id: int, order_in: OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = order_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(order, key, value)
    
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.post("/{order_id}/pay", response_model=Order)
async def pay_order(
    order_id: int, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    # Verify order belongs to customer
    customer = db.query(CustomerModel).filter(CustomerModel.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
        
    order = db.query(OrderModel).filter(
        OrderModel.id == order_id,
        OrderModel.customer_id == customer.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.payment_status == "paid":
        raise HTTPException(status_code=400, detail="Đơn hàng đã được thanh toán.")
        
    order.payment_status = "paid"
    order.status = "confirmed" # confirmed means "Đã thanh toán" in UI logic
    
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}")
async def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"message": f"Order {order_id} deleted"}
