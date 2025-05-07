from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore
from app.dependencies.auth import get_current_admin, get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserCreate
from app.utils.auth import hash_password
from typing import List

router = APIRouter()

# Get all users
@router.get("/", response_model=List[UserResponse])
@router.get("/")
def get_users(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
    search: str = "",
    page: int = 1,
    limit: int = 5
):
    query = db.query(User)

    if search:
        query = query.filter(
            or_(
                User.username.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )

    total = query.count()
    users = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "users": users,
        "total_pages": (total // limit) + (1 if total % limit else 0)
    }

# Get user by ID
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Create a new user (Admin use only)
@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

from fastapi import Request  # Add at the top

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    updated_data = await request.json()

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if 'password' in updated_data:
        updated_data['hashed_password'] = hash_password(updated_data.pop('password'))

    if 'role' in updated_data:
        # Map role string to is_admin boolean
        updated_data['is_admin'] = updated_data.pop('role') == "Admin"

    for key, value in updated_data.items():
        if hasattr(user, key):
            setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


# Delete user
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": f"User with id {user_id} deleted successfully"}
