from datetime import datetime
from pydantic import BaseModel

class HistoryCreate(BaseModel):
    word: str

class HistoryResponse(BaseModel):
    id: int
    word: str
    created_at: datetime

    class Config:
        orm_mode = True