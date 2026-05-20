from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import Optional, List, Dict
from datetime import date, datetime, timedelta
from app.core.database import get_db
from app.models.order import Order as OrderModel
from app.models.tour import Tour as TourModel
from app.models.customer import Customer as CustomerModel

router = APIRouter()

def apply_filters(query, model, start_date, end_date, category=None):
    if start_date:
        query = query.filter(model.created_at >= start_date)
    if end_date:
        query = query.filter(model.created_at <= end_date)
    if category and hasattr(model, 'tour'): # For OrderModel
        query = query.join(TourModel).filter(TourModel.category == category)
    elif category and model == TourModel:
        query = query.filter(TourModel.category == category)
    return query

@router.get("/dashboard-stats")
async def get_dashboard_stats(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Basic Counts
    tours_query = apply_filters(db.query(TourModel), TourModel, start_date, end_date, category)
    customers_query = apply_filters(db.query(CustomerModel), CustomerModel, start_date, end_date)
    orders_query = apply_filters(db.query(OrderModel), OrderModel, start_date, end_date, category)
    
    total_tours = tours_query.count()
    total_customers = customers_query.count()
    total_orders = orders_query.count()
    total_revenue = orders_query.with_entities(func.sum(OrderModel.total_price)).scalar() or 0
    
    # Calculate Fill Rate
    total_booked = orders_query.with_entities(func.sum(OrderModel.quantity)).scalar() or 0
    total_capacity = tours_query.with_entities(func.sum(TourModel.max_participants)).scalar() or 1
    fill_rate = round((total_booked / total_capacity) * 100, 1) if total_capacity > 0 else 0

    return {
        "revenue": {
            "value": float(total_revenue),
            "change": "+12.5%",
            "label": "DOANH THU"
        },
        "orders": {
            "value": total_orders,
            "change": "+5.2%",
            "label": "SỐ ĐƠN HÀNG"
        },
        "customers": {
            "value": total_customers,
            "change": "+8.1%",
            "label": "SỐ KHÁCH HÀNG"
        },
        "fill_rate": {
            "value": f"{fill_rate}%",
            "change": "+2.4%",
            "label": "TỶ LỆ LẤP ĐẦY"
        }
    }

@router.get("/charts/revenue")
async def get_revenue_chart(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(
        func.to_char(OrderModel.created_at, 'Mon').label('month'),
        func.sum(OrderModel.total_price).label('revenue'),
        func.min(OrderModel.created_at).label('sort_key')
    )
    query = apply_filters(query, OrderModel, start_date, end_date, category)
    results = query.group_by('month').order_by('sort_key').all()
    
    chart_data = [{"name": r.month, "value": float(r.revenue)} for r in results]
    if not chart_data:
        chart_data = [{"name": "No Data", "value": 0}]
    return chart_data

@router.get("/charts/orders")
async def get_orders_chart(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(
        func.to_char(OrderModel.created_at, 'Mon').label('month'),
        func.count(OrderModel.id).label('total'),
        func.min(OrderModel.created_at).label('sort_key')
    )
    query = apply_filters(query, OrderModel, start_date, end_date, category)
    results = query.group_by('month').order_by('sort_key').all()
    
    chart_data = [{"name": r.month, "total": r.total} for r in results]
    if not chart_data:
        chart_data = [{"name": "No Data", "total": 0}]
    return chart_data

@router.get("/charts/categories")
async def get_category_distribution(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(
        TourModel.category,
        func.count(TourModel.id).label('count')
    )
    if start_date:
        query = query.filter(TourModel.created_at >= start_date)
    if end_date:
        query = query.filter(TourModel.created_at <= end_date)
        
    results = query.group_by(TourModel.category).all()
    total = sum(r.count for r in results) or 1
    
    colors = ['#2563eb', '#3b82f6', '#93c5fd', '#bfdbfe']
    chart_data = []
    for i, r in enumerate(results):
        chart_data.append({
            "name": r.category or "Khác",
            "value": round((r.count / total) * 100, 1),
            "color": colors[i % len(colors)]
        })
    if not chart_data:
        chart_data = [{"name": "Nghỉ dưỡng", "value": 100, "color": "#2563eb"}]
    return chart_data

@router.get("/featured-tours")
async def get_featured_tours(limit: int = 4, db: Session = Depends(get_db)):
    # Find tours with most booked participants (sum of quantity)
    query = db.query(
        TourModel,
        func.sum(func.coalesce(OrderModel.quantity, 0)).label('total_booked')
    ).outerjoin(OrderModel, (OrderModel.tour_id == TourModel.id) & (OrderModel.status != 'cancelled')) \
     .group_by(TourModel.id).order_by(func.sum(OrderModel.quantity).desc()).limit(limit)
    
    results = query.all()
    
    featured = []
    for tour, total_booked in results:
        featured.append({
            "id": tour.id,
            "name": tour.name,
            "bookings": int(total_booked or 0),
            "max_participants": tour.max_participants,
            "price": f"{tour.price:,.0f}₫" if tour.price else "0₫",
            "rating": 5.0,
            "image": tour.image_url or 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop'
        })
    
    return featured
