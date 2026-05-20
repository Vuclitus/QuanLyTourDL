from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.settings import SystemSettings as SystemSettingsModel
from app.schemas.settings import SystemSettings as SystemSettingsSchema, SystemSettingsUpdate

router = APIRouter()


@router.get("/", response_model=SystemSettingsSchema)
async def get_settings(db: Session = Depends(get_db)):
    settings = db.query(SystemSettingsModel).filter(SystemSettingsModel.id == 1).first()
    if not settings:
        # Create default settings if not exists
        settings = SystemSettingsModel(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.put("/", response_model=SystemSettingsSchema)
async def update_settings(
    settings_in: SystemSettingsUpdate,
    db: Session = Depends(get_db)
):
    settings = db.query(SystemSettingsModel).filter(SystemSettingsModel.id == 1).first()
    if not settings:
        settings = SystemSettingsModel(id=1)
        db.add(settings)
    
    update_data = settings_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings
