from sqlalchemy.orm import Session
from api_images.models import tags_model

def listar_tags(db: Session):
  return db.query(tags_model.Tags).all()