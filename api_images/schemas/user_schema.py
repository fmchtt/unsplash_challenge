from typing import List, Optional
from pydantic import BaseModel

class Images(BaseModel):
    title: str
    description: Optional[str] = None
    path: str
    id: int
    image_likes: int
    user_liked: Optional[bool] = False

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str  

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    id: int
    avatar_url: Optional[str] = None
    is_active: bool

    class Config:
        orm_mode = True

class User(UserBase):
    id: int
    avatar_url: Optional[str] = None
    is_active: bool
    images: List[Images]

    class Config:
        orm_mode = True