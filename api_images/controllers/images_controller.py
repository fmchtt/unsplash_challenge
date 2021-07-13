from fastapi import UploadFile, File
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
import shutil
import os
from pathlib import Path
from api_images.models import images_model, tags_model
from api_images.schemas import images_schema
from datetime import datetime

def lista_imagens(db: Session, tag: str, title: str ,skip: int = 0, limit: int = 100):
    if title and not tag:
        return db.query(images_model.Images).filter(images_model.Images.title.like(f"%{title}%")).offset(skip).limit(limit).all()
    elif tag and not title:
        return db.query(images_model.Images).filter(images_model.Images.tags.any(tags_model.Tags.name.like(f"%{tag}%"))).offset(skip).limit(limit).all()
    elif tag and title:
        return db.query(images_model.Images).filter(images_model.Images.tags.any(tags_model.Tags.name.like(f"%{tag}%"))).filter(images_model.Images.title.like(f"%{title}%")).offset(skip).limit(limit).all()
    else:
        return db.query(images_model.Images).offset(skip).limit(limit).all()
    

def criar_imagem(db: Session, user_id: int, title: str, description: str, tag: int, file: UploadFile = File(...)):
    if file.content_type not in ['image/png', 'image/jpeg', 'image/webp']:
        raise HTTPException(400, detail='Tipo de arquivo não aceito!')

    date = datetime.now()
    folder_path = f"uploads/{str(date.year)}/{str(date.month)}/{str(date.day)}/"
    image_path = f"{folder_path}({date.hour}h{date.minute}m{date.second}s)-{file.filename}"

    image_obj = images_model.Images(title=title, description=description, path=image_path, owner_id=user_id)

    tags = db.query(tags_model.Tags).filter(tags_model.Tags.id == tag).first()
    
    if tags:
        image_obj.tags.append(tags)
    else:
        raise HTTPException(404, detail="Tag não encontrada!")

    db.add(image_obj)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    with open(image_path, 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    db.commit()
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
    os.remove(image.path)

    db.commit()
    return images_schema.ImagesDelete(message="Imagem deletada com sucesso")

def buscar_imagem(db: Session, image_id: int):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()

    if not image:
        raise HTTPException(404, detail='Imagem não encontrada!')

    return image