from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ============================================================
# 1️⃣ AUTH DATABASE (User accounts, login, etc.)
# ============================================================
AUTH_DB_URL = "postgresql://postgres:12345@localhost:5432/fastapi_auth"

engine = create_engine(AUTH_DB_URL)
AuthSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = AuthSessionLocal()
    try:
        yield db
    finally:
        db.close()

