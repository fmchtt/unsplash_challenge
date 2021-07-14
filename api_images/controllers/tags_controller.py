from sqlalchemy.orm import Session
from api_images.models import tags_model

def listar_tags(db: Session):
  return db.query(tags_model.Tags).all()

def criar_tag(db: Session, nome: str):
  tag_obj = tags_model.Tags(name=nome)
  db.add(tag_obj)
  db.commit()
  db.refresh(tag_obj)
  return tag_obj

def buscar_tag(db: Session, tag_id: int, url: str):
  tag = db.query(tags_model.Tags).filter(tags_model.Tags.id == tag_id).first()

  for image in tag.images:
    image.path = f"{url}{image.path}"
    
  return tag
