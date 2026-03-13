from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserInteractionCreate(BaseModel):
    user_id: int
    page: str
    action: str
    duration: Optional[int] = None
    timestamp: Optional[datetime] = None


class UserInteractionResponse(UserInteractionCreate):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True
