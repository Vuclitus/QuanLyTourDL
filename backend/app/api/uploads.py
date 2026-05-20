from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.storage import storage_service
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.upload import Upload

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        res = await storage_service.upload_file(
            content, 
            file.filename, 
            file.content_type
        )
        
        # Save to database
        db_upload = Upload(
            original_filename=res["original_filename"],
            filename=res["filename"],
            url=res["url"],
            content_type=file.content_type,
            size=res["size"]
        )
        db.add(db_upload)
        db.commit()
        db.refresh(db_upload)
        
        return {
            "id": db_upload.id,
            "url": db_upload.url,
            "filename": db_upload.filename,
            "original_filename": db_upload.original_filename,
            "size": db_upload.size
        }
    except Exception as e:
        import traceback
        with open("upload_error.log", "a") as f:
            f.write(f"Upload error: {str(e)}\n")
            f.write(traceback.format_exc())
            f.write("-" * 20 + "\n")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-multiple")
async def upload_multiple_files(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    results = []
    for file in files:
        try:
            content = await file.read()
            res = await storage_service.upload_file(
                content, 
                file.filename, 
                file.content_type
            )
            
            # Save to database
            db_upload = Upload(
                original_filename=res["original_filename"],
                filename=res["filename"],
                url=res["url"],
                content_type=file.content_type,
                size=res["size"]
            )
            db.add(db_upload)
            db.commit()
            db.refresh(db_upload)
            
            results.append({
                "id": db_upload.id,
                "url": db_upload.url,
                "filename": db_upload.filename,
                "size": db_upload.size
            })
        except Exception as e:
            continue
    return results
