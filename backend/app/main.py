# Force reload - updated B2 credentials
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, tours, customers, orders, employees, suppliers, reports, settings, guides_vehicles, uploads, feedbacks, contacts, ai
from fastapi.staticfiles import StaticFiles
import os
from app.core.config import settings as app_settings

app = FastAPI(
    title="Tour Management System API",
    description="API cho hệ thống quản lý tour du lịch",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin).rstrip("/") for origin in app_settings.BACKEND_CORS_ORIGINS] + ["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(tours.router, prefix="/api/v1/tours", tags=["tours"])
app.include_router(customers.router, prefix="/api/v1/customers", tags=["customers"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(employees.router, prefix="/api/v1/employees", tags=["employees"])
app.include_router(suppliers.router, prefix="/api/v1/suppliers", tags=["suppliers"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(settings.router, prefix="/api/v1/settings", tags=["settings"])
app.include_router(guides_vehicles.router, prefix="/api/v1/guides-vehicles", tags=["guides-vehicles"])
app.include_router(uploads.router, prefix="/api/v1/uploads", tags=["uploads"])
app.include_router(feedbacks.router, prefix="/api/v1/feedbacks", tags=["feedbacks"])
app.include_router(contacts.router, prefix="/api/v1/contacts", tags=["contacts"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])

@app.get("/")
async def root():
    return {"message": "Tour Management System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
