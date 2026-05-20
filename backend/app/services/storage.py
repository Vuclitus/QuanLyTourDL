from supabase import create_client, Client
from fastapi import HTTPException
from app.core.config import settings
import uuid
import os

class StorageService:
    def __init__(self):
        try:
            self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            self.bucket_name = settings.SUPABASE_STORAGE_BUCKET
            self._ensure_bucket_exists()
            print(f"StorageService: Initialized for Supabase bucket {self.bucket_name}")
        except Exception as e:
            print(f"StorageService: Failed to init Supabase: {e}")
            self.supabase = None

    def _ensure_bucket_exists(self):
        """
        Checks if the bucket exists by trying to fetch its metadata.
        """
        if not self.supabase:
            return

        try:
            # Try to get bucket metadata directly
            self.supabase.storage.get_bucket(self.bucket_name)
            print(f"StorageService: Verified bucket '{self.bucket_name}' exists.")
        except Exception as e:
            # If get_bucket fails, it might not exist or we don't have permission
            error_msg = str(e)
            if "not found" in error_msg.lower() or "404" in error_msg:
                print(f"StorageService: Bucket '{self.bucket_name}' not found. Trying to create...")
                try:
                    self.supabase.storage.create_bucket(self.bucket_name, options={"public": True})
                    print(f"StorageService: Created bucket '{self.bucket_name}' successfully.")
                except Exception as create_err:
                    print(f"StorageService: Could not create bucket automatically: {create_err}")
                    print(f"CRITICAL: Please ensure bucket '{self.bucket_name}' exists in Supabase Dashboard.")
            else:
                # Permission error or something else, but we'll assume it exists if we can't verify
                print(f"StorageService: Bucket existence check bypassed (likely permission issue): {e}")

    async def upload_file(self, file_content, filename: str, content_type: str = None) -> dict:
        """
        Uploads a file to Supabase Storage.
        """
        ext = os.path.splitext(filename)[1]
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_size = len(file_content)
        file_path = f"uploads/{unique_filename}"

        try:
            if not self.supabase:
                raise Exception("Supabase client not initialized. Check your credentials in .env")

            # Upload to Supabase
            res = self.supabase.storage.from_(self.bucket_name).upload(
                path=file_path,
                file=file_content,
                file_options={"content-type": content_type} if content_type else None
            )
            
            # Get public URL
            public_url = self.supabase.storage.from_(self.bucket_name).get_public_url(file_path)
            
            return {
                "url": public_url, 
                "size": file_size, 
                "filename": unique_filename,
                "original_filename": filename
            }
        except Exception as e:
            error_msg = str(e)
            if "Bucket not found" in error_msg:
                error_msg = f"Bucket '{self.bucket_name}' not found in Supabase. Please create it in the Supabase Dashboard and set it to Public."
            
            print(f"Supabase Upload failed: {error_msg}")
            import traceback
            with open("upload_error.log", "a") as f:
                f.write(f"Supabase Upload error: {error_msg}\n")
                f.write(traceback.format_exc())
                f.write("-" * 20 + "\n")
            raise HTTPException(status_code=500, detail=error_msg)

storage_service = StorageService()
