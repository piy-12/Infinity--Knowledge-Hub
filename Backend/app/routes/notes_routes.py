from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List
from app.database.db import get_db
from app.models.notes import Note
from app.schemas.notes_schema import NoteResponse, NoteCreate

router = APIRouter(tags=["Notes"])

# Get all notes for a user
@router.get("/{user_id}", response_model=List[NoteResponse])
def get_notes(user_id: int, db: Session = Depends(get_db)):
    try:
        notes = (
            db.query(Note)
            .filter(Note.user_id == user_id)
            .order_by(Note.created_at.desc())
            .all()
        )
        return notes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.post("/create", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    new_note = Note(
        user_id=note.user_id,
        content=note.content,
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


