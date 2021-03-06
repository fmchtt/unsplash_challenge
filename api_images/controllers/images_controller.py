import typing
from fastapi import UploadFile, File
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
import shutil
import os
from pathlib import Path

from sqlalchemy.sql.expression import or_
from api_images.models import images_model, tags_model, user_model
from api_images.schemas import images_schema
from datetime import datetime

def lista_imagens(db: Session, p: str, url: str, user_id: typing.Optional[int] = None, skip: int = 0, limit: int = 100):
    if p:
        images = db.query(images_model.Images).filter(or_(images_model.Images.tags.any(tags_model.Tags.name.like(f"%{p}%")),images_model.Images.title.like(f"%{p}%"))).offset(skip).limit(limit).all()
    else:
        images = db.query(images_model.Images).order_by(images_model.Images.id.desc()).offset(skip).limit(limit).all()

    if user_id:
       user = db.query(user_model.User).filter(user_model.User.id == user_id).first()

    for image in images:
        image.path = f'{url}{image.path}'
        image.image_likes = len(image.likes)
        if user_id:
            if user in image.likes:
                image.user_liked = True

        if image.owner.avatar_url and not str(url) in image.owner.avatar_url:
            image.owner.avatar_url = f'{url}{image.owner.avatar_url}'
    
    return images
    

def criar_imagem(db: Session, user_id: int, title: str, description: str, tag: int, url: str,file: UploadFile = File(...)):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
    if file.content_type not in ['image/png', 'image/jpeg', 'image/webp', 'image/gif']:
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

    
    image_obj.image_likes = len(image_obj.likes)
    if image_obj.owner.avatar_url:
        image_obj.owner.avatar_url = f'{url}{image_obj.owner.avatar_url}'
    image_obj.path = f'{url}{image_obj.path}'
    if user in image_obj.likes:
        image_obj.user_liked = True
    return image_obj

def adicionar_tag(db: Session, image_id: int, user_id: int, tag_id, url: str):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()

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

    image.image_likes = len(image.likes)
    if user in image.likes:
        image.user_liked = True
    if image.owner.avatar_url:
        image.owner.avatar_url = f'{url}{image.owner.avatar_url}'
    image.path = f'{url}{image.path}'

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

def buscar_imagem(db: Session, image_id: int, url: str, user_id: typing.Optional[int] = None):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()

    if user_id:
        user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
        if user in image.likes:
            image.user_liked = True

    if not image:
        raise HTTPException(404, detail='Imagem não encontrada!')

    image.image_likes = len(image.likes)
    image.path = f'{url}{image.path}'
    if image.owner.avatar_url:
            image.owner.avatar_url = f'{url}{image.owner.avatar_url}'

    return image

def editar_imagem(db: Session, image_edit: images_schema.ImageEdit,image_id:int, user_id:int, url: str):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()

    if not image:
        raise HTTPException(404, detail='Imagem não encontrada!')

    if not image.owner_id == user_id:
        raise HTTPException(401, detail='Não autorizado, somente o dono pode alterar a imagem!')

    image.title = image_edit.title
    image.description = image_edit.description
    db.commit()
    db.refresh(image)

    if user in image.likes:
        image.user_liked = True
    image.image_likes = len(image.likes)
    image.path = f'{url}{image.path}'
    if image.owner.avatar_url:
            image.owner.avatar_url = f'{url}{image.owner.avatar_url}'

    return image


def remover_tags(db: Session, image_id: int, user_id: str, tag_id, url: str):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()

    if not image:
        raise HTTPException(404, detail='Imagem não encontrada!')

    if not user_id == image.owner_id:
        raise HTTPException(401, detail='Não autorizado, somente o dono pode adicionar tags a imagem!')

    tag = db.query(tags_model.Tags).filter(tags_model.Tags.id == tag_id).first()

    if not tag:
        raise HTTPException(404, detail='Tag não encontrada!')

    image.tags.remove(tag)

    db.commit()
    db.refresh(image)

    image.image_likes = len(image.likes)
    if user in image.likes:
        image.user_liked = True
    if image.owner.avatar_url:
        image.owner.avatar_url = f'{url}{image.owner.avatar_url}'
    image.path = f'{url}{image.path}'

    return image


def like_image(db: Session, image_id:int, user_id:int, url: str):
    image = db.query(images_model.Images).filter(images_model.Images.id == image_id).first()
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()

    if not image:
        raise HTTPException(404, detail='Imagem não encontrada!')

    if not user:
        raise HTTPException(404, detail='Usuario não encontrada!')

    if user in image.likes:
        image.likes.remove(user)
    else:
        image.likes.append(user)

    db.commit()
    db.refresh(image)

    image.image_likes = len(image.likes)
    if user in image.likes:
        image.user_liked = True
    image.path = f'{url}{image.path}'
    if image.owner.avatar_url:
            image.owner.avatar_url = f'{url}{image.owner.avatar_url}'

    return image