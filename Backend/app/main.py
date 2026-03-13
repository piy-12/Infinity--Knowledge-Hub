from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Routers
from app.routes.genai_routes import router as GenAIRouter
from app.routes.notes_routes import router as NotesRouter
from app.routes.auth_routes import router as AuthRouter
from app.routes.dictionary import router as DictionaryRouter
from app.routes.analytics import router as AnalyticsRouter
from app.routes.library import router as LibraryRouter  # ✅ NEW ROUTER

# Database
from app.database import db

# =====================================================
# APP INITIALIZATION
# =====================================================
app = FastAPI(
    title="Knowledge Hub API",
    description="Backend for authentication, analytics, dictionary, and open library system.",
    version="2.0.0",
)

# =====================================================
# STATIC FILES
# =====================================================

# User avatar images
app.mount("/avatars", StaticFiles(directory="app/static/avatars"), name="avatars")

# 📚 Uploaded book files (PDF, TXT, EPUB)
app.mount("/books", StaticFiles(directory="app/uploads/files"), name="books")

# Make sure directory exists
os.makedirs("app/uploads/files", exist_ok=True)

# =====================================================
# MIDDLEWARE (CORS)
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# ROUTES
# =====================================================
app.include_router(AuthRouter, prefix="/auth")
app.include_router(GenAIRouter, prefix="/genai")
app.include_router(NotesRouter, prefix="/notes")
app.include_router(DictionaryRouter, prefix="/dictionary")
app.include_router(AnalyticsRouter, prefix="/analytics")
app.include_router(LibraryRouter, prefix="/library")  # ✅ Your Library API works now

# =====================================================
# DATABASE INIT
# =====================================================
db.Base.metadata.create_all(bind=db.engine)
