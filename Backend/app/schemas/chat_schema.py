from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# ============================================================
# 🔹 1️⃣ Base Schemas
# ============================================================
class ChatMessageBase(BaseModel):
    sender: str
    message: str


# ============================================================
# 🔹 2️⃣ Create Message Schema (for DB insert)
# ============================================================
class ChatMessageCreate(ChatMessageBase):
    session_id: int


# ============================================================
# 🔹 3️⃣ Message Response Schema (for returning from API)
# ============================================================
class ChatMessageResponse(ChatMessageBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# ============================================================
# 🔹 4️⃣ Chat Session Schemas
# ============================================================
class ChatSessionBase(BaseModel):
    title: str


class ChatSessionCreate(ChatSessionBase):
    user_id: int


class ChatSessionResponse(ChatSessionBase):
    id: int
    user_id: int
    created_at: datetime
    messages: Optional[List[ChatMessageResponse]] = []

    class Config:
        orm_mode = True


# ============================================================
# 🔹 5️⃣ Chat Request Schema (for JSON body in /chat route)
# ============================================================
class ChatRequest(BaseModel):
    session_id: Optional[int] = None 
    user_id: int
    prompt: str
# ============================================================
# 🔹 6️⃣ Chat Response Schema (optional, for consistent API)
# ============================================================
class ChatResponse(BaseModel):
    session_id: int
    response: str
