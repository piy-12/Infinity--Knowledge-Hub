from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from app.database.db import Base

class DictionaryHistory(Base):
    __tablename__ = "dictionary_history"
    __table_args__ = {'extend_existing': True}  # 👈 Fix if redefinition happens during reload

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    word = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
