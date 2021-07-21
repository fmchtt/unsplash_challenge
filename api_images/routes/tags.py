from fastapi import APIRouter, Depends, Request
from api_images.database import SessionLocal
from sqlalchemy.orm import Session
from api_images.schemas import tags_schema, images_schema
from api_images.controllers import tags_controller, images_controller
from typing import List
from api_images.routes.auth import decript_token, oauth2_scheme, optional_oauth2_scheme

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

@router.post("/add/{image_id:int}/tag/{tag_id:int}/", response_model=images_schema.Images)
def adicionar_tag_na_imagem(request: Request,image_id: int, tag_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
  user_id = decript_token(token)
  return images_controller.adicionar_tag(db, image_id, user_id.get('id'), tag_id, request.base_url)

@router.post("/add/", response_model=tags_schema.TagsBase, status_code=201)
def criar_tag(tag: tags_schema.TagsCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
  user_id = decript_token(token)
  return tags_controller.criar_tag(db, tag.name)

@router.get('/{tag_id:int}/', response_model=tags_schema.Tags)
def buscar_tag(tag_id: int, request: Request, db: Session = Depends(get_db), token: str = Depends(optional_oauth2_scheme)):
  if token:
    user_id = decript_token(token).get('id')
  else:
    user_id = None
  return tags_controller.buscar_tag(db, tag_id, request.base_url, user_id)


@router.delete("/remove/{image_id:int}/tag/{tag_id:int}/", response_model=images_schema.Images)
def remover_tag_imagem(request: Request, image_id: int, tag_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
  user_id = decript_token(token)
  return images_controller.remover_tags(db, image_id, user_id.get('id'), tag_id, request.base_url)