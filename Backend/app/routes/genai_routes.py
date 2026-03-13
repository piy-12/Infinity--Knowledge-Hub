from fastapi import APIRouter, Form, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import requests, os

from app.database.db import get_db
from app.models.chat_history import ChatSession, ChatMessage
from app.schemas.chat_schema import ChatRequest

router = APIRouter(tags=["GenAI"])

GENAI_BASE_URL = "http://localhost:8080"

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================================
# 🆕 1️⃣ Create a New Chat Session
# ============================================================
@router.post("/new_session")
async def create_chat_session(user_id: int = Form(...), db: Session = Depends(get_db)):
    new_session = ChatSession(user_id=user_id, title="New Chat")
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return {"session_id": new_session.id, "title": new_session.title}



# ============================================================
# 📤 2️⃣ Upload File
# ============================================================
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        ext = os.path.splitext(file.filename)[1].lower()

        # Handle .txt files with explicit MIME type
        if ext == ".txt":
            with open(file_path, "rb") as f:
                response = requests.post(
                    f"{GENAI_BASE_URL}/upload_file",
                    files={"file": (file.filename, f, "text/plain")},
                    data={"user_id": user_id},
                    timeout=30
                )
        else:
            with open(file_path, "rb") as f:
                response = requests.post(
                    f"{GENAI_BASE_URL}/upload_file",
                    files={"file": f},
                    data={"user_id": user_id},
                    timeout=30
                )

        if not response.ok:
            raise HTTPException(status_code=500, detail="Error sending file to GenAI service")

        ai_data = response.json()
        return {
            "message": "File uploaded successfully",
            "ai_response": ai_data.get("summary") or ai_data.get("message", ""),
            "filename": file.filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {e}")


# ============================================================
# 💬 3️⃣ Chat with AI — Save Both User + AI Messages
# ============================================================
@router.post("/query")
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    session_id = request.session_id
    user_id = request.user_id
    prompt = request.prompt.strip()

    print(f"🧠 Incoming chat | session_id={session_id}, user_id={user_id}, prompt={prompt}")

    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    # 1️⃣ Save user's message
    user_msg = ChatMessage(session_id=session_id, sender="user", message=prompt)
    db.add(user_msg)
    db.commit()

    # 2️⃣ Query AI backend
    try:
        ai_response = requests.post(
            f"{GENAI_BASE_URL}/query",
            json={"query": prompt},
            timeout=30
        )
        print("🔍 AI raw response:", ai_response.text)
        ai_response.raise_for_status()
        ai_data = ai_response.json()
        ai_text = (
            ai_data.get("answer")
            or ai_data.get("response")
            or ai_data.get("message")
            or "No response from AI backend."
        )
    except Exception as e:
        print("⚠️ AI backend error:", e)
        ai_text = "⚠️ Could not connect to AI backend."

    # 3️⃣ Save AI message
    ai_msg = ChatMessage(session_id=session_id, sender="ai", message=ai_text)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    # ✅ Standardized return format
    return {"response": ai_text, "session_id": session_id}

# ============================================================
# 📜 4️⃣ Get All Sessions for a User (Sidebar)
# ============================================================
@router.get("/sessions/{user_id}")
def get_user_sessions(user_id: int, db: Session = Depends(get_db)):
    try:
        sessions = (
            db.query(ChatSession)
            .filter(ChatSession.user_id == user_id)
            .order_by(ChatSession.created_at.desc())
            .all()
        )
        return [
            {"id": s.id, "title": s.title, "created_at": s.created_at}
            for s in sessions
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sessions: {e}")


# ============================================================
# 💭 5️⃣ Get All Messages from a Session (Chat Window)
# ============================================================
@router.get("/messages/{session_id}")
def get_session_messages(session_id: int, db: Session = Depends(get_db)):
    try:
        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
            .all()
        )
        return [
            {
                "id": m.id,
                "sender": m.sender,
                "message": m.message,
                "created_at": m.created_at
            }
            for m in messages
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching messages: {e}")
