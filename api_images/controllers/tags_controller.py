from sqlalchemy.orm import Session
from api_images.models import tags_model, user_model
from fastapi import HTTPException


def listar_tags(db: Session):
  return db.query(tags_model.Tags).all()

def criar_tag(db: Session, nome: str):
  tag_obj = tags_model.Tags(name=nome)
  db.add(tag_obj)
  db.commit()
  db.refresh(tag_obj)
  return tag_obj

def buscar_tag(db: Session, tag_id: int, url: str, user_id: int):
  tag = db.query(tags_model.Tags).filter(tags_model.Tags.id == tag_id).first()

  if not tag:
    raise HTTPException(404, detail='Tag nao encontrado!')

  if user_id:
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()

  for image in tag.images:
    image.path = f"{url}{image.path}"
    image.image_likes = len(image.likes)
    if user_id:
      if user in image.likes:
          image.user_liked = True
    
  return tag
