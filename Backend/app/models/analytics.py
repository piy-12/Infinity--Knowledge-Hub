from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database.db import Base

class UserInteraction(Base):
    __tablename__ = "user_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    page = Column(String, nullable=False)
    action = Column(String, nullable=False)
    duration = Column(Integer, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
