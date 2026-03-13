from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.dictionary import DictionaryHistory
from app.schemas.dictionary_schema import HistoryCreate, HistoryResponse
from app.auth.jwt_handler import get_current_user # assumes JWT auth setup

router = APIRouter(tags=["Dictionary"])



@router.post("/history")
def save_word(
    data: HistoryCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    word = data.word.lower().strip()
    if not word:
        raise HTTPException(status_code=400, detail="Invalid word")

    # ✅ Use dictionary access for user_id and include word in filter
    existing = db.query(DictionaryHistory).filter_by(
        user_id=current_user["id"], word=word
    ).first()

    if not existing:
        new_entry = DictionaryHistory(user_id=current_user["id"], word=word)
        db.add(new_entry)
        db.commit()

    return {"message": "Word saved"}



@router.get("/history", response_model=list[HistoryResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    records = (
        db.query(DictionaryHistory)
        .filter(DictionaryHistory.user_id == current_user["id"])
        .order_by(DictionaryHistory.created_at.desc())
        .limit(10)
        .all()
    )
    return records




# ✅ NEW: Clear all history for current user
@router.delete("/history")
def clear_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    deleted = db.query(DictionaryHistory).filter_by(user_id=current_user["id"]).delete()
    db.commit()
    return {"message": f"Cleared {deleted} history items."}

