from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.ai_service import AIService
from typing import List, Dict

router = APIRouter()

@router.post("/chat")
async def chat(
    message: str = Body(..., embed=True),
    history: List[Dict[str, str]] = Body([], embed=True),
    mode: str = Body("client", embed=True),
    db: Session = Depends(get_db)
):
    ai_service = AIService(db)
    
    # Combine history and current message
    messages = history + [{"role": "user", "content": message}]
    
    response = await ai_service.chat(messages, mode=mode)
    
    return {"response": response}
