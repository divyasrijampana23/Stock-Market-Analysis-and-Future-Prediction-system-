from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.utils.auth import hash_password, verify_password, create_access_token

router = APIRouter()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Register a new user
@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password),
        is_admin=user.is_admin if hasattr(user, "is_admin") else False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user



# ✅ Login and return JWT token
@router.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Add is_admin to token payload for admin route protection
    access_token = create_access_token(
        data={
            "sub": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    )
    return {"access_token": access_token, "token_type": "bearer"}
