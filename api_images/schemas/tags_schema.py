from typing import List, Optional
from pydantic import BaseModel

class User(BaseModel):
    username: str
    id: int
    avatar_url: Optional[str] = None

    class Config:
        orm_mode = True

class Images(BaseModel):
  id: int
  title: str
  description: Optional[str] = None
  path: str
  owner: User
  user_liked: Optional[bool] = False
  image_likes: int

  class Config:
    orm_mode = True

class TagsCreate(BaseModel):
  name: str

class TagsBase(BaseModel):
  id: int
  name: str

  class Config:
    orm_mode = True

class Tags(TagsBase):
  images: List[Images]

  class Config:
    orm_mode = True