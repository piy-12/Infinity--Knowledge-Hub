from pydantic import BaseModel
from typing import Optional

# 🧾 Signup Schema
class UserSignup(BaseModel):
    username: str
    full_name: str
    password: str
    role: Optional[str] = "student" 


# 🔐 Login Schema
class UserLogin(BaseModel):
    username: str
    password: str


# 🧠 Response Schema — what you’ll return to the frontend after login/signup/fetch
class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    avatar_url: Optional[str] = None  # ✅ New field for avatar

    class Config:
        orm_mode = True  # Allows returning SQLAlchemy objects directly
