from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.db import Base

class Book(Base):
    __tablename__ = "library"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    description = Column(String, nullable=True)
    file_url = Column(String, nullable=False)   # path or URL to uploaded file
    file_type = Column(String, nullable=False)  # e.g. 'pdf' or 'txt'
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # ✅ Foreign key linking to user
    uploader_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    # ✅ Relationship to User
    uploader = relationship("User", back_populates="books")
