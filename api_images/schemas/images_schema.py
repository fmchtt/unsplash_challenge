from typing import List, Optional
from pydantic import BaseModel

class User(BaseModel):
    email: str
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class ImagesBase(BaseModel):
    title: str
    description: Optional[str] = None
    path: str
    owner_id: int

class ImagesCreate(ImagesBase):
    pass

class ImagesDelete(BaseModel):
    message: str

class Images(ImagesBase):
    id: int
    #owner: User

    class Config:
        orm_mode = True