from fastapi import UploadFile, File
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
import shutil
import os
from pathlib import Path
from api_images.models import images_model, tags_model
from api_images.schemas import images_schema
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent.parent


def listar_imagens(db: Session, skip: int = 0, limit: int = 100):
    return db.query(images_model.Images).offset(skip).limit(limit).all()

def lista_tags(db: Session, q: str ,skip: int = 0, limit: int = 100):
    return db.query(images_model.Images).filter(images_model.Images.tags.any(tags_model.Tags.name.like(f"%{q}%"))).offset(skip).limit(limit).all()

def criar_imagem(db: Session, user_id: int, title: str, description: str, tag: int, file: UploadFile = File(...)):
    date = datetime.now()

    image_obj = images_model.Images(title=title, description=description, path=f"uploads/{str(date.day)}/{str(date.month)}/{str(date.year)}/{date.date()}-{date.time()}-{file.filename}", owner_id=user_id)

    tags = db.query(tags_model.Tags).filter(tags_model.Tags.id == tag).first()
    
    if tags:
        image_obj.tags.append(tags)
    else:
        raise HTTPException(404, detail="Tag não encontrada!")

    db.add(image_obj)
    db.commit()

    if not os.path.exists(f'uploads/{str(date.day)}/{str(date.month)}/{str(date.year)}/'):
        os.makedirs(f'uploads/{str(date.day)}/{str(date.month)}/{str(date.year)}/')

    with open(f'uploads/{str(date.day)}/{str(date.month)}/{str(date.year)}/{date.date()}-{date.time()}-{file.filename}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)

    db.refresh(image_obj)

    return image_obj

def adicionar_tag(db: Session, image_id: int, user_id: str, tag_id):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()

    if not image:
        raise HTTPException(404, detail='Imagem não encontrada!')

    if not user_id == image.owner_id:
        raise HTTPException(401, detail='Não autorizado, somente o dono pode adicionar tags a imagem!')

    tag = db.query(tags_model.Tags).filter(tags_model.Tags.id == tag_id).first()

    if not tag:
        raise HTTPException(404, detail='Tag não encontrada!')

    image.tags.append(tag)

    db.commit()
    db.refresh(image)

    return image

def deletar_imagem(db: Session, image_id: int, user_id: str):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()

    if not image:
        raise HTTPException(404, detail='Imagem não encontrada!')

    if not image.owner_id == user_id:
        raise HTTPException(401, detail='Não autorizado, somente o dono pode apagar a imagem!')

    db.delete(image)
    db.commit()
    return images_schema.ImagesDelete(message="Imagem deletada com sucesso")

def buscar_imagem(db: Session, image_id: int):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()

    if not image:
        raise HTTPException(404, detail='Imagem não encontrada!')

    return image