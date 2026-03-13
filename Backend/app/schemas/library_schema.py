from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.user_schema import UserResponse


# 📚 Base schema (shared by all)
class LibraryBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None


# 🆕 Create schema (for uploading)
class LibraryCreate(LibraryBase):
    file_url: str
    file_type: str
    uploader_id: int


# 🧠 Response schema (what frontend receives)
class LibraryResponse(LibraryBase):
    id: int
    file_url: str
    file_type: str
    uploaded_at: datetime
    uploader: Optional[UserResponse] = None  # ✅ nested uploader info

    class Config:
        orm_mode = True
