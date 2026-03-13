from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)

    # 🆕 Role Field — default to "student"
    role = Column(String, default="student", nullable=False)

    # ✅ Relationship to uploaded books
    books = relationship("Book", back_populates="uploader")

    # ✅ Relationship to ChatSession (each chat session belongs to a user)
    sessions = relationship("ChatSession", back_populates="user", cascade="all, delete")
