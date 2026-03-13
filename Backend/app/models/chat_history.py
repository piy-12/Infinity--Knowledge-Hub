from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.db import Base


# =========================
# 🗂️ Chat Session Table
# =========================
class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String, default="New Chat")  # Optional: show in sidebar
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete")
    user = relationship("User", back_populates="sessions")


# =========================
# 💬 Chat Message Table
# =========================
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE"))
    sender = Column(Text, nullable=False)  # "user" or "ai"
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    session = relationship("ChatSession", back_populates="messages")
