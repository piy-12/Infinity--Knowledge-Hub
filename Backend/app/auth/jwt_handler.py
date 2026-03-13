from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# =====================================================
# CONFIGURATION
# =====================================================
SECRET_KEY = "piyush@123"  # ⚠️ Change to a strong secret in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# FastAPI built-in OAuth2 helper
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# =====================================================
# TOKEN CREATION
# =====================================================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# =====================================================
# TOKEN VERIFICATION
# =====================================================
def verify_token(token: str):
    """
    Decode the JWT token and return the payload.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired, please login again.",
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token, please login again.",
        )

# =====================================================
# DEPENDENCY FOR ROUTES
# =====================================================
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = verify_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    user_id = payload.get("id")
    username = payload.get("username")
    full_name = payload.get("full_name")
    avatar_url = payload.get("avatar_url")
    role = payload.get("role")  # ✅ include role

    if user_id is None or username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload.",
        )

    return {
        "id": user_id,
        "username": username,
        "full_name": full_name,
        "avatar_url": avatar_url,
        "role": role  # ✅ return role
    }



