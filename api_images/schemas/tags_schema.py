from typing import List, Optional
from pydantic import BaseModel

class Images(BaseModel):
  id: int
  title: str
  description: Optional[str] = None
  path: str
  owner_id: int

  class Config:
    orm_mode = True

class TagsBase(BaseModel):
  id: int
  name: str

  class Config:
    orm_mode = True

class Tags(TagsBase):
  #images = List[Images]
  pass