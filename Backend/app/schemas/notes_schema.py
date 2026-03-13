from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NoteCreate(BaseModel):
    user_id: int  # or get from auth
    content: str

class NoteResponse(BaseModel):
    id: int
    user_id: int
    content: str
    created_at: datetime

    class Config:
        orm_mode = True
