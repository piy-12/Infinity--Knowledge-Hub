import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.library import Book
from app.schemas.library_schema import LibraryResponse
from app.database.db import get_db
from datetime import datetime

router = APIRouter(tags=["Library"])

# Directory to store uploaded files
UPLOAD_DIR = "app/uploads/files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {"pdf", "txt",'epub'}

# ============================================================
# 📤 Upload Book
# ============================================================
@router.post("/upload", response_model=LibraryResponse)
async def upload_book(
    title: str = Form(...),
    author: str = Form(...),
    description: str = Form(""),
    uploader_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Validate file type
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files allowed")

    # Save file to disk
    filename = f"{datetime.now().timestamp()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ✅ Save only public-facing URL
    public_url = f"/books/{filename}"

    # Save in DB
    new_book = Book(
        title=title,
        author=author,
        description=description,
        file_url=public_url,  # ✅ store relative URL
        file_type=ext,
        uploader_id=uploader_id,
    )

    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return new_book


# ============================================================
# 📚 Get All Books
# ============================================================
@router.get("/get", response_model=list[LibraryResponse])
async def get_all_books(db: Session = Depends(get_db)):
    books = db.query(Book).all()
    return books
