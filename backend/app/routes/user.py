from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/profile")
def user_profile(current_user=Depends(get_current_user)):
    return {"message": f"Welcome {current_user.username}"}
