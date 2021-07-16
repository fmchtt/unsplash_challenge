from api_images.models import user_model
from api_images.schemas import user_schema
from api_images.routes.auth import hash_password
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from datetime import datetime
import os
import shutil

def buscar_usuario(db: Session, user_id: int, url: str):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
    
    if user.avatar_url:
        user.avatar_url = f'{url}{user.avatar_url}'

    for image in user.images:
        image.path = f'{url}{image.path}'

    return user

def get_user_by_email(db: Session, email: str):
    user = db.query(user_model.User).filter(user_model.User.email == email).first()
    
    return user

def listar_usuarios(db: Session, url:str, skip: int = 0, limit: int = 100):
    users = db.query(user_model.User).offset(skip).limit(limit).all()

    for user in users:
        if user.avatar_url:
            user.avatar_url = f'{url}{user.avatar_url}'

        for image in user.images:
            image.path = f'{url}{image.path}'

    return users

def criar_usuario(db: Session, user: user_schema.UserCreate):
    db_user = user_model.User(email=user.email, hashed_password=hash_password(user.password), username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verificar_usuario(db: Session, user_id: int, url:str):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()

    if user.avatar_url:
        user.avatar_url = f'{url}{user.avatar_url}'

    for image in user.images:
            image.path = f'{url}{image.path}'
            
    return user

def alterar_avatar(db: Session, user_id: int, file: UploadFile, url: str):
    if file.content_type not in ['image/png', 'image/jpeg', 'image/webp', 'image/gif']:
        raise HTTPException(400, detail='Tipo de arquivo não aceito!')

    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()

    if not user:
        raise HTTPException(404, detail="Usuario nao encontrado")

    date = datetime.now()
    folder_path = f"uploads/{str(date.year)}/{str(date.month)}/{str(date.day)}/"
    image_path = f"{folder_path}({date.hour}h{date.minute}m{date.second}s)-{file.filename}"

    user.avatar_url = image_path

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    with open(image_path, 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)

    db.commit()
    db.refresh(user)

    if user.avatar_url:
        user.avatar_url = f'{url}{user.avatar_url}'

    for image in user.images:
            image.path = f'{url}{image.path}'

    return user