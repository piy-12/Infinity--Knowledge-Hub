from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.schemas.user_schema import UserSignup, UserLogin
from app.models.users import User
from app.database.db import get_db
from app.auth.hash import Hash
from app.auth.jwt_handler import create_access_token, get_current_user
from fastapi.staticfiles import StaticFiles
import os, shutil

router = APIRouter(tags=["Authentication"])

# Directory for avatar storage
AVATAR_DIR = "app/static/avatars"
os.makedirs(AVATAR_DIR, exist_ok=True)

# ======================================================
# 🧩 USER SIGNUP
# ======================================================
@router.post("/signup")
def register(user: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = Hash.bcrypt(user.password)

    new_user = User(
        username=user.username,
        full_name=user.full_name,
        password=hashed_password,
        avatar_url="/avatars/default.png",
        role=user.role or "student"  # 🆕 default to 'student'
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "id": new_user.id,
        "username": new_user.username,
        "full_name": new_user.full_name,
        "avatar_url": new_user.avatar_url,
        "role": new_user.role,  # 🆕 Include role
    })

    return {
        "message": "User created successfully",
        "access_token": token,
        "token_type": "bearer",
        "role": new_user.role
    }

# ======================================================
# 🔐 USER LOGIN
# ======================================================
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    if not Hash.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({
        "id": db_user.id,
        "username": db_user.username,
        "full_name": db_user.full_name,
        "avatar_url": db_user.avatar_url,
        "role": db_user.role,  # 🆕 Include role in token
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "full_name": db_user.full_name,
            "avatar_url": db_user.avatar_url,
            "role": db_user.role,  # 🆕 Return role
        }
    }

# ======================================================
# 👤 GET CURRENT USER PROFILE
# ======================================================
@router.get("/me")
def get_current_user_route(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.get("id")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "role": user.role  # 🆕 Include role
    }

# ======================================================
# 🖼️ UPLOAD / CHANGE AVATAR
# ======================================================
@router.post("/users/me/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    filename = f"{user_id}_{file.filename}"
    filepath = os.path.join(AVATAR_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    avatar_url = f"/avatars/{filename}"

    user = db.query(User).filter(User.id == user_id).first()
    user.avatar_url = avatar_url
    db.commit()
    db.refresh(user)

    return {
        "message": "Avatar updated successfully",
        "avatar_url": avatar_url
    }

# ======================================================
# 🔁 RESET AVATAR TO DEFAULT
# ======================================================
@router.delete("/users/me/avatar")
def reset_avatar(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.avatar_url = "/avatars/default.png"
    db.commit()
    db.refresh(user)

    return {"message": "Avatar reset to default", "avatar_url": user.avatar_url}
