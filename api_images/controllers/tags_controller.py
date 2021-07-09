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