from fastapi import UploadFile, File, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
import shutil
from pathlib import Path
from api_images.models import images_model
from api_images.schemas import images_schema
from api_images.routes.auth import decript_token

BASE_DIR = Path(__file__).resolve().parent.parent


def listar_imagens(db: Session, skip: int = 0, limit: int = 100):
    return db.query(images_model.Images).offset(skip).limit(limit).all()

def lista_tags(db: Session, q: str ,skip: int = 0, limit: int = 100):
    return db.query(images_model.Images).filter(images_model.Images.tag.like(f"%{q}%")).offset(skip).limit(limit).all()

def criar_imagem(db: Session, user_id: int, title: str, description: str, tag: str, file: UploadFile = File(...)):
    with open(f"uploads/{file.filename}", 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_obj = images_model.Images(title=title, description=description, tag=tag, path=f"static/{file.filename}", owner_id=user_id)
    
    db.add(image_obj)
    db.commit()
    db.refresh(image_obj)
    return image_obj

def deletar_imagem(db: Session, image_id: int, user_id: str):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()
    if(image.owner_id == user_id):
        db.delete(image)
        db.commit()
        return images_schema.ImagesDelete(message="Imagem deletada com sucesso")
    else:
        return HTTPException(401, detail='Não autorizado, somente o dono pode apagar a imagem!')

def buscar_imagem(db: Session, image_id: int):
    return db.query(images_model.Images).filter(images_model.Images.id == image_id).first()