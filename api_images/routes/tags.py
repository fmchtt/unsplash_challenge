from fastapi import APIRouter, Depends
from api_images.database import SessionLocal
from sqlalchemy.orm import Session
from api_images.schemas import tags_schema, images_schema
from api_images.controllers import tags_controller, images_controller
from typing import List
from api_images.routes.auth import decript_token, oauth2_scheme

router = APIRouter()

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[tags_schema.TagsBase])
def listar_tags(db: Session = Depends(get_db)):
  return tags_controller.listar_tags(db)

@router.post("/add/{image_id}/tag/{tag_id}/", response_model=images_schema.Images)
def adicionar_tag_na_imagem(image_id: int, tag_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
  user_id = decript_token(token)
  return images_controller.adicionar_tag(db, image_id, user_id.get('id'), tag_id)

@router.post("/add/", response_model=tags_schema.Tags)
def criar_tag(tag: tags_schema.TagsCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
  return tags_controller.criar_tag(db, tag.name)