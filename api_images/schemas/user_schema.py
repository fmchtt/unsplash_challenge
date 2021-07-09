from typing import List, Optional
from pydantic import BaseModel

class Images(BaseModel):
    title: str
    description: Optional[str] = None
    path: str
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str    

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    images: List[Images]

    class Config:
        orm_mode = True