from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.contact import ContactMessage as ContactMessageModel
from app.schemas.contact import ContactMessage, ContactMessageCreate

router = APIRouter()

@router.get("", response_model=List[ContactMessage])
async def get_contact_messages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    messages = db.query(ContactMessageModel).order_by(ContactMessageModel.created_at.desc()).offset(skip).limit(limit).all()
    return messages

@router.post("", response_model=ContactMessage)
async def create_contact_message(message_in: ContactMessageCreate, db: Session = Depends(get_db)):
    message = ContactMessageModel(**message_in.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

@router.delete("/{message_id}")
async def delete_contact_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(ContactMessageModel).filter(ContactMessageModel.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(message)
    db.commit()
    return {"message": "Message deleted"}
