from pydantic import BaseModel, EmailStr  # type: ignore

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str
    is_admin: bool = False  # ✅ Add this line to allow setting admin status

class UserResponse(UserBase):
    id: int
    is_admin: bool

    class Config:
        from_attributes = True
