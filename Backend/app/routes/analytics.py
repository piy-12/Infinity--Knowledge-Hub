from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.db import get_db  # or get_db if single DB
from app.models.analytics import UserInteraction
from app.schemas.analytics_schema import UserInteractionCreate, UserInteractionResponse

router = APIRouter(tags=["Analytics"])

# ✅ POST: Log a new user interaction
@router.post("/log", response_model=UserInteractionResponse)
def log_interaction(interaction: UserInteractionCreate, db: Session = Depends(get_db)):
    new_interaction = UserInteraction(**interaction.dict())
    db.add(new_interaction)
    db.commit()
    db.refresh(new_interaction)
    return new_interaction



# ✅ GET: Fetch all logged interactions (with filters)
@router.get("/log", response_model=List[UserInteractionResponse])
def get_interactions(
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    page: Optional[str] = Query(None, description="Filter by page name"),
    db: Session = Depends(get_db)
):
    query = db.query(UserInteraction)

    if user_id:
        query = query.filter(UserInteraction.user_id == user_id)
    if page:
        query = query.filter(UserInteraction.page.ilike(f"%{page}%"))

    interactions = query.order_by(UserInteraction.timestamp.desc()).all()

    return interactions  # ✅ return [] if empty (no 404 error)


# ✅ Optional: Health check endpoint for frontend/Grafana
@router.get("/health")
def analytics_health():
    return {"status": "ok", "message": "Analytics service is running"}
